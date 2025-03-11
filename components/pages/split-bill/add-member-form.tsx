import { addMemberToBillGroupAction } from "@/actions/bill-groups";
import { searchUsersByEmail } from "@/actions/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserResult } from "@/lib/db-types";
import { Loader2, Plus, Search, UserPlus, CircleSlash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddMemberForm({
  groupId,
  members,
}: {
  groupId: string;
  members: { id: string; userId: string }[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddMember = async () => {
    if (!selectedUser) return;

    setAddingMember(true);

    try {
      const { error } = await addMemberToBillGroupAction(groupId, selectedUser.id);

      if (error) {
        throw new Error(error);
      }

      toast.success("Member added successfully");
      setSelectedUser(null);
      setSearchQuery("");
      setSearchResults([]);
      router.refresh();
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member. Please try again.");
    } finally {
      setAddingMember(false);
      setOpenDialog(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter an email to search");
      return;
    }

    setSearching(true);
    setSearchResults([]);

    try {
      const { data, error } = await searchUsersByEmail(searchQuery.trim());

      if (error) {
        throw new Error(error);
      }

      if (!data) {
        throw new Error("Failed to search users");
      }

      // Filter out users who are already members or the creator
      const filteredResults = data.filter((user: UserResult) => !members.some((member) => member.id === user.id));

      setSearchResults(filteredResults);

      if (filteredResults.length === 0) {
        toast.info("No users found with that email or they are already in the group");
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member to Group</DialogTitle>
          <DialogDescription>Search for users by email to add them to your group.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Input
            className="h-9"
            placeholder="Search by email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={searching}
          />
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-medium">Search Results</h3>
            {searchResults.map((user, idx) => (
              <div className="max-h-60 overflow-y-auto space-y-2" key={user.id}>
                {idx > 0 && <Separator />}
                <div
                  className={`p-2 rounded-md flex items-center gap-3 cursor-pointer ${
                    selectedUser?.id === user.id ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" ICON={CircleSlash}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleAddMember} disabled={!selectedUser} loading={addingMember} ICON={Plus}>
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
