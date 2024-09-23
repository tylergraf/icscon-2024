import React, { useState } from 'react';

interface NewTodoFormProps {
  loading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (title: string) => void;
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({ title, setTitle, loading, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className='flex flex-row mb-3'>
      <div className='flex-col inline-flex'>
        <label htmlFor="title">New Todo</label>

        <input
          className='border border-gray-400 p-2'
          type="text"
          name="title"
          disabled={loading}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className='self-end ml-3'>
        <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600 flex flex-row' disabled={loading}>
          {loading && <span className="loader mr-2"></span>}
          Add Todo
        </button>
      </div>
    </form>
  );
};

export default NewTodoForm;
