import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const data: { title?: string; done?: boolean } = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.done === "boolean") data.done = body.done;

  const todo = await prisma.todo.update({ where: { id: Number(id) }, data });
  return NextResponse.json(todo);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.todo.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
