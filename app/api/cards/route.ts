import { GetCardsByUser } from "@/lib/prisma/cards";
import { CardType } from "@/lib/types/dbTypes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const cards = (await GetCardsByUser(uid)) as CardType[];
  return NextResponse.json({ cards });
}

export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);
}
