import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

type Task = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  conclusion_date: string | null;
  completed: string;
  user: number;
};

type TaskContextType = {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { user_id } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    if (!user_id) return;
    try {
      const response = await axios.get(`http://localhost:8000/api/tasks/?user=${user_id}`);
      setTasks(response.data);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
  };

  const refreshTasks = async () => {
    await fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [user_id]);

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
