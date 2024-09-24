'use client'
import React, { useState, useOptimistic, useActionState } from 'react';
import type { Todo } from '@prisma/client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxios from 'axios-hooks'
import DeleteTodoButton from './DeleteTodoButton';

interface TodosProps {
  todos?: Todo[];
}

const Todos: React.FC<TodosProps> = () => {
  const [title, setTitle] = useState('');
  const [{ data: todos }, refetchTodos] = useAxios<Todo[]>('/api/todos')

  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos || []);

  const [, addTodo] = useAxios<Todo>(
    { url: '/api/todo/new', method: 'POST' },
    { manual: true }
  );

  const handleAction = async (previousState: { error: any } | undefined, formData: FormData) => {
    const newTodo = {
      title: formData.get('title') as string,
      completed: false,
    };

    setOptimisticTodos((oldTodos) => [...oldTodos, { id: Math.random(), ...newTodo }]);

    try {
      await addTodo({ data: newTodo });
      setTitle('')
      refetchTodos();
    } catch (err: any) {
      if(err.response.data.error) {
        return { error: err.response.data.error };
      }
      toast('Failed to add todo', { type: 'error' });
    }

  }
  const [actionState, action, isPending] = useActionState(handleAction, { error: null } as { error: any } | undefined);

  return (
    <div className='container mx-auto max-w-96 mt-16'>
      <ToastContainer></ToastContainer>
      <h1 className='text-2xl font-bold mb-3'>Todos</h1>

      <form action={action} className='flex flex-row mb-3'>
        <div className='flex-col inline-flex'>
          <label htmlFor="title">New Todo</label>
          {actionState?.error && <div className='text-red-500'>{actionState?.error}</div>}
          <input
            className='border border-gray-400 p-2'
            type="text"
            name="title"
            disabled={isPending}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='self-end ml-3'>
          <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600 flex flex-row' disabled={isPending}>
            {isPending && <span className="loader mr-2"></span>}
            Add Todo
          </button>
        </div>
      </form>

      <ul>
        {optimisticTodos?.map(todo => (
          <li key={todo.id} className='flex flex-row justify-between mb-1 border-b items-center py-1'>
            <span>{todo.title}</span>
            <DeleteTodoButton todoId={todo.id} refetchTodos={refetchTodos}></DeleteTodoButton>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
