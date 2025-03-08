"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface NewBookmarkRowProps {
  newBookmark: {
    title: string;
    comment: string;
    url: string;
  };
  onNewBookmarkChange: (field: string, value: string) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function NewBookmarkRow({
  newBookmark,
  onNewBookmarkChange,
  onSave,
  onCancel,
  isSaving,
}: NewBookmarkRowProps) {
  return (
    <TableRow className="bg-muted/20">
      <TableCell className="px-4 py-2"></TableCell>
      <TableCell className="px-4 py-2"></TableCell>
      <TableCell className="px-4 py-2">
        <Input
          value={newBookmark.title}
          onChange={(e) => onNewBookmarkChange("title", e.target.value)}
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
          onChange={(e) => onNewBookmarkChange("comment", e.target.value)}
          placeholder="Enter comment"
          className="w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />
      </TableCell>
      <TableCell className="px-4 py-2">
        <Input
          form="newBookmarkForm"
          value={newBookmark.url}
          onChange={(e) => onNewBookmarkChange("url", e.target.value)}
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
            onClick={onSave}
            disabled={isSaving || !newBookmark.title || !newBookmark.url}
            loading={isSaving}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
