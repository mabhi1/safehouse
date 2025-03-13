import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBillGroupById, isUserGroupCreator } from "@/prisma/db/billGroups";
import { getUsersByIds } from "@/actions/users";
import { MemberList } from "@/components/pages/split-bill/member-list";

export const metadata = {
  title: "Split Bill - Group Members",
};

export default async function MembersPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { data: group, error: groupError } = await getBillGroupById(params.id);
  const { data: isCreator } = await isUserGroupCreator(params.id, userId);

  // Check if user is a member of the group
  const isMember = group?.members.some((member: { userId: string }) => member.userId === userId);

  if (!isMember || groupError || !group) {
    return redirect("/split-bill");
  }

  const memberUserIds = group.members.map((member: { userId: string }) => member.userId);

  // Fetch user data for all members
  const { data: usersData } = await getUsersByIds(memberUserIds);

  // Enhance group members with user data
  const enhancedMembers = group.members.map((member: { id: string; userId: string }) => {
    const userData = usersData!.find((user) => user.id === member.userId)!;
    return {
      ...member,
      user: userData,
    };
  });

  return (
    <div>
      <MemberList id={params.id} members={enhancedMembers} isCreator={isCreator} userId={userId} />
    </div>
  );
}
