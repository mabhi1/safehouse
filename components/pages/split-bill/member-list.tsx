"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleSlash, StepForward, Trash, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeMemberFromBillGroupAction } from "@/actions/bill-groups";
import { toast } from "sonner";
import { UserResult } from "@/lib/db-types";
import AddMemberForm from "./add-member-form";

export const MemberList = ({
  id,
  members,
  isCreator,
  userId,
}: {
  id: string;
  members: { id: string; userId: string; user: UserResult }[];
  isCreator: boolean;
  userId: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRemoveMember = async (memberId: string) => {
    setLoading(true);

    try {
      const { error } = await removeMemberFromBillGroupAction(memberId, id);

      if (error) {
        if (error.includes("outstanding balances")) {
          toast.error("Cannot remove this member because they have outstanding balances.", { duration: 5000 });
        } else {
          throw new Error(error);
        }
      } else {
        if (userId === members.find((member) => member.id === memberId)?.userId) {
          toast.success("Member removed successfully");
        } else {
          toast.success("You exited the group successfully.");
        }
        router.refresh();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      if (userId === members.find((member) => member.id === memberId)?.userId) {
        toast.error("Failed to remove member. Please try again.");
      } else {
        toast.error("Failed to exit group. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl">Members</h2>
          <Badge variant="outline">{members.length}</Badge>
        </div>
        <AddMemberForm groupId={id} members={members} />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {members.length === 0 ? (
              <div className="text-center py-6">
                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Other Members</h3>
                <p className="text-muted-foreground">
                  {isCreator
                    ? "Add members to your group by clicking the 'Add Member' button."
                    : "There are no other members in this group yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member, idx) => (
                  <div key={member.user.id} className="space-y-5">
                    {idx > 0 && <Separator />}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {member.user.imageUrl && (
                            <AvatarImage src={member.user.imageUrl} alt={member.user.firstName} />
                          )}
                          <AvatarFallback>{`${member.user.firstName.charAt(0)}${member.user.lastName.charAt(
                            0
                          )}`}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {userId === member.user.id ? "You" : `${member.user.firstName} ${member.user.lastName}`}
                          </p>
                          <p className="text-sm text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-destructive hover:text-destructive/80" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently delete the user from the group.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <Button variant="outline" ICON={CircleSlash}>
                                Cancel
                              </Button>
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveMember(member.id)} asChild>
                              <Button ICON={StepForward} loading={loading}>
                                Continue
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
