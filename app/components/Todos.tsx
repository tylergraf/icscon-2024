'use client'
import React, {useState, useRef, useOptimistic, useTransition} from 'react';
import type { Todo } from '@prisma/client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxios from 'axios-hooks'
import DeleteTodoButton from './DeleteTodoButton';
import NewTodoForm from './NewTodoForm';

interface TodosProps {
  todos?: Todo[];
}

const Todos: React.FC<TodosProps> = () => {
  const [title, setTitle] = useState('');
  const [{ data: todos }, refetchTodos] = useAxios<Todo[]>('/api/todos')

  const [isPending, startTransition] = useTransition()
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos || []);

  const [, addTodo] = useAxios<Todo>(
    { url: '/api/todo/new', method: 'POST' },
    { manual: true }
  );
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    startTransition(async () => {

      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get('title') as string;
      const newTodo = {
        title,
        completed: false,
      };
      
      setOptimisticTodos((oldTodos) => [...oldTodos, { id: Math.random(), title, completed: false }]);
      
      try {
        await addTodo({ data: newTodo });
        setTitle('')
        refetchTodos();
      } catch (err) {
        toast('Failed to add todo', { type: 'error' });
      }
    });
  }
  
  return (
    <div className='container mx-auto max-w-96 mt-16'>
      <ToastContainer></ToastContainer>
      <h1 className='text-2xl font-bold mb-3'>Todos</h1>
      <NewTodoForm handleSubmit={handleSubmit} title={title} setTitle={setTitle} loading={isPending}></NewTodoForm>
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
