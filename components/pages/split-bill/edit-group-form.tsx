"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CircleSlash, FilePenLine, Save } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { updateBillGroupAction } from "@/actions/bill-groups";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
interface EditGroupFormProps {
  groupId: string;
  initialName: string;
  initialDescription: string;
  userId: string;
}

type EditGroupFormData = {
  name: string;
  description?: string;
};

export default function EditGroupForm({ groupId, initialName, initialDescription, userId }: EditGroupFormProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const { isPending, handleSubmit, formValues, handleInputChange, isValid } = useFormSubmit<EditGroupFormData>({
    initialValues: {
      name: initialName,
      description: initialDescription,
    },
    onSubmit: async (formData) => {
      return await updateBillGroupAction(userId, groupId, formData.name, formData.description);
    },
    optionalFields: ["description"],
    onSuccess: () => {
      setOpenDialog(false);
      router.refresh();
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary" ICON={FilePenLine} mobileVariant>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>Enter group details and click save when you&apos;re done.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Group Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter group name"
              value={formValues.name}
              onChange={handleInputChange}
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter group description"
              value={formValues.description}
              onChange={handleInputChange}
              disabled={isPending}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" ICON={CircleSlash}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" loading={isPending} disabled={!isValid} ICON={Save} mobileVariant>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
