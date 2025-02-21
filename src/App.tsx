"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button, TextField } from "@mui/material";

const supabaseUrl: string = "https://bphshnuqwqjuqnmdnboc.supabase.co";
const supabaseAnonKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaHNobnVxd3FqdXFubWRuYm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MTA0MjAsImV4cCI6MjA1NDA4NjQyMH0.xyAyzdOrsLe-01RUoGi8x9G_XrQVmU1Rrd-jSwwTC9U";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  // Fetch todos from Supabase
  async function fetchTodos() {
    const { data, error } = await supabase.from("todos").select("*");
    if (error) console.error("Error fetching todos:", error);
    else setTodos(data as Todo[]);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to add a new todo
  async function addTodo() {
    if (!newTask.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ task: newTask, completed: false }])
      .select("*");
    if (error) {
      console.error("Error adding todo:", error);
    } else {
      setTodos((prevTodos) => [...prevTodos, ...(data as Todo[])]);
      setNewTask("");
    }
  }

  // Function to remove a todo
  async function removeTodo(id: number) {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    }
  }

  // Function to toggle completion status
  async function toggleTodoCompletion(id: number, completed: boolean) {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);
    if (error) {
      console.error("Error updating todo:", error);
    } else {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-slate-300 to-slate-500'>
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
              className={`flex justify-between items-center bg-gray-100 p-2 rounded mb-2 ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo.id, todo.completed)}
                  className='cursor-pointer'
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
    </div>
  );
}
