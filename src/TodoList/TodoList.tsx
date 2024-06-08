import { useState } from 'react';
import './TodoList.module.css';

let id = 0;

// The reason for not using object of [id]: {label: string} is that there's only one property for now, so we don't need to specify it.
const INITIAL_TASKS: Record<number, string> = {
  [id++]:  'Walk the dog' ,
  [id++]:  'Water the plants' ,
  [id++]:  'Wash the dishes' ,
};
const TodoList = () => {
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [newTask, setNewTask] = useState('');
  
    return (
      <div>
        <h1>Todo List</h1>
        <div>
          <input
            aria-label="Add new task"
            type="text"
            placeholder="Add your task"
            value={newTask}
            onChange={(event) => {
              setNewTask(event.target.value);
            }}
          />
          <div>
            <button
              onClick={() => {
                setTasks(
                  prev => {
                    return {...prev, [id++]: newTask}
                  }
                );
                setNewTask('');
              }}>
              Submit
            </button>
          </div>
        </div>
        <ul>
          {Object.entries(tasks).map(([id, label]) => (
            <li key={id}>
              <span>{label}</span>
              <button
                onClick={() => {
                  setTasks(
                    prev => {
                        const copy = {...prev}
                        delete copy[id]
                        return copy
                    }
                  );
                }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default TodoList;
