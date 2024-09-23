'use client'
import React, { useOptimistic, useTransition } from 'react';
import type { Todo as PrismaTodo } from '@prisma/client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxios from 'axios-hooks'
import DeleteTodoButton from './DeleteTodoButton';
import axios from 'axios';

interface Todo extends PrismaTodo {
  loading?: boolean;
}

interface TodosProps {
  todos?: Todo[];
}

const addTodo = async (title: string): Promise<Todo> => {
  const newTodo = {
    title,
    completed: false,
  };

  return axios.post('/api/todo/new', newTodo);
};

const Todos: React.FC<TodosProps> = () => {
  const [title, setTitle] = React.useState<string>('');
  const [isPending, startTransition] = useTransition()

  const [{ data }, refetchTodos] = useAxios<Todo[]>('/api/todos')

  const [optimisticTodos, setOptimisticTodos] = useOptimistic<Todo[]>(data || []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTodo = {
      title: formData.get('title') as string,
      completed: false,
    };

    startTransition(async () => {
      setOptimisticTodos((todos) => [...todos, { loading: true, id: Math.random(), ...newTodo }]);
      try {
        await addTodo(newTodo.title)
      } catch (err) {
        toast('Failed to add todo', { type: 'error' });
      }
      setTitle('');
      refetchTodos()
    });
  }

  return (
    <div className='container mx-auto max-w-96 mt-16'>
      <ToastContainer></ToastContainer>
      <h1 className='text-2xl font-bold mb-3'>Todos</h1>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-row mb-3'>

          <div className='flex-col inline-flex'>
            <label htmlFor="title">New Todo</label>

            <input
              className='border border-gray-400 p-2'
              type="text"
              name="title"
              disabled={isPending}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className='self-end ml-3'>
            <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600 flex flex-row' disabled={isPending}>
              {isPending && <span className="loader mr-2"></span>}
              Add Todo
            </button>
          </div>
        </div>
      </form>
      <ul>
        {optimisticTodos?.map(todo => (
          <li key={todo.id} className='flex flex-row justify-between mb-1 border-b items-center py-1'>
            <span>{todo.title}</span>
            {!todo.loading && <DeleteTodoButton todoId={todo.id} onDelete={refetchTodos}></DeleteTodoButton>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
