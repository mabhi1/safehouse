import { GetPasswordsByUser, createPasswordByUser, updatePasswordById } from "@/lib/prisma/passwords";
import { PasswordType } from "@/lib/types/dbTypes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const passwords = (await GetPasswordsByUser(uid)) as PasswordType[];
  return NextResponse.json({ passwords });
}

export async function POST(request: Request) {
  const body = await request.json();
  const [data, error] = await createPasswordByUser(body);
  return NextResponse.json({ data, error });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const [data, error] = await updatePasswordById(body.id, body.site, body.username, body.password);
  return NextResponse.json({ data, error });
}
