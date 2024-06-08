import { ChangeEvent, useState } from 'react';
import './TodoList.module.css';

let id = 0;

interface Task{
    id: number,
    label: string
}
const INITIAL_TASKS: Task[] = [
  { id: id++, label: 'Walk the dog' },
  { id: id++, label: 'Water the plants' },
  { id: id++, label: 'Wash the dishes' },
];
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
                  tasks.concat({
                    id: id++,
                    label: newTask.trim(),
                  }),
                );
                setNewTask('');
              }}>
              Submit
            </button>
          </div>
        </div>
        <ul>
          {tasks.map(({ id, label }) => (
            <li key={id}>
              <span>{label}</span>
              <button
                onClick={() => {
                  setTasks(
                    tasks.filter((task) => task.id !== id),
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
