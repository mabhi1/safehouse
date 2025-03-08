"use client";

import { BookmarkType } from "@/lib/db-types";
import { useState, useRef, FormEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Save, X, ExternalLink, Plus, CircleSlash, StepForward } from "lucide-react";
import Image from "next/image";
import { deleteBookmark, editBookmark, addBookmark } from "@/actions/bookmarks";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/ui/delete-button";
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
import { toast } from "sonner";

interface BookmarksTableProps {
  bookmarks: BookmarkType[];
  userId: string;
}

type EditingBookmark = {
  id: string;
  title: string;
  comment: string;
  url: string;
};

type NewBookmark = {
  title: string;
  comment: string;
  url: string;
};

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

export default function BookmarksTable({ bookmarks, userId }: BookmarksTableProps) {
  const router = useRouter();
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [editingBookmark, setEditingBookmark] = useState<EditingBookmark | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBookmark, setNewBookmark] = useState<NewBookmark>({ title: "", comment: "", url: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Refs for form submission
  const editFormRef = useRef<HTMLFormElement>(null);
  const newFormRef = useRef<HTMLFormElement>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookmarks(bookmarks.map((bookmark) => bookmark.id));
    } else {
      setSelectedBookmarks([]);
    }
  };

  const handleSelectBookmark = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedBookmarks((prev) => [...prev, id]);
    } else {
      setSelectedBookmarks((prev) => prev.filter((bookmarkId) => bookmarkId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBookmarks.length === 0) return;

    setIsDeleting(true);

    try {
      // Delete bookmarks one by one
      for (const id of selectedBookmarks) {
        await deleteBookmark(id, userId);
      }

      setSelectedBookmarks([]);
      router.refresh();
    } catch (error) {
      console.error("Error deleting bookmarks:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (bookmark: BookmarkType) => {
    setEditingBookmark({
      id: bookmark.id,
      title: bookmark.title,
      comment: bookmark.comment,
      url: bookmark.url,
    });
  };

  const handleCancelEdit = () => {
    setEditingBookmark(null);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingBookmark) return;

    // Validate URL
    if (!isValidUrl(editingBookmark.url)) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setIsSaving(true);

    try {
      await editBookmark(
        editingBookmark.id,
        editingBookmark.title,
        editingBookmark.comment,
        editingBookmark.url,
        userId
      );

      setEditingBookmark(null);
      router.refresh();
    } catch (error) {
      console.error("Error saving bookmark:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewBookmark({ title: "", comment: "", url: "" });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
  };

  const handleNewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newBookmark.title || !newBookmark.url) return;

    // Validate URL
    if (!isValidUrl(newBookmark.url)) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setIsSaving(true);

    try {
      await addBookmark(newBookmark.title, newBookmark.comment, newBookmark.url, userId);

      setIsAddingNew(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding bookmark:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-xl capitalize">Bookmarks</h1>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={selectedBookmarks.length === 0} ICON={Trash2} mobileVariant>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently remove the expenses from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline" ICON={CircleSlash}>
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelected} asChild>
                  <Button ICON={StepForward} disabled={isDeleting}>
                    Continue
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleAddNew} ICON={Plus} mobileVariant>
            Add Bookmark
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] px-4 py-2">
                <Checkbox
                  checked={bookmarks.length > 0 && selectedBookmarks.length === bookmarks.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead className="w-[50px] px-4 py-2"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell px-4 py-2">Comment</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[100px] text-center px-4 py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAddingNew && (
              <TableRow className="bg-muted/20">
                <TableCell className="px-4 py-2"></TableCell>
                <TableCell className="px-4 py-2"></TableCell>
                <TableCell className="px-4 py-2">
                  <Input
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                    autoFocus
                    placeholder="Enter title"
                    className="w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    required
                  />
                </TableCell>
                <TableCell className="hidden md:table-cell px-4 py-2">
                  <Input
                    form="newBookmarkForm"
                    value={newBookmark.comment}
                    onChange={(e) => setNewBookmark({ ...newBookmark, comment: e.target.value })}
                    placeholder="Enter comment"
                    className="w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  />
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Input
                    form="newBookmarkForm"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                    placeholder="Enter URL (e.g., https://example.com)"
                    className="w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    type="url"
                    required
                  />
                </TableCell>

                <TableCell className="text-center px-4 py-2">
                  <div className="flex justify-center gap-1">
                    <Button
                      type="submit"
                      form="newBookmarkForm"
                      size="icon"
                      variant="ghost"
                      onClick={handleNewSubmit}
                      disabled={isSaving || !newBookmark.title || !newBookmark.url}
                      loading={isSaving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleCancelAdd}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {bookmarks.map((bookmark) => (
              <TableRow key={bookmark.id} className="hover:bg-muted/20">
                <TableCell className="px-4 py-2">
                  <Checkbox
                    checked={selectedBookmarks.includes(bookmark.id)}
                    onCheckedChange={(checked) => handleSelectBookmark(bookmark.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="relative h-6 w-6">
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`}
                      alt={bookmark.title}
                      width={24}
                      height={24}
                      className="rounded-sm"
                      onError={(e) => {
                        // Fallback to default favicon
                        (e.target as HTMLImageElement).src = "/favicon.png";
                      }}
                    />
                  </div>
                </TableCell>
                {editingBookmark?.id === bookmark.id ? (
                  <>
                    <TableCell className="px-4 py-2">
                      <Input
                        value={editingBookmark.title}
                        onChange={(e) => setEditingBookmark({ ...editingBookmark, title: e.target.value })}
                        className="h-8 w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        autoFocus
                        required
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell px-4 py-2">
                      <Input
                        form={`editForm-${bookmark.id}`}
                        value={editingBookmark.comment}
                        onChange={(e) => setEditingBookmark({ ...editingBookmark, comment: e.target.value })}
                        className="h-8 w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <Input
                        form={`editForm-${bookmark.id}`}
                        value={editingBookmark.url}
                        onChange={(e) => setEditingBookmark({ ...editingBookmark, url: e.target.value })}
                        className="h-8 w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        type="url"
                        required
                      />
                    </TableCell>
                    <TableCell className="text-center px-4 py-2">
                      <div className="flex justify-center gap-1">
                        <Button
                          type="submit"
                          form={`editForm-${bookmark.id}`}
                          size="icon"
                          variant="ghost"
                          onClick={handleEditSubmit}
                          disabled={isSaving}
                          loading={isSaving}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium px-4 py-2">{bookmark.title}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell px-4 py-2">
                      <div className="max-h-20 overflow-y-auto">{bookmark.comment}</div>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline truncate max-w-xs"
                      >
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{bookmark.url}</span>
                      </a>
                    </TableCell>
                    <TableCell className="text-center px-4 py-2">
                      <div className="flex justify-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(bookmark)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DeleteButton
                          size="icon"
                          id={bookmark.id}
                          uid={userId}
                          deleteAction={deleteBookmark}
                          mobileVariant
                          hideIcon
                        >
                          <Trash2 className="h-4 w-4" />
                        </DeleteButton>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            {bookmarks.length === 0 && !isAddingNew && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  No bookmarks found. Click Add Bookmark button to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
