"use server";

import { createEventByUser, deleteEventById, updateEventById } from "@/prisma/db/events";
import { revalidatePath } from "next/cache";

export async function addEvent(title: string, description: string, date: Date, uid: string) {
  const res = await createEventByUser(title, description, date, uid);
  revalidatePath("/events");
  return res;
}

export async function deleteEvent(eventId: string, uid: string) {
  const res = await deleteEventById(eventId, uid);
  const month = res.data?.date.getMonth();
  const date = res.data?.date.getDate();
  const year = res.data?.date.getFullYear();
  revalidatePath(`/events?month=${month}&date=${date}&year=${year}`);
  return res;
}

export async function updateEvent(eventId: string, title: string, description: string, eventDate: Date, uid: string) {
  const res = await updateEventById(eventId, title, description, eventDate, uid);
  const month = res.data?.date.getMonth();
  const date = res.data?.date.getDate();
  const year = res.data?.date.getFullYear();
  revalidatePath(`/events?month=${month}&date=${date}&year=${year}`);
  return res;
}
