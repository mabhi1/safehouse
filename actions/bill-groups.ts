"use server";

import {
  createBillGroup,
  getBillGroupById,
  updateBillGroup,
  deleteBillGroup,
  addMemberToBillGroup,
  removeMemberFromBillGroup,
} from "@/prisma/db/billGroups";
import { memberHasOutstandingBalances } from "@/prisma/db/billExpenses";
import { revalidatePath } from "next/cache";

export async function createBillGroupAction(userId: string, name: string, description?: string) {
  const result = await createBillGroup(name.trim(), description?.trim(), userId);

  revalidatePath("/split-bill");
  return result;
}

export async function updateBillGroupAction(userId: string, id: string, name: string, description?: string) {
  const result = await updateBillGroup(id, userId, name.trim(), description?.trim());
  revalidatePath(`/split-bill/${id}`);
  return result;
}

export async function deleteBillGroupAction(id: string, userId: string) {
  const result = await deleteBillGroup(id, userId);

  revalidatePath("/split-bill");
  return result;
}

export async function addMemberToBillGroupAction(groupId: string, memberUserId: string) {
  // Get the group to check if the member is already in it
  const { data: group } = await getBillGroupById(groupId);
  if (!group) {
    return { error: "Group not found", data: null };
  }

  // Check if the member is already in the group
  if (group.members.some((member: { userId: string }) => member.userId === memberUserId)) {
    return { error: "User is already a member of this group", data: null };
  }

  const result = await addMemberToBillGroup(groupId, memberUserId);

  revalidatePath(`/split-bill/${groupId}/members`);

  return result;
}

export async function removeMemberFromBillGroupAction(memberId: string, groupId: string) {
  // Check if the member has any outstanding balances
  const { data: hasBalances, error: balanceError } = await memberHasOutstandingBalances(memberId, groupId);

  if (balanceError) {
    return { error: balanceError, data: null };
  }

  if (hasBalances) {
    return {
      error:
        "Cannot remove member with outstanding balances. This member either owes money to others or is owed money by others. Please settle all balances before removing this member.",
      data: null,
    };
  }

  const result = await removeMemberFromBillGroup(memberId);

  revalidatePath(`/split-bill/${groupId}/members`);
  return result;
}
