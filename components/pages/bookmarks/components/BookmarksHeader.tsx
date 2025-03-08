"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, CircleSlash, StepForward } from "lucide-react";
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

interface BookmarksHeaderProps {
  bookmarkCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
  onDeleteSelected: () => void;
  isDeleteDisabled: boolean;
  isDeleting: boolean;
}

export default function BookmarksHeader({
  bookmarkCount,
  searchTerm,
  onSearchChange,
  onAddNew,
  onDeleteSelected,
  isDeleteDisabled,
  isDeleting,
}: BookmarksHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex items-center gap-1">
        <span className="text-xl capitalize">Bookmarks</span>
        <Badge variant="secondary" className="font-normal">
          {bookmarkCount}
        </Badge>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Search Bookmarks"
          className="h-9 w-36 md:w-56"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleteDisabled} ICON={Trash2} mobileVariant>
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
              <AlertDialogAction onClick={onDeleteSelected} asChild>
                <Button ICON={StepForward} disabled={isDeleting}>
                  Continue
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={onAddNew} ICON={Plus} mobileVariant>
          Add Bookmark
        </Button>
      </div>
    </div>
  );
}
