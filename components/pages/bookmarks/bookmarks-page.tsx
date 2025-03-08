"use client";

import React from "react";
import { BookmarkType } from "@/lib/db-types";
import { FloatingDock } from "@/components/ui/floating-dock";
import { useBookmarks } from "./hooks/useBookmarks";
import BookmarksHeader from "./components/BookmarksHeader";
import BookmarksTable from "./components/BookmarksTable";

interface BookmarksPageProps {
  bookmarks: BookmarkType[];
  userId: string;
  searchText: string;
}

export default function BookmarksPage({ bookmarks, userId, searchText }: BookmarksPageProps) {
  const {
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
  } = useBookmarks(bookmarks, userId, searchText);

  return (
    <div className="space-y-5 mb-20 relative">
      <BookmarksHeader
        bookmarkCount={filteredBookmarks.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        onDeleteSelected={handleDeleteSelected}
        isDeleteDisabled={selectedBookmarks.length === 0}
        isDeleting={isDeleting}
      />

      {availableLetters.length === 0 ? (
        <div className="text-lg">No Saved Bookmarks</div>
      ) : (
        <BookmarksTable
          groupedBookmarks={groupedBookmarks}
          availableLetters={availableLetters}
          selectedBookmarks={selectedBookmarks}
          editingBookmark={editingBookmark}
          newBookmark={newBookmark}
          isAddingNew={isAddingNew}
          isSaving={isSaving}
          userId={userId}
          onSelectAll={handleSelectAll}
          onSelectBookmark={handleSelectBookmark}
          onEdit={handleEdit}
          onCancelEdit={handleCancelEdit}
          onEditChange={handleEditChange}
          onEditSubmit={handleEditSubmit}
          onNewBookmarkChange={handleNewBookmarkChange}
          onNewBookmarkSubmit={handleNewSubmit}
          onCancelAdd={handleCancelAdd}
          searchTerm={searchTerm}
        />
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
