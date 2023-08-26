import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { PlaylistAdd, HourglassEmpty, CheckCircle } from "@mui/icons-material";
import TaskModal from "./TaskModal";
import TaskColumn from "./TaskColumn";
import { openDB } from "./IndexedDB";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasksFromDB = async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction("tasks", "readonly");
      const objectStore = transaction.objectStore("tasks");
      const cursor = objectStore.openCursor();

      const tasksArray = [];

      cursor.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          tasksArray.push(cursor.value);
          cursor.continue();
        }
      };

      cursor.onerror = (event) => {
        console.error("Error fetching tasks from IndexedDB:", event.target.error);
      };

      transaction.oncomplete = () => {
        setTasks(tasksArray);

        const todo = tasksArray.filter(task => task.status === "To Do");
        const inProgress = tasksArray.filter(task => task.status === "In Progress");
        const done = tasksArray.filter(task => task.status === "Done");

        setTodoTasks(todo);
        setInProgressTasks(inProgress);
        setDoneTasks(done);
      };
    } catch (error) {
      console.error("Error fetching tasks from IndexedDB:", error);
    }
  };

  useEffect(() => {
    fetchTasksFromDB();
  }, []);

  const removeTaskFromStatus = (status, taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);

    switch (status) {
      case "To Do":
        setTodoTasks(todoTasks.filter(task => task.id !== taskId));
        break;
      case "In Progress":
        setInProgressTasks(inProgressTasks.filter(task => task.id !== taskId));
        break;
      case "Done":
        setDoneTasks(doneTasks.filter(task => task.id !== taskId));
        break;
      default:
        break;
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <Grid container spacing={3}>
      <TaskColumn
        tasks={todoTasks}
        icon={<PlaylistAdd />}
        title="Todo"
        onTaskClick={openEditModal}
      />
      <TaskColumn
        tasks={inProgressTasks}
        icon={<HourglassEmpty />}
        title="In Progress"
        onTaskClick={openEditModal}
      />
      <TaskColumn
        tasks={doneTasks}
        icon={<CheckCircle />}
        title="Done"
        onTaskClick={openEditModal}
      />

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        onTaskDeleted={removeTaskFromStatus}
        taskToEdit={selectedTask}
      />
    </Grid>
  );
};

export default TaskBoard;