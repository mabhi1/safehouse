import { useState, useCallback, useMemo, FormEvent, useEffect } from "react";
import { BookmarkType } from "@/lib/db-types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { deleteBookmark, editBookmark, addBookmark } from "@/actions/bookmarks";
import { isValidUrl } from "../utils/validation";
import { toast } from "sonner";

export function useBookmarks(initialBookmarks: BookmarkType[], userId: string, initialSearchText: string) {
  const [searchTerm, setSearchTerm] = useState(initialSearchText || "");
  const [activeLetter, setActiveLetter] = useState<string>("");
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [editingBookmark, setEditingBookmark] = useState<{
    id: string;
    title: string;
    comment: string;
    url: string;
  } | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBookmark, setNewBookmark] = useState<{
    title: string;
    comment: string;
    url: string;
  }>({ title: "", comment: "", url: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Create a memoized function to update URL
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  // Update URL when search term changes
  useEffect(() => {
    const queryString = createQueryString("search", searchTerm);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [searchTerm, router, pathname, createQueryString]);

  // Filter bookmarks based on search term
  const filteredBookmarks = useMemo(
    () =>
      searchTerm
        ? initialBookmarks.filter((bookmark) => {
            return (
              bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bookmark.comment.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
        : initialBookmarks,
    [searchTerm, initialBookmarks]
  );

  // Sort bookmarks alphabetically by title
  filteredBookmarks.sort((a, b) => a.title.localeCompare(b.title));

  // Group bookmarks by first letter of title
  const groupedBookmarks = useMemo(() => {
    return filteredBookmarks.reduce((acc, bookmark) => {
      const firstLetter = bookmark.title[0].toUpperCase(); // Convert to uppercase for consistency
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(bookmark);
      return acc;
    }, {} as { [key: string]: BookmarkType[] });
  }, [filteredBookmarks]);

  const availableLetters = useMemo(() => Object.keys(groupedBookmarks).sort(), [groupedBookmarks]);

  // Handle scroll to update active letter
  const handleScroll = useCallback(() => {
    if (!availableLetters.length) return;
    let currentLetter = "";
    for (const letter of availableLetters) {
      const element = document.getElementById(letter);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 || rect.bottom >= window.innerHeight / 5) {
          currentLetter = letter;
          break;
        }
      }
    }

    setActiveLetter(currentLetter);
  }, [availableLetters]);

  // Add scroll event listener
  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handle selecting all bookmarks
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedBookmarks(filteredBookmarks.map((bookmark) => bookmark.id));
      } else {
        setSelectedBookmarks([]);
      }
    },
    [filteredBookmarks]
  );

  // Handle selecting a single bookmark
  const handleSelectBookmark = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedBookmarks((prev) => [...prev, id]);
    } else {
      setSelectedBookmarks((prev) => prev.filter((bookmarkId) => bookmarkId !== id));
    }
  }, []);

  // Handle deleting selected bookmarks
  const handleDeleteSelected = useCallback(async () => {
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
  }, [selectedBookmarks, userId, router]);

  // Handle editing a bookmark
  const handleEdit = useCallback((bookmark: BookmarkType) => {
    setEditingBookmark({
      id: bookmark.id,
      title: bookmark.title,
      comment: bookmark.comment,
      url: bookmark.url,
    });
  }, []);

  // Handle canceling edit
  const handleCancelEdit = useCallback(() => {
    setEditingBookmark(null);
  }, []);

  // Handle changing edit fields
  const handleEditChange = useCallback((field: string, value: string) => {
    setEditingBookmark((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  }, []);

  // Handle submitting edit
  const handleEditSubmit = useCallback(
    async (e: FormEvent) => {
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
    },
    [editingBookmark, userId, router]
  );

  // Handle adding new bookmark
  const handleAddNew = useCallback(() => {
    setIsAddingNew(true);
    setNewBookmark({ title: "", comment: "", url: "" });
  }, []);

  // Handle canceling add
  const handleCancelAdd = useCallback(() => {
    setIsAddingNew(false);
  }, []);

  // Handle changing new bookmark fields
  const handleNewBookmarkChange = useCallback((field: string, value: string) => {
    setNewBookmark((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle submitting new bookmark
  const handleNewSubmit = useCallback(
    async (e: FormEvent) => {
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
    },
    [newBookmark, userId, router]
  );

  return {
    searchTerm,
    setSearchTerm,
    activeLetter,
    selectedBookmarks,
    editingBookmark,
    isAddingNew,
    newBookmark,
    isDeleting,
    isSaving,
    filteredBookmarks,
    groupedBookmarks,
    availableLetters,
    handleSelectAll,
    handleSelectBookmark,
    handleDeleteSelected,
    handleEdit,
    handleCancelEdit,
    handleEditChange,
    handleEditSubmit,
    handleAddNew,
    handleCancelAdd,
    handleNewBookmarkChange,
    handleNewSubmit,
  };
}
