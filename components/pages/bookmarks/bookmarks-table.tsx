"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BookmarkType } from "@/lib/db-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, Plus, CircleSlash, StepForward } from "lucide-react";
import Image from "next/image";
import { deleteBookmark } from "@/actions/bookmarks";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FloatingDock } from "@/components/ui/floating-dock";
import { CreateBookmarkForm } from "./create-bookmark-form";
import { EditBookmarkForm } from "./edit-bookmark-form";

interface BookmarksTableProps {
  bookmarks: BookmarkType[];
  userId: string;
  searchText?: string;
}

export default function BookmarksTable({ bookmarks, userId, searchText }: BookmarksTableProps) {
  const [searchTerm, setSearchTerm] = useState(searchText || "");
  const [activeLetter, setActiveLetter] = useState<string>("");
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    if (searchText) setSearchTerm(searchText);
  }, [searchText]);

  useEffect(() => {
    const queryString = createQueryString("search", searchTerm);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [searchTerm, router, pathname, createQueryString]);

  // Filter bookmarks based on search term
  const filteredBookmarks = useMemo(
    () =>
      searchTerm
        ? bookmarks.filter((bookmark) => {
            return (
              bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bookmark.comment.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
        : bookmarks,
    [searchTerm, bookmarks]
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
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookmarks(filteredBookmarks.map((bookmark) => bookmark.id));
    } else {
      setSelectedBookmarks([]);
    }
  };

  // Handle selecting a single bookmark
  const handleSelectBookmark = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedBookmarks((prev) => [...prev, id]);
    } else {
      setSelectedBookmarks((prev) => prev.filter((bookmarkId) => bookmarkId !== id));
    }
  };

  // Handle deleting selected bookmarks
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

  return (
    <div className="space-y-5 mb-20 relative">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-xl capitalize">Bookmarks</span>
          <Badge variant="secondary" className="font-normal">
            {filteredBookmarks.length}
          </Badge>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search Bookmarks"
            className="h-9 w-36 md:w-56"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  This action will permanently remove the bookmarks from our servers.
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
          <CreateBookmarkForm uid={userId} />
        </div>
      </div>

      {availableLetters.length === 0 ? (
        <div className="text-lg">No Saved Bookmarks</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] px-4 py-2">
                  <Checkbox
                    checked={filteredBookmarks.length > 0 && selectedBookmarks.length === filteredBookmarks.length}
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
              {availableLetters.map((letter) => (
                <React.Fragment key={letter}>
                  {/* Letter header row */}
                  <TableRow id={letter} className="scroll-mt-28 hover:bg-transparent">
                    <TableCell colSpan={6} className="px-4 py-2">
                      <div className="flex items-center gap-5">
                        <h2 className="text-muted-foreground/60">{letter}</h2>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Bookmarks for this letter */}
                  {groupedBookmarks[letter].map((bookmark) => (
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
                          <EditBookmarkForm bookmark={bookmark} userId={userId} />
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
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="fixed bottom-5 right-5 md:left-1/2 md:bottom-20 transform md:-translate-x-1/2 md:w-full md:max-w-[60rem] md:overflow-x-auto no-scrollbar">
        <FloatingDock
          items={availableLetters.map((letter) => {
            return {
              title: letter,
              href: `#${letter}`,
            };
          })}
          activeLetter={activeLetter}
        />
      </div>
    </div>
  );
}
