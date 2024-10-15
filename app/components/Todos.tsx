'use client'
import React, { useActionState } from 'react';
import type { Todo } from '@prisma/client'
import DeleteTodoButton from './DeleteTodoButton';
import { handleAddTodo } from '../actions';
import { type State } from '../actions';
interface TodosProps {
  todos?: Todo[];
}

const Todos: React.FC<TodosProps> = ({ todos }) => {
  const [actionState, action, isPending] = useActionState(handleAddTodo, { errors: null } as State);
  
  return (
    <div className='container mx-auto max-w-96 mt-16'>
      <h1 className='text-2xl font-bold mb-3'>Todos</h1>

      <form action={action} className='flex flex-row mb-3'>
        <div className='flex-col inline-flex'>
          <label htmlFor="title">New Todo</label>
          {actionState?.errors && <div className='text-red-500'>{actionState?.errors[0].message}</div>}
          <input
            className='border border-gray-400 p-2'
            type="text"
            name="title"
            disabled={isPending}
          />
        </div>
        <div className='self-end ml-3'>
          <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600 flex flex-row' 
          disabled={isPending}
          >
            {isPending && <span className="loader mr-2"></span>}
            Add Todo
          </button>
        </div>
      </form>

      <ul>
        {todos?.map(todo => (
          <li key={todo.id} className='flex flex-row justify-between mb-1 border-b items-center py-1'>
            <span>{todo.title}</span>
            <DeleteTodoButton todoId={todo.id}></DeleteTodoButton>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
