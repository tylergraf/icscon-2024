
import { NextResponse, type NextRequest } from "next/server";
import { createTodo } from "@/models/todo";


export async function POST(request: NextRequest) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const body = await request.json();

  if (!body?.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const newTodo = await createTodo(body);

  return NextResponse.json(newTodo, { status: 201 });
}
