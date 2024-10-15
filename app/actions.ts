'use server'
import {createTodo} from '@/models/todo'
import { revalidatePath } from 'next/cache';
import { z } from "zod";

export type State = {
  errors: any
} | undefined

export const handleAddTodo = async (previousState: State, formData: FormData) => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const schema = z.object({
    title: z.string().min(1, "Title is required"),
  });

  const result = schema.safeParse({ title: formData.get('title') });

  if (!result.success) {
    return {errors: result.error.errors}
  }
  const newTodo = {
    title: formData.get('title') as string,
    completed: false,
  };
  try {
    await createTodo(newTodo);
    revalidatePath('/server')
  } catch (err: any) {
    return {errors: [err]}
  }


}
