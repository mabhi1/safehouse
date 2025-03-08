"use server";

import {
  createBookmarkByUser,
  deleteBookmarkById,
  searchBookmarksByText,
  updateBookmarkById,
} from "@/prisma/db/bookmarks";
import { revalidatePath } from "next/cache";

export async function deleteBookmark(bookmarkId: string, uid: string) {
  const res = await deleteBookmarkById(bookmarkId, uid);
  revalidatePath("/bookmarks");
  return res;
}

export async function addBookmark(title: string, comment: string, url: string, uid: string) {
  const res = await createBookmarkByUser(title, comment, url, uid);
  revalidatePath("/bookmarks");
  return res;
}

export async function editBookmark(bookmarkId: string, title: string, comment: string, url: string, uid: string) {
  const res = await updateBookmarkById(bookmarkId, title, comment, url, uid);
  revalidatePath("/bookmarks");
  return res;
}

export async function searchBookmarks(text: string, userId: string) {
  const res = await searchBookmarksByText(text, userId);
  return res;
}
