"use client";

import { editBookmark } from "@/actions/bookmarks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Edit, CircleSlash, Save } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { BookmarkType } from "@/lib/db-types";
import { toast } from "sonner";

// URL validation function
const isValidUrl = (url: string): boolean => {
  try {
    // Check if it's a valid URL format
    const parsedUrl = new URL(url);
    // Check if it has http or https protocol
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
};

type BookmarkFormValues = {
  title: string;
  comment: string;
  url: string;
};

interface EditBookmarkFormProps {
  bookmark: BookmarkType;
  userId: string;
  trigger?: React.ReactNode;
}

export function EditBookmarkForm({ bookmark, userId, trigger }: EditBookmarkFormProps) {
  const [open, setOpen] = useState(false);

  const initialFormValues: BookmarkFormValues = {
    title: bookmark.title,
    comment: bookmark.comment,
    url: bookmark.url,
  };

  const validations = {
    url: (value: string | number | Date) => {
      const urlString = String(value);
      return isValidUrl(urlString);
    },
  };

  const { formValues, handleInputChange, handleSubmit, isPending, isValid } = useFormSubmit<BookmarkFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      if (!isValidUrl(values.url)) {
        toast.error("Please enter a valid URL (e.g., https://example.com)");
        return { data: null, error: "Invalid URL" };
      }

      const result = await editBookmark(
        bookmark.id,
        values.title.trim(),
        values.comment.trim(),
        values.url.trim(),
        userId
      );

      if (result.data) {
        setOpen(false);
      }
      return result;
    },
    successMessage: "Bookmark updated successfully",
    failureMessage: "Failed to update bookmark",
    optionalFields: ["comment"],
    validations,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="icon" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Edit Bookmark</DialogTitle>
            <DialogDescription>Make changes to your bookmark.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Title<span className="text-destructive">*</span>
              </Label>
              <Input id="title" value={formValues.title} onChange={handleInputChange} required autoFocus />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="url">
                URL<span className="text-destructive">*</span>
              </Label>
              <Input
                id="url"
                value={formValues.url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                type="url"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={formValues.comment}
                onChange={handleInputChange}
                placeholder="Optional comment"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" ICON={CircleSlash}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!isValid} loading={isPending} ICON={Save}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
