"use client";

import { addBookmark } from "@/actions/bookmarks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Plus, CircleSlash, Save } from "lucide-react";
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

export function CreateBookmarkForm({ uid }: { uid: string }) {
  const [open, setOpen] = useState(false);

  const initialFormValues: BookmarkFormValues = {
    title: "",
    comment: "",
    url: "",
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

      const result = await addBookmark(values.title.trim(), values.comment.trim(), values.url.trim(), uid);
      if (result.data) {
        setOpen(false);
      }
      return result;
    },
    successMessage: "Bookmark added successfully",
    failureMessage: "Failed to add bookmark",
    optionalFields: ["comment"],
    validations,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button ICON={Plus} mobileVariant>
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogDescription>Add a new bookmark to your collection.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Title<span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formValues.title}
                onChange={handleInputChange}
                required
                autoFocus
                placeholder="Enter Title"
              />
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
