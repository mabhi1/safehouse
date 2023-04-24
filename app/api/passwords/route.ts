import { GetPasswordsByUser } from "@/lib/prisma/passwords";
import { PasswordType } from "@/lib/types/dbTypes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const passwords = (await GetPasswordsByUser(uid)) as PasswordType[];
  return NextResponse.json({ passwords });
}

export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);
}
