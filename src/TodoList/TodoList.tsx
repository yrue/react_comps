import { useState } from 'react';

let id = 0
const getId = (): number => {
    id += 1;
    return id
}

type TaskMap = Map<number, string>;

const defaultTodos: TaskMap = new Map([
    [getId(), 'Walk the dog'],
    [getId(), 'Water the plants'],
    [getId(), 'Wash the dishes']
]);
const TodoList = () => {
    const [todos, setTodos] = useState<TaskMap>(defaultTodos)
    const [newTodo, setNewTodo] = useState<string>('');
    return (
        <>
            <h1>Todo List</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formItem = new FormData(e.currentTarget);
                const newTodo = formItem.get('todo') as string;

                setTodos(prevState => {
                    prevState.set(getId(), newTodo);
                    return new Map(prevState);
                });
                setNewTodo('');
            }}>
                <input aria-label="Add new task" placeholder='Add your task' name='todo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                <button type='submit' disabled={!newTodo}>Submit</button>
            </form>
            {todos.size > 0 && (
                <ul>
                    {Array.from(todos).map(([id, content]) => (
                        <li key={id}>{content}
                            <button onClick={() => {
                                setTodos(prevState => {
                                    prevState.delete(id);
                                    return new Map(prevState);
                                });
                            }}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default TodoList;
