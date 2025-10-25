import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from "@/types/task";

// API base URL - reads from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const taskService = {
  getTasks: async (
    page: number = 1,
    limit: number = 10
  ): Promise<{ tasks: Task[]; total: number }> => {
    const response = await fetch(
      `${API_BASE_URL}tasks/getTask?page=${page}&limit=${limit}`,
      { headers: getAuthHeader() }
    );

    if (!response.ok) throw new Error("Failed to fetch tasks");

    const data = await response.json();
    return {
      tasks: data.tasks.map((task: any) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        userId: task.userId,
      })),
      total: data.total,
    };
  },

  createTask: async (task: CreateTaskDto): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}tasks/createTask`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(task),
    });

    if (!response.ok) throw new Error("Failed to create task");

    const data = await response.json();
    return {
      id: data._id,
      ...task,
      createdAt: data.createdAt,
      userId: data.userId,
    };
  },

  updateTask: async (task: UpdateTaskDto): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}tasks/update/${task.id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(task),
    });

    if (!response.ok) throw new Error("Failed to update task");

    const data = await response.json();
    return {
      id: data._id,
      title: data.title,
      description: data.description,
      status: data.status,
      createdAt: data.createdAt,
      userId: data.userId,
    };
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}tasks/delete/${taskId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!response.ok) throw new Error("Failed to delete task");
  },

  updateTaskStatus: async (
    taskId: string,
    status: "pending" | "completed"
  ): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}tasks/${taskId}/status`, {
      method: "PATCH",
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Failed to update task status");

    const data = await response.json();
    return {
      id: data.task._id,
      title: data.task.title,
      description: data.task.description,
      status: data.task.status,
      createdAt: data.task.createdAt,
      userId: data.task.userId,
    };
  },
};
