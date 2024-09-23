import { Todo } from "@prisma/client";
import { prisma } from "../app/db";

export function getTodos() {
  return prisma.todo.findMany();
}

export async function getTodo(id: Pick<Todo, "id">) {
  return prisma.todo.findFirst({ where: id });
}
export async function createTodo(data: Omit<Todo, "id">) {
  return prisma.todo.create({ data });
}
export async function deleteTodo(id: Pick<Todo, "id">) {
  return prisma.todo.delete({ where: id });
}
