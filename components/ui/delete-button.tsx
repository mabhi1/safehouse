"use client";

import { Button } from "@/components/ui/button";
import { CircleSlash, Loader2, StepForward, Trash } from "lucide-react";
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
import { useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: string;
  uid: string;
  deleteAction: (id: string, uid: string) => Promise<{ data: any; error: any }>;
  successRedirect?: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  className?: string;
  mobileVariant?: boolean;
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
}

export function DeleteButton({
  id,
  uid,
  deleteAction,
  successRedirect,
  loadingMessage = "Please wait",
  successMessage = "Item deleted successfully",
  errorMessage = "Unable to delete item",
  dialogTitle = "Are you absolutely sure?",
  dialogDescription = "This action cannot be undone. This will permanently delete and remove the item from our servers.",
  className,
  mobileVariant = false,
  variant = "ghost",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      const { data, error } = await deleteAction(id, uid);
      if (!data || error) toast.error(errorMessage);
      else {
        toast.success(successMessage);
        if (successRedirect) router.replace(successRedirect);
      }
    });
  };

  return isPending ? (
    <Button variant={variant} disabled className={className}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {loadingMessage}
    </Button>
  ) : (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          ICON={Trash}
          variant={variant}
          className={cn(variant !== "destructive" && "text-destructive hover:text-destructive", className)}
          mobileVariant={mobileVariant}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" ICON={CircleSlash}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} asChild>
            <Button ICON={StepForward}>Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
