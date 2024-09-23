
import { NextResponse, type NextRequest } from "next/server";
import { deleteTodo } from "@/models/todo";



export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Extract the id from the path

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await deleteTodo({ id: Number(id) });

  return NextResponse.json({ message: "deleted" }, { status: 200 });
}
