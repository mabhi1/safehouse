"use client";

import React from "react";
import { BookmarkType } from "@/lib/db-types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Save, X, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteBookmark } from "@/actions/bookmarks";

interface BookmarkRowProps {
  bookmark: BookmarkType;
  userId: string;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  isEditing: boolean;
  editingData: {
    title: string;
    comment: string;
    url: string;
  } | null;
  onEdit: (bookmark: BookmarkType) => void;
  onCancelEdit: () => void;
  onEditChange: (field: string, value: string) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export default function BookmarkRow({
  bookmark,
  userId,
  isSelected,
  onSelect,
  isEditing,
  editingData,
  onEdit,
  onCancelEdit,
  onEditChange,
  onSave,
  isSaving,
}: BookmarkRowProps) {
  // Extract domain for favicon
  let domain;
  try {
    domain = new URL(bookmark.url).hostname;
  } catch (error) {
    domain = bookmark.url;
  }

  return (
    <TableRow className="hover:bg-muted/20">
      <TableCell className="px-4 py-2">
        <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(bookmark.id, checked as boolean)} />
      </TableCell>
      <TableCell className="px-4 py-2">
        <div className="relative h-6 w-6">
          <Image
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
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
      {isEditing ? (
        <>
          <TableCell className="px-4 py-2">
            <Input
              value={editingData?.title || ""}
              onChange={(e) => onEditChange("title", e.target.value)}
              className="h-8 w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              autoFocus
              required
            />
          </TableCell>
          <TableCell className="hidden md:table-cell px-4 py-2">
            <Input
              form={`editForm-${bookmark.id}`}
              value={editingData?.comment || ""}
              onChange={(e) => onEditChange("comment", e.target.value)}
              className="h-8 w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </TableCell>
          <TableCell className="px-4 py-2">
            <Input
              form={`editForm-${bookmark.id}`}
              value={editingData?.url || ""}
              onChange={(e) => onEditChange("url", e.target.value)}
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
                onClick={onSave}
                disabled={isSaving}
                loading={isSaving}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onCancelEdit}>
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
              <Button size="icon" variant="ghost" onClick={() => onEdit(bookmark)}>
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
  );
}
