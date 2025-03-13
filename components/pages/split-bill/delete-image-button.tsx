import { deleteObject, getStorage } from "firebase/storage";

import { Button } from "@/components/ui/button";
import { ref } from "firebase/storage";
import { deleteBillExpenseImageAction } from "@/actions/bill-expenses";
import { toast } from "sonner";
import { Expense } from "@/lib/db-types";
import { ImageOff } from "lucide-react";
import { useTransition } from "react";

export default function DeleteImageButton({
  expense,
  groupId,
  userId,
}: {
  expense: Expense;
  groupId: string;
  userId: string;
}) {
  const storage = getStorage();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      loading={isPending}
      variant="outline"
      className="w-full"
      onClick={async () => {
        startTransition(async () => {
          try {
            const imageUrlArray = expense.imageUrl!.split("/");
            const fileRef = ref(storage, imageUrlArray[imageUrlArray.length - 1].split("?")[0]);
            await deleteObject(fileRef)
              .then(async () => {
                const { error } = await deleteBillExpenseImageAction(expense.id, groupId, userId);
                if (error) throw new Error();
                toast.success("Image deleted successfully");
              })
              .catch(() => {
                toast.error("Unable to delete image");
              });
          } catch (error) {
            console.log(error);
            toast.error("Unable to delete image");
          }
        });
      }}
    >
      <ImageOff className="h-4 w-4 mr-2" />
      Delete Image
    </Button>
  );
}
