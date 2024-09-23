
import { NextResponse, type NextRequest } from "next/server";
import { getTodos } from "@/models/todo";

export async function GET(request: NextRequest) {
  const todos = await getTodos();
  return NextResponse.json(todos, { status: 200 });
}
