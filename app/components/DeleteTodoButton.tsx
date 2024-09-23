import React from 'react';
import useAxios from 'axios-hooks';
import { toast } from 'react-toastify';

interface DeleteTodoButtonProps {
  todoId: number;
  refetchTodos: () => void;
}

const DeleteTodoButton: React.FC<DeleteTodoButtonProps> = ({ todoId, refetchTodos }) => {
  const [{ loading: isPending }, deleteTodo] = useAxios(
    {
      url: `/api/todo/${todoId}`,
      method: 'DELETE'
    },
    { manual: true }
  );
  const handleDelete = async () => {
    try {
      await deleteTodo();
      refetchTodos();
    } catch (error) {
      toast('Failed to delete todo', { type: 'error' });
    }
  };
  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      {isPending ? <span className='loader'></span> : 'x'}
    </button>
  );
};

export default DeleteTodoButton;
