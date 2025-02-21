"use client";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import MobileContainer from "./mobile-container";

const API_URL = "https://dastageerhc-gh-demo-pro-92.deno.dev/todos";

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Fetch todos from backend
  async function fetchTodos() {
    setLoading(true);
    const response = await fetch(API_URL);
    const data = await response.json();
    setTodos(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to add a new todo
  async function addTodo() {
    if (!newTask.trim()) return;
    setLoading(true);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask }),
    });
    await response.json();
    fetchTodos();
    setNewTask("");
  }

  // Function to remove a todo
  async function removeTodo(id: number) {
    setLoading(true);
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  // Function to toggle completion status
  async function toggleTodoCompletion(id: number, completed: boolean) {
    setLoading(true);
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-slate-300 to-slate-500'>
      <MobileContainer>
        <div className='w-full max-w-md bg-white p-6 rounded shadow'>
          <h1 className='text-3xl font-bold mb-4'> TODO App</h1>
          <div className='flex gap-2 mb-4'>
            <TextField
              id='outlined-basic'
              label='Task'
              variant='outlined'
              className='flex-grow'
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder='Enter a task...'
            />
            <Button variant='contained' onClick={addTodo} disabled={loading}>
              {loading ? (
                <span className='animate-spin h-5 w-5 border-t-2 border-white rounded-full'></span>
              ) : (
                "Add"
              )}
            </Button>
          </div>
          {loading && (
            <div className='text-center text-gray-600'>Loading...</div>
          )}
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex justify-between items-center bg-gray-100 p-2 rounded mb-2 ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={todo.completed}
                    onChange={() =>
                      toggleTodoCompletion(todo.id, todo.completed)
                    }
                    className='cursor-pointer'
                  />
                  {todo.task}
                </div>

                  <button
                  className='bg-red-500 text-white px-2 py-1 rounded'
                  onClick={() => removeTodo(todo.id)}
                  disabled={loading}
                  >
                  Delete
                  
                </button>
              </li>
            ))}
          </ul>
        </div>
      </MobileContainer>
    </div>
  );
}
