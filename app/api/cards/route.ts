import { GetCardsByUser, createCardByUser, deleteCardById } from "@/lib/prisma/cards";
import { CardType } from "@/lib/types/dbTypes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const cards = (await GetCardsByUser(uid)) as CardType[];
  return NextResponse.json({ cards });
}

export async function POST(request: Request) {
  const body = await request.json();
  const [data, error] = await createCardByUser(body);
  return NextResponse.json({ data, error });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id: string = searchParams.get("id")!;
  const [data, error] = await deleteCardById(id);
  return NextResponse.json({ data, error });
}
