"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History } from "lucide-react";
import { useState } from "react";
import { UserResult } from "@/lib/db-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

type ExpenseHistoryProps = {
  expenseId: string;
  history: {
    id: string;
    updatedBy: string;
    changes: Record<string, { old: any; new: any }>;
    createdAt: Date;
  }[];
  users: UserResult[];
  currentUserId: string;
};

export default function ExpenseHistory({ history, users, currentUserId }: ExpenseHistoryProps) {
  const [open, setOpen] = useState(false);

  const getUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  // Helper function for floating point comparison
  const areNumbersEqual = (a: number, b: number, epsilon = 0.001) => {
    return Math.abs(a - b) < epsilon;
  };

  // Helper function to check if two values are effectively the same
  const areValuesEqual = (oldVal: any, newVal: any) => {
    // Handle null/undefined/empty string equivalence
    if (
      (oldVal === null || oldVal === undefined || oldVal === "") &&
      (newVal === null || newVal === undefined || newVal === "")
    ) {
      return true;
    }

    // For numbers, use epsilon comparison
    if (typeof oldVal === "number" && typeof newVal === "number") {
      return areNumbersEqual(oldVal, newVal);
    }

    // For arrays (like shares), compare stringified versions
    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      return JSON.stringify(oldVal) === JSON.stringify(newVal);
    }

    // For objects, compare stringified versions
    if (typeof oldVal === "object" && oldVal !== null && typeof newVal === "object" && newVal !== null) {
      return JSON.stringify(oldVal) === JSON.stringify(newVal);
    }

    // For primitive values
    return oldVal === newVal;
  };

  const formatChange = (key: string, change: { old: any; new: any }) => {
    // Special case for expense creation
    if (key === "creation") {
      return "Created this expense";
    }

    // Skip if values are effectively the same
    if (areValuesEqual(change.old, change.new)) {
      return null;
    }

    switch (key) {
      case "title":
        return `Changed title from "${change.old || "(empty)"}" to "${change.new || "(empty)"}"`;

      case "description":
        if (change.old === null && change.new) {
          return `Added description: "${change.new}"`;
        }
        if (change.old && (change.new === null || change.new === "")) {
          return `Removed description`;
        }
        if (change.old !== change.new) {
          return `Changed description from "${change.old || "(empty)"}" to "${change.new || "(empty)"}"`;
        }
        return null;

      case "amount":
        if (change.old !== change.new) {
          return `Changed amount from ${change.old} to ${change.new}`;
        }
        return null;

      case "currencyId":
        if (change.old !== change.new) {
          return `Changed currency`;
        }
        return null;

      case "splitType":
        if (change.old !== change.new) {
          return `Changed split type from ${change.old} to ${change.new}`;
        }
        return null;

      case "paidBy":
        if (change.old === change.new) return null;

        const oldUser = getUser(change.old);
        const newUser = getUser(change.new);
        const oldName = oldUser
          ? oldUser.id === currentUserId
            ? "You"
            : `${oldUser.firstName} ${oldUser.lastName}`
          : "Unknown";
        const newName = newUser
          ? newUser.id === currentUserId
            ? "You"
            : `${newUser.firstName} ${newUser.lastName}`
          : "Unknown";
        return `Changed paid by from ${oldName} to ${newName}`;

      case "shares":
        // Only show if there's a meaningful change in shares
        // if (!change.old || !change.new) return null;

        // // Check if shares actually changed
        // const oldShares = Array.isArray(change.old) ? change.old : [];
        // const newShares = Array.isArray(change.new) ? change.new : [];

        // // If both arrays are empty, no change
        // if (oldShares.length === 0 && newShares.length === 0) {
        //   return null;
        // }

        // // Compare total number of shares
        // if (oldShares.length !== newShares.length) {
        //   return `Changed how the expense is split (${oldShares.length} → ${newShares.length} members)`;
        // }

        // // Sort both arrays by memberId to ensure consistent comparison
        // const sortedOldShares = [...oldShares].sort((a, b) => a.memberId.localeCompare(b.memberId));
        // const sortedNewShares = [...newShares].sort((a, b) => a.memberId.localeCompare(b.memberId));

        // // Check if any share amounts or percentages changed
        // let hasAmountChanges = false;
        // let hasPercentageChanges = false;
        // let hasMemberChanges = false;

        // // First check if the member IDs are the same
        // const oldMemberIds = sortedOldShares.map((share) => share.memberId).sort();
        // const newMemberIds = sortedNewShares.map((share) => share.memberId).sort();

        // if (JSON.stringify(oldMemberIds) !== JSON.stringify(newMemberIds)) {
        //   hasMemberChanges = true;
        // } else {
        //   // If member IDs are the same, check if amounts or percentages changed
        //   for (let i = 0; i < sortedOldShares.length; i++) {
        //     const oldShare = sortedOldShares[i];
        //     const newShare = sortedNewShares.find((s) => s.memberId === oldShare.memberId);

        //     if (!newShare) continue; // Should not happen if member IDs are the same

        //     // Check if amount changed (with small epsilon for floating point comparison)
        //     if (!areNumbersEqual(oldShare.amount, newShare.amount)) {
        //       hasAmountChanges = true;
        //     }

        //     // Check if percentage changed (with small epsilon for floating point comparison)
        //     const oldPercentage = oldShare.percentage || 0;
        //     const newPercentage = newShare.percentage || 0;
        //     if (!areNumbersEqual(oldPercentage, newPercentage)) {
        //       hasPercentageChanges = true;
        //     }
        //   }
        // }

        // if (hasMemberChanges) {
        //   return `Changed which members are part of the expense`;
        // } else if (hasAmountChanges || hasPercentageChanges) {
        //   return `Updated how the expense is split`;
        // }

        return null;

      default:
        return `Updated ${key}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="View History">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Expense History</DialogTitle>
          <DialogDescription>View all changes made to this expense</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground">No history available for this expense.</p>
          ) : (
            <div className="space-y-6">
              {history.map((entry) => {
                const user = getUser(entry.updatedBy);

                // Get all valid changes
                const validChanges = Object.entries(entry.changes)
                  .map(([key, change]) => ({
                    key,
                    formattedChange: formatChange(key, change),
                  }))
                  .filter((item) => item.formattedChange !== null);

                return (
                  <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user?.imageUrl && <AvatarImage src={user.imageUrl} alt={user.firstName} />}
                        <AvatarFallback>
                          {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user?.id === currentUserId
                            ? "You"
                            : user
                            ? `${user.firstName} ${user.lastName}`
                            : "Unknown user"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {validChanges.length > 0 ? (
                      <ul className="space-y-1 text-sm">
                        {validChanges.map((item) => (
                          <li key={item.key}>{item.formattedChange}</li>
                        ))}
                      </ul>
                    ) : (
                      // Show this if there are no meaningful changes (should rarely happen)
                      <p className="text-sm text-muted-foreground italic">No significant changes detected</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
