import prisma from "..";

export async function createBillGroup(name: string, description: string | undefined, creatorUserId: string) {
  try {
    // Create the group and add the creator as a member in a transaction
    const data = await prisma.$transaction(async (tx) => {
      // Create the group
      const group = await tx.billGroup.create({
        data: {
          name,
          description,
        },
      });

      // Add the creator as a member with isCreator flag
      const member = await tx.billMember.create({
        data: {
          userId: creatorUserId,
          isCreator: true,
          groupId: group.id,
        },
      });

      // Return the group with the creator as a member
      return {
        ...group,
        members: [member],
      };
    });

    return { data, error: null };
  } catch (error) {
    console.error("Error creating bill group:", error);
    return { data: null, error: "Failed to create bill group" };
  }
}

export async function getBillGroupsByUser(userId: string) {
  try {
    // Get groups where the user is a member and not removed
    const memberGroups = await prisma.billGroup.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    return { data: memberGroups, error: null };
  } catch (error) {
    console.error("Error getting bill groups:", error);
    return { data: null, error: "Failed to get bill groups" };
  }
}

export async function getBillGroupById(id: string) {
  try {
    const group = await prisma.billGroup.findUnique({
      where: {
        id,
      },
      include: {
        members: true,
      },
    });
    return { data: group, error: null };
  } catch (error) {
    console.error("Error getting bill group:", error);
    return { data: null, error: "Failed to get bill group" };
  }
}

export async function getBillGroupWithAllMembersById(id: string) {
  try {
    const group = await prisma.billGroup.findUnique({
      where: {
        id,
      },
      include: {
        members: true, // Include all members, even removed ones
      },
    });
    return { data: group, error: null };
  } catch (error) {
    console.error("Error getting bill group with all members:", error);
    return { data: null, error: "Failed to get bill group with all members" };
  }
}

export async function addMemberToBillGroup(groupId: string, userId: string) {
  try {
    const data = await prisma.billMember.create({
      data: {
        userId,
        isCreator: false,
        groupId,
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error adding member to bill group:", error);
    return { data: null, error: "Failed to add member to bill group" };
  }
}

export async function removeMemberFromBillGroup(memberId: string) {
  try {
    // Check if the member is the creator
    const member = await prisma.billMember.findUnique({
      where: {
        id: memberId,
      },
    });

    if (member?.isCreator) {
      return {
        data: null,
        error: "Cannot remove the creator of the group. The creator must transfer ownership or delete the group.",
      };
    }

    // Delete the member
    const data = await prisma.billMember.delete({
      where: {
        id: memberId,
      },
    });

    return { data, error: null };
  } catch (error) {
    console.error("Error removing member from bill group:", error);
    return { data: null, error: "Failed to remove member from bill group" };
  }
}

export async function deleteBillGroup(id: string, userId: string) {
  try {
    // Check if the user is the creator of the group
    const group = await prisma.billGroup.findUnique({
      where: {
        id,
      },
      include: {
        members: {
          where: {
            userId,
            isCreator: true,
          },
        },
      },
    });

    if (!group || group.members.length === 0) {
      return { data: null, error: "Unauthorized. Only the creator can delete the group." };
    }

    const data = await prisma.billGroup.delete({
      where: {
        id,
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error deleting bill group:", error);
    return { data: null, error: "Failed to delete bill group" };
  }
}

export async function updateBillGroup(id: string, userId: string, name: string, description: string | undefined) {
  try {
    const data = await prisma.billGroup.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error updating bill group:", error);
    return { data: null, error: "Failed to update bill group" };
  }
}

export async function getGroupCreator(groupId: string) {
  try {
    const creator = await prisma.billMember.findFirst({
      where: {
        groupId,
        isCreator: true,
      },
    });

    return { data: creator, error: null };
  } catch (error) {
    console.error("Error getting group creator:", error);
    return { data: null, error: "Failed to get group creator" };
  }
}

export async function isUserGroupCreator(groupId: string, userId: string) {
  try {
    const member = await prisma.billMember.findFirst({
      where: {
        groupId,
        userId,
        isCreator: true,
      },
    });

    return { data: !!member, error: null };
  } catch (error) {
    console.error("Error checking if user is group creator:", error);
    return { data: false, error: "Failed to check if user is group creator" };
  }
}
