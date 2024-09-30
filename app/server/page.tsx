import React from 'react';
import Todos from '../components/Todos';
import { getTodos } from '@/models/todo';

export default async function TodosPage(){
  const todos = await getTodos()
  return (
    <div>
      <Todos todos={todos} />
    </div>
  );
};
