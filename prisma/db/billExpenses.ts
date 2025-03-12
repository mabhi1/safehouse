import prisma from "..";
import { getBillGroupWithAllMembersById } from "./billGroups";

export async function createBillExpense(
  title: string,
  amount: number,
  currencyId: string,
  paidBy: string,
  groupId: string,
  splitType: "equal" | "percentage" | "amount",
  addedBy: string,
  description?: string,
  shares: { memberId: string; amount: number; percentage?: number }[] = [],
  imageUrl?: string
) {
  try {
    // Use a transaction to create the expense and add a history entry
    const data = await prisma.$transaction(async (tx) => {
      // Create the expense
      const newExpense = await tx.billExpense.create({
        data: {
          title,
          description,
          amount,
          currencyId,
          paidBy,
          addedBy,
          groupId,
          splitType,
          shares: {
            create: shares.map((share) => ({
              memberId: share.memberId,
              amount: share.amount,
              percentage: share.percentage,
            })),
          },
          imageUrl,
        },
        include: {
          shares: {
            include: {
              member: true,
            },
          },
          currency: true,
        },
      });

      // Add a history entry for the creation
      await tx.expenseHistory.create({
        data: {
          expenseId: newExpense.id,
          updatedBy: addedBy,
          changes: {
            creation: { old: null, new: true },
          },
        },
      });

      return newExpense;
    });

    return { data, error: null };
  } catch (error) {
    console.error("Error creating bill expense:", error);
    return { data: null, error: "Failed to create bill expense" };
  }
}

