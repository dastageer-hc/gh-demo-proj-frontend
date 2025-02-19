"use client";
import { useEffect, useState } from "react";
import socket from "../lib/socket"; // Import the WebSocket connection
import { createClient } from "@supabase/supabase-js";
import MobileContainer from "./mobile-container";
import { Button, TextField } from "@mui/material";



const supabaseUrl: string = "https://bphshnuqwqjuqnmdnboc.supabase.co";
const supabaseAnonKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaHNobnVxd3FqdXFubWRuYm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MTA0MjAsImV4cCI6MjA1NDA4NjQyMH0.xyAyzdOrsLe-01RUoGi8x9G_XrQVmU1Rrd-jSwwTC9U";


const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  // Fetch initial todos
  useEffect(() => {
    async function fetchTodos() {
      let { data, error } = await supabase.from("todos").select("*");
      if (error) console.error("Error fetching todos:", error);
      else setTodos(data as any);
    }
    fetchTodos();
  }, []);

  // WebSocket Event Listeners
  useEffect(() => {
    // Listen for updates from WebSocket
    socket.on("update", (data) => {
      console.log("Received update:", data);
      setTodos(data);
    });

    return () => {
      socket.off("update");
    };
  }, []);

  // Function to add a new todo
  async function addTodo() {
    if (!newTask.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ task: newTask }]);

    if (error) {
      console.error("Error adding todo:", error);
    } else {
      socket.emit("newTodo"); // Notify backend about the new todo
      setNewTask(""); // Clear input
    }
  }

  // Function to remove a todo
  async function removeTodo(id: any) {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      socket.emit("deleteTodo"); // Notify backend about deletion
    }
  }

  return (
    <div className='min-h-screen w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-r from-slate-300 to-slate-500'>
      <MobileContainer>
        <h1 className='text-3xl font-bold mb-4'>Real-time TODO App</h1>
        <div className='flex space-x-2 mb-4 gap-2 w-full justify-between'>
          <TextField
            id='outlined-basic'
            label='Task'
            variant='outlined'
            className='w-[70%]'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder='Enter a task...'
          />
          <Button
            component='label'
            role={undefined}
            variant='contained'
            tabIndex={-1}
            onClick={addTodo}
            className='w-[30%]'
          >
            Add
          </Button>
        </div>
        <ul className='w-full max-w-md cursor-pointer'>
          {todos.map((todo, index) => (
            <li
              key={index}
              className='flex justify-between bg-white p-3 rounded shadow mb-2'
            >
              {todo?.task as unknown as any}
              <button
                className='bg-red-500 text-white px-2 py-1 rounded'
                onClick={() => removeTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </MobileContainer>
    </div>
  );
}
