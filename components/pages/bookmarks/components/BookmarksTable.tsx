"use client";

import React from "react";
import { BookmarkType } from "@/lib/db-types";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import BookmarkRow from "./BookmarkRow";
import NewBookmarkRow from "./NewBookmarkRow";
import LetterHeader from "./LetterHeader";

interface BookmarksTableProps {
  groupedBookmarks: { [key: string]: BookmarkType[] };
  availableLetters: string[];
  selectedBookmarks: string[];
  editingBookmark: {
    id: string;
    title: string;
    comment: string;
    url: string;
  } | null;
  newBookmark: {
    title: string;
    comment: string;
    url: string;
  };
  isAddingNew: boolean;
  isSaving: boolean;
  userId: string;
  onSelectAll: (checked: boolean) => void;
  onSelectBookmark: (id: string, checked: boolean) => void;
  onEdit: (bookmark: BookmarkType) => void;
  onCancelEdit: () => void;
  onEditChange: (field: string, value: string) => void;
  onEditSubmit: (e: React.FormEvent) => void;
  onNewBookmarkChange: (field: string, value: string) => void;
  onNewBookmarkSubmit: (e: React.FormEvent) => void;
  onCancelAdd: () => void;
  searchTerm: string;
}

export default function BookmarksTable({
  groupedBookmarks,
  availableLetters,
  selectedBookmarks,
  editingBookmark,
  newBookmark,
  isAddingNew,
  isSaving,
  userId,
  onSelectAll,
  onSelectBookmark,
  onEdit,
  onCancelEdit,
  onEditChange,
  onEditSubmit,
  onNewBookmarkChange,
  onNewBookmarkSubmit,
  onCancelAdd,
  searchTerm,
}: BookmarksTableProps) {
  const allBookmarks = Object.values(groupedBookmarks).flat();

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] px-4 py-2">
              <Checkbox
                checked={allBookmarks.length > 0 && selectedBookmarks.length === allBookmarks.length}
                onCheckedChange={(checked) => onSelectAll(checked as boolean)}
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
            <NewBookmarkRow
              newBookmark={newBookmark}
              onNewBookmarkChange={onNewBookmarkChange}
              onSave={onNewBookmarkSubmit}
              onCancel={onCancelAdd}
              isSaving={isSaving}
            />
          )}

          {availableLetters.map((letter) => (
            <React.Fragment key={letter}>
              <LetterHeader letter={letter} />

              {groupedBookmarks[letter].map((bookmark) => (
                <BookmarkRow
                  key={bookmark.id}
                  bookmark={bookmark}
                  userId={userId}
                  isSelected={selectedBookmarks.includes(bookmark.id)}
                  onSelect={onSelectBookmark}
                  isEditing={editingBookmark?.id === bookmark.id}
                  editingData={editingBookmark?.id === bookmark.id ? editingBookmark : null}
                  onEdit={onEdit}
                  onCancelEdit={onCancelEdit}
                  onEditChange={onEditChange}
                  onSave={onEditSubmit}
                  isSaving={isSaving}
                  searchTerm={searchTerm}
                />
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
