import {useState} from 'react';
interface Todo {
    id: number,
    content: string
}
let id = 0
const getId = () => {
    id += 1;
    return id
}
const defaultTodos : Todo[] = [
    {
        id: getId(),
        content: 'Walk the dog'
    },
    {
        id: getId(),
        content: 'Water the plants'
    },
    {
        id: getId(),
        content: 'Wash the dishes'
    }
]
const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>(defaultTodos)
    const [newTodo, setNewTodo] = useState<string>('');
    return (
        <>
            <h1>Todo List</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formItem = new FormData(e.currentTarget);
                const newTodo = formItem.get('todo') as string; // TODO: other approach than `as string`?

                setTodos([...todos, {id: getId(), content: newTodo}]);
                setNewTodo('');
            }}>
                <input placeholder='Add your task' name='todo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)}/>
                <button type='submit' disabled={!newTodo}>Submit</button>
            </form>
            {todos.length > 0 &&(
                <ul>
                    {todos.map(({id, content}) => (
                        <>
                            <li key={id}>{content}</li>
                            <button onClick={() => {
                                setTodos([...todos.filter(todo => todo.id !== id)])
                            }}>Delete</button>
                        </>
                    ))}
                </ul>
            )}
        </>
    );
};

export default TodoList;
