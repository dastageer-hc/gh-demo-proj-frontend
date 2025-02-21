"use client";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import MobileContainer from "./mobile-container";

const API_URL = "http://localhost:3200/todos";

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  // Fetch todos from backend
  async function fetchTodos() {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to add a new todo
  async function addTodo() {
    if (!newTask.trim()) return;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask }),
    });
    const data = await response.json();
    setTodos((prevTodos) => [...prevTodos, ...data]);
    setNewTask("");
  }

  // Function to remove a todo
  async function removeTodo(id: number) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }

  // Function to toggle completion status
  async function toggleTodoCompletion(id: number, completed: boolean) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );
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
            <Button variant='contained' onClick={addTodo}>
              Add
            </Button>
          </div>
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex justify-between items-center bg-gray-100 p-2 rounded mb-2 `}
              >
                <div
                  className={`flex items-center gap-2 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  <input
                    type='checkbox'
                    checked={todo.completed}
                    onChange={() =>
                      toggleTodoCompletion(todo.id, todo.completed)
                    }
                    className={`cursor-pointer `}
                  />
                  {todo.task}
                </div>
                <button
                  className='bg-red-500 text-white px-2 py-1 rounded'
                  onClick={() => removeTodo(todo.id)}
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