export async function getBillExpensesByGroup(groupId: string) {
  try {
    const data = await prisma.billExpense.findMany({
      where: {
        groupId,
      },
      include: {
        shares: {
          include: {
            member: true,
          },
        },
        currency: true,
        history: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error getting bill expenses:", error);
    return { data: null, error: "Failed to get bill expenses" };
  }
}

export async function getBillExpenseById(id: string) {
  try {
    const data = await prisma.billExpense.findUnique({
      where: {
        id,
      },
      include: {
        shares: {
          include: {
            member: true,
          },
        },
        currency: true,
        history: true,
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error getting bill expense:", error);
    return { data: null, error: "Failed to get bill expense" };
  }
}

export async function deleteBillExpense(id: string) {
  try {
    // First delete all shares associated with this expense
    await prisma.billShare.deleteMany({
      where: {
        expenseId: id,
      },
    });

    // Then delete the expense itself
    const data = await prisma.billExpense.delete({
      where: {
        id,
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error deleting bill expense:", error);
    return { data: null, error: "Failed to delete bill expense" };
  }
}

export async function getUserExpenseSummary(groupId: string, userId: string) {
  try {
    // Get all expenses in the group
    const expenses = await prisma.billExpense.findMany({
      where: {
        groupId,
      },
      include: {
        shares: {
          include: {
            member: true,
          },
        },
        currency: true,
      },
    });

    // Calculate how much the user has paid
    const paid = expenses
      .filter((expense) => expense.paidBy === userId)
      .reduce((acc, expense) => {
        const currencyCode = expense.currency.code;
        if (!acc[currencyCode]) {
          acc[currencyCode] = 0;
        }

        // Find the user's own share in this expense
        const userShare = expense.shares.find((share) => share.member.userId === userId);
        const userShareAmount = userShare ? userShare.amount : 0;

        // Add the total amount minus the user's own share
        acc[currencyCode] += expense.amount - userShareAmount;

        return acc;
      }, {} as Record<string, number>);

    // Calculate how much the user owes
    const owes = expenses.reduce((acc, expense) => {
      const currencyCode = expense.currency.code;

      // Find the user's share in this expense
      const userShare = expense.shares.find((share) => share.member.userId === userId);

      // Only add to owes if the user didn't pay for this expense
      if (userShare && expense.paidBy !== userId) {
        if (!acc[currencyCode]) {
          acc[currencyCode] = 0;
        }
        acc[currencyCode] += userShare.amount;
      }

      return acc;
    }, {} as Record<string, number>);

    // Calculate the net balance
    const balance: Record<string, number> = {};

    // Initialize balance for all currencies
    const allCurrencies = new Set([...Object.keys(paid), ...Object.keys(owes)]);

    // Calculate balance for each currency
    allCurrencies.forEach((currency) => {
      const paidAmount = paid[currency] || 0;
      const owedAmount = owes[currency] || 0;
      balance[currency] = paidAmount - owedAmount;
    });

    return {
      data: {
        paid,
        owes,
        balance,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error getting user expense summary:", error);
    return { data: null, error: "Failed to get user expense summary" };
  }
}

export async function getGroupExpenseSummary(groupId: string) {
  try {
    // Get all members in the group, including removed ones
    const { data: group, error: groupError } = await getBillGroupWithAllMembersById(groupId);

    if (groupError || !group) {
      return { data: null, error: groupError || "Group not found" };
    }

    // Find the creator member
    const creator = group.members.find((member) => member.isCreator);
    if (!creator) {
      return { data: null, error: "Group creator not found" };
    }

    // Get all expenses in the group
    const expenses = await prisma.billExpense.findMany({
      where: {
        groupId,
      },
      include: {
        shares: {
          include: {
            member: true,
          },
        },
        currency: true,
      },
    });

    // Create a map of user IDs to names and emails
    const userMap: Record<string, { name: string; email: string }> = {};

    // Calculate summary for each member
    const memberSummaries: Record<
      string,
      {
        userId: string;
        isGroupOwner: boolean;
        isRemoved?: boolean;
        paid: Record<string, number>;
        owes: Record<string, number>;
        balance: Record<string, number>;
        debts: Record<string, Record<string, number>>; // Who owes this user
        credits: Record<string, Record<string, number>>; // Who this user owes to
      }
    > = {};

    // Initialize summaries for all members
    group.members.forEach((member) => {
      memberSummaries[member.userId] = {
        userId: member.userId,
        isGroupOwner: member.isCreator,
        isRemoved: false, // Default to false, we'll update this based on group membership
        paid: {},
        owes: {},
        balance: {},
        debts: {}, // Who owes this user (by userId)
        credits: {}, // Who this user owes to (by userId)
      };
    });

    // Also collect all unique user IDs from expenses (to include users who may have been removed)
    const expenseUserIds = new Set<string>();

    // Add payers
    expenses.forEach((expense) => {
      expenseUserIds.add(expense.paidBy);
    });

    // Add users with shares
    expenses.forEach((expense) => {
      expense.shares.forEach((share) => {
        expenseUserIds.add(share.member.userId);
      });
    });

    // Add any users from expenses who aren't already in the member summaries
    expenseUserIds.forEach((userId) => {
      if (!memberSummaries[userId]) {
        memberSummaries[userId] = {
          userId,
          isGroupOwner: false,
          isRemoved: true, // Assume this user was removed since they're not in the current members list
          paid: {},
          owes: {},
          balance: {},
          debts: {},
          credits: {},
        };
      }
    });

    // Calculate how much each member has paid
    expenses.forEach((expense) => {
      const currencyCode = expense.currency.code;
      const paidBy = expense.paidBy;

      if (!memberSummaries[paidBy]) {
        memberSummaries[paidBy] = {
          userId: paidBy,
          isGroupOwner: false, // Default to false for unknown users
          isRemoved: false, // Default to false for unknown users
          paid: {},
          owes: {},
          balance: {},
          debts: {},
          credits: {},
        };
      }

      if (!memberSummaries[paidBy].paid[currencyCode]) {
        memberSummaries[paidBy].paid[currencyCode] = 0;
      }

      // Find the payer's own share in this expense
      const payerShare = expense.shares.find((share) => share.member.userId === paidBy);
      const payerShareAmount = payerShare ? payerShare.amount : 0;

      // Add the total amount minus the payer's own share
      memberSummaries[paidBy].paid[currencyCode] += expense.amount - payerShareAmount;
    });

    // Calculate how much each member owes and track debts between members
    expenses.forEach((expense) => {
      const currencyCode = expense.currency.code;
      const paidBy = expense.paidBy;

      expense.shares.forEach((share) => {
        const memberId = share.member.userId;

        // Skip if the member paid for this expense
        if (memberId === paidBy) return;

        // Update how much this member owes
        if (!memberSummaries[memberId].owes[currencyCode]) {
          memberSummaries[memberId].owes[currencyCode] = 0;
        }
        memberSummaries[memberId].owes[currencyCode] += share.amount;

        // Track who owes whom
        // The member owes the payer
        if (!memberSummaries[memberId].credits[paidBy]) {
          memberSummaries[memberId].credits[paidBy] = {};
        }
        if (!memberSummaries[memberId].credits[paidBy][currencyCode]) {
          memberSummaries[memberId].credits[paidBy][currencyCode] = 0;
        }
        memberSummaries[memberId].credits[paidBy][currencyCode] += share.amount;

        // The payer is owed by the member
        if (!memberSummaries[paidBy].debts[memberId]) {
          memberSummaries[paidBy].debts[memberId] = {};
        }
        if (!memberSummaries[paidBy].debts[memberId][currencyCode]) {
          memberSummaries[paidBy].debts[memberId][currencyCode] = 0;
        }
        memberSummaries[paidBy].debts[memberId][currencyCode] += share.amount;
      });
    });

    // Calculate the net balance for each member
    Object.values(memberSummaries).forEach((summary) => {
      // Initialize balance for all currencies
      const allCurrencies = new Set([...Object.keys(summary.paid), ...Object.keys(summary.owes)]);

      // Calculate balance for each currency
      allCurrencies.forEach((currency) => {
        const paidAmount = summary.paid[currency] || 0;
        const owedAmount = summary.owes[currency] || 0;
        summary.balance[currency] = paidAmount - owedAmount;
      });
    });

    // Simplify debts by netting out mutual debts
    Object.keys(memberSummaries).forEach((userId1) => {
      Object.keys(memberSummaries[userId1].credits).forEach((userId2) => {
        Object.keys(memberSummaries[userId1].credits[userId2] || {}).forEach((currency) => {
          const amount1 = memberSummaries[userId1].credits[userId2][currency] || 0;
          const amount2 = (memberSummaries[userId2].credits[userId1] || {})[currency] || 0;

          if (amount1 > 0 && amount2 > 0) {
            // Both users owe each other in the same currency
            if (amount1 > amount2) {
              // User1 owes more to User2 than User2 owes to User1
              memberSummaries[userId1].credits[userId2][currency] = amount1 - amount2;
              delete memberSummaries[userId2].credits[userId1]?.[currency];
            } else if (amount2 > amount1) {
              // User2 owes more to User1 than User1 owes to User2
              memberSummaries[userId2].credits[userId1][currency] = amount2 - amount1;
              delete memberSummaries[userId1].credits[userId2][currency];
            } else {
              // They owe the same amount, so they cancel out
              delete memberSummaries[userId1].credits[userId2][currency];
              delete memberSummaries[userId2].credits[userId1][currency];
            }

            // Update the debts accordingly
            if (amount1 > amount2) {
              memberSummaries[userId2].debts[userId1][currency] = amount1 - amount2;
              delete memberSummaries[userId1].debts[userId2]?.[currency];
            } else if (amount2 > amount1) {
              memberSummaries[userId1].debts[userId2][currency] = amount2 - amount1;
              delete memberSummaries[userId2].debts[userId1][currency];
            } else {
              delete memberSummaries[userId1].debts[userId2]?.[currency];
              delete memberSummaries[userId2].debts[userId1]?.[currency];
            }
          }
        });

        // Clean up empty objects
        if (Object.keys(memberSummaries[userId1].credits[userId2] || {}).length === 0) {
          delete memberSummaries[userId1].credits[userId2];
        }
        if (
          userId2 in memberSummaries &&
          memberSummaries[userId2].credits[userId1] &&
          Object.keys(memberSummaries[userId2].credits[userId1]).length === 0
        ) {
          delete memberSummaries[userId2].credits[userId1];
        }

        if (Object.keys(memberSummaries[userId1].debts[userId2] || {}).length === 0) {
          delete memberSummaries[userId1].debts[userId2];
        }
        if (
          userId2 in memberSummaries &&
          memberSummaries[userId2].debts[userId1] &&
          Object.keys(memberSummaries[userId2].debts[userId1]).length === 0
        ) {
          delete memberSummaries[userId2].debts[userId1];
        }
      });
    });

    return { data: Object.values(memberSummaries), error: null };
  } catch (error) {
    console.error("Error getting group expense summary:", error);
    return { data: null, error: "Failed to get group expense summary" };
  }
}

// Check if a member has any outstanding balances
export async function memberHasOutstandingBalances(memberId: string, groupId: string) {
  try {
    // First get the user ID for this member
    const member = await prisma.billMember.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      return { data: false, error: "Member not found" };
    }

    const userId = member.userId;

    // Get the group summary
    const { data: summaries, error } = await getGroupExpenseSummary(groupId);

    if (error || !summaries) {
      return { data: false, error };
    }

    // Find this member's summary
    const memberSummary = summaries.find((s) => s.userId === userId);

    if (!memberSummary) {
      return { data: false, error: "Member summary not found" };
    }

    // Check if the member has any non-zero balances
    const hasNonZeroBalances = Object.values(memberSummary.balance).some((amount) => Math.abs(amount) > 0.01);

    // Check if the member has any outstanding credits (owes money to others)
    const hasOutstandingCredits = Object.entries(memberSummary.credits).some(([_, currencies]) =>
      Object.values(currencies).some((amount) => Math.abs(amount) > 0.01)
    );

    // Check if the member has any outstanding debts (is owed money by others)
    const hasOutstandingDebts = Object.entries(memberSummary.debts).some(([_, currencies]) =>
      Object.values(currencies).some((amount) => Math.abs(amount) > 0.01)
    );

    return {
      data: hasNonZeroBalances || hasOutstandingCredits || hasOutstandingDebts,
      error: null,
    };
  } catch (error) {
    console.error("Error checking member balances:", error);
    return { data: false, error: "Failed to check member balances" };
  }
}

export async function updateBillExpense(
  id: string,
  title: string,
  amount: number,
  currencyId: string,
  splitType: "equal" | "percentage" | "amount",
  paidBy: string,
  updatedBy: string,
  description?: string,
  shares: { memberId: string; amount: number; percentage?: number }[] = [],
  imageUrl?: string
) {
  try {
    // Get the current expense to track changes
    const { data: currentExpense, error: fetchError } = await getBillExpenseById(id);

    if (fetchError || !currentExpense) {
      return { data: null, error: fetchError || "Expense not found" };
    }

    // Helper function for floating point comparison
    const areNumbersEqual = (a: number, b: number, epsilon = 0.001) => {
      return Math.abs(a - b) < epsilon;
    };

    // Prepare changes object to track what was modified
    const changes: Record<string, { old: any; new: any }> = {};

    if (currentExpense.imageUrl !== imageUrl) {
      changes.imageUrl = { old: currentExpense.imageUrl, new: imageUrl };
    }

    // Only track changes if values are actually different
    if (currentExpense.title !== title) {
      changes.title = { old: currentExpense.title, new: title };
    }

    // Handle description changes - treat null and empty string as equivalent
    const oldDesc = currentExpense.description || null;
    const newDesc = description || null;
    if (oldDesc !== newDesc && !(oldDesc === null && newDesc === "")) {
      changes.description = { old: oldDesc, new: newDesc };
    }

    // Use floating point comparison for amount
    if (!areNumbersEqual(currentExpense.amount, amount)) {
      changes.amount = { old: currentExpense.amount, new: amount };
    }

    if (currentExpense.currencyId !== currencyId) {
      changes.currencyId = { old: currentExpense.currencyId, new: currencyId };
    }

    if (currentExpense.splitType !== splitType) {
      changes.splitType = { old: currentExpense.splitType, new: splitType };
    }

    if (currentExpense.paidBy !== paidBy) {
      changes.paidBy = { old: currentExpense.paidBy, new: paidBy };
    }

    // Track share changes - only if they actually changed
    const oldShares = currentExpense.shares.map((share) => ({
      memberId: share.memberId,
      amount: share.amount,
      percentage: share.percentage,
    }));

    // More accurate comparison of shares
    const sharesChanged = (() => {
      // Different number of shares
      if (oldShares.length !== shares.length) {
        return true;
      }

      // Sort both arrays by memberId to ensure consistent comparison
      const sortedOldShares = [...oldShares].sort((a, b) => a.memberId.localeCompare(b.memberId));
      const sortedNewShares = [...shares].sort((a, b) => a.memberId.localeCompare(b.memberId));

      // First check if the member IDs are the same
      const oldMemberIds = sortedOldShares.map((share) => share.memberId).sort();
      const newMemberIds = sortedNewShares.map((share) => share.memberId).sort();

      if (JSON.stringify(oldMemberIds) !== JSON.stringify(newMemberIds)) {
        return true;
      }

      // If member IDs are the same, check if amounts or percentages changed
      for (let i = 0; i < sortedOldShares.length; i++) {
        const oldShare = sortedOldShares[i];
        const newShare = sortedNewShares.find((s) => s.memberId === oldShare.memberId);

        if (!newShare) continue; // Should not happen if member IDs are the same

        // Check if amount changed (with small epsilon for floating point comparison)
        if (!areNumbersEqual(oldShare.amount, newShare.amount)) {
          return true;
        }

        // Check if percentage changed (with small epsilon for floating point comparison)
        const oldPercentage = oldShare.percentage || 0;
        const newPercentage = newShare.percentage || 0;
        if (!areNumbersEqual(oldPercentage, newPercentage)) {
          return true;
        }
      }

      return false;
    })();

    if (sharesChanged) {
      changes.shares = { old: oldShares, new: shares };
    }

    // First delete all existing shares
    await prisma.billShare.deleteMany({
      where: {
        expenseId: id,
      },
    });

    // Create transaction to update expense and add history entry
    const data = await prisma.$transaction(async (tx) => {
      // Update the expense
      const updatedExpense = await tx.billExpense.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          amount,
          currencyId,
          splitType,
          paidBy,
          shares: {
            create: shares.map((share) => ({
              memberId: share.memberId,
              amount: share.amount,
              percentage: share.percentage,
            })),
          },
          imageUrl,
        },
        include: {
          shares: {
            include: {
              member: true,
            },
          },
          currency: true,
        },
      });

      // Create history entry if there are changes
      if (Object.keys(changes).length > 0) {
        await tx.expenseHistory.create({
          data: {
            expenseId: id,
            updatedBy,
            changes: changes as any,
          },
        });
      }

      return updatedExpense;
    });

    return { data, error: null };
  } catch (error) {
    console.error("Error updating bill expense:", error);
    return { data: null, error: "Failed to update bill expense" };
  }
}

export async function deleteBillExpenseImage(id: string, updatedBy: string) {
  try {
    const { data: currentExpense, error: fetchError } = await getBillExpenseById(id);

    if (fetchError || !currentExpense) {
      return { data: null, error: fetchError || "Expense not found" };
    }

    const changes = { imageUrl: { old: currentExpense.imageUrl, new: null } };

    const data = await prisma.$transaction(async (tx) => {
      await tx.billExpense.update({
        where: { id },
        data: { imageUrl: { unset: true } },
      });

      await tx.expenseHistory.create({
        data: {
          expenseId: id,
          updatedBy,
          changes: changes as any,
        },
      });
    });

    return { data, error: null };
  } catch (error) {
    console.error("Error deleting bill expense image:", error);
    return { data: null, error: "Failed to delete bill expense image" };
  }
}
