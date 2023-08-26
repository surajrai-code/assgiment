import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { openDB } from "./IndexedDB";
import './Modal.css';
import {
  Modal,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";

const TaskModal = ({ open, onClose, onTaskDeleted, taskToEdit }) => {
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState(new Date());

  useEffect(() => {
    if (taskToEdit) {
      setTaskDescription(taskToEdit.description);
      setTaskStatus(taskToEdit.status);
      setDueDate(new Date(taskToEdit.dueDate));
    } else {
      setTaskDescription("");
      setTaskStatus("To Do");
      setDueDate(new Date());
    }
  }, [taskToEdit]);

  const handleCreate = async () => {
    if (taskDescription === "") return;

    const newTask = {
      description: taskDescription,
      status: taskStatus,
      dueDate: dueDate.toISOString(),
    };

    try {
      const db = await openDB();
      const transaction = db.transaction("tasks", "readwrite");
      const objectStore = transaction.objectStore("tasks");
      let request;

      if (taskToEdit) {
        newTask.id = taskToEdit.id;
        request = objectStore.put(newTask);
      } else {
        request = objectStore.add(newTask);
      }

      request.onsuccess = () => {
        console.log("Task added/updated in IndexedDB");
        onClose();
      };

      request.onerror = () => {
        console.error("Error adding/updating task to IndexedDB");
      };
    } catch (error) {
      console.error("Error opening IndexedDB:", error);
    }
  };

  const handleDelete = async () => {
    if (!taskToEdit) return;

    try {
      const db = await openDB();
      const transaction = db.transaction("tasks", "readwrite");
      const objectStore = transaction.objectStore("tasks");

      const request = objectStore.delete(taskToEdit.id);

      request.onsuccess = () => {
        console.log("Task deleted from IndexedDB");
        onTaskDeleted(taskToEdit.status, taskToEdit.id);
        onClose();
      };

      request.onerror = () => {
        console.error("Error deleting task from IndexedDB");
      };
    } catch (error) {
      console.error("Error opening IndexedDB:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="custom-modal">
      <FormControl className="custom-form-container">
        <h2>{taskToEdit ? "Edit Task" : "Create Task"}</h2>
        <FormLabel>Add Task Description</FormLabel>
        <TextField
          multiline
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Task Status
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
          >
            <FormControlLabel value="To Do" control={<Radio />} label="To Do" />
            <FormControlLabel
              value="In Progress"
              control={<Radio />}
              label="In Progress"
            />
            <FormControlLabel value="Done" control={<Radio />} label="Done" />
          </RadioGroup>
        </FormControl>

        <FormLabel>Due Date</FormLabel>
        <DatePicker
          label="Due Date"
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          dateFormat="dd/MM/yyyy"
        />

        <Button onClick={handleDelete} color="secondary">
          Delete
        </Button>

        <Button onClick={handleCreate}>
          {taskToEdit ? "Update" : "Create"}
        </Button>
      </FormControl>
    </Modal>
  );
};

export default TaskModal;