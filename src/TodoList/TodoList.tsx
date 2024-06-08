import { ChangeEvent, useState } from 'react';
import './TodoList.module.css';

const defaultTodoList: string[] = [
  'Walk the dog',
  'Water the plants',
  'Wash the dishes'
]
const TodoList = () => {
    const [todoList, setTodo] = useState<string[]>(defaultTodoList)
    const [newItem, setNewItem] = useState<string>('');
  
    const handleDeletion = (index: number) => {
      setTodo(prev => {
        const copy = [...prev]
        copy.splice(index, 1)
        return copy
      })
    }
    const handleAdd = () => {
      setTodo(prev => {
        return [...prev, newItem]
      })
      setNewItem('')
    }
  
    const handleNewTaskChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNewItem(e.target.value)
    }
  
    return (
      <div>
        <h1>Todo List</h1>
        <div>
          <input type="text" placeholder="Add your task" value={newItem} onChange={handleNewTaskChange} />
          <div>
            <button onClick={handleAdd} >Submit</button>
          </div>
        </div>
        <ul>
          {todoList.map((todo, index) => (
            <li key={todo}>
              <span>{todo}</span>
              <button onClick={() => handleDeletion(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default TodoList;
