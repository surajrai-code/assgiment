import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const TaskColumn = ({ tasks, icon, title, onTaskClick }) => (
  <Grid item xs={4}>
    <Typography variant="h6">
      {icon} {title}
    </Typography>
    {tasks.map((task) => (
      <Paper
        key={task.id}
        style={{ padding: "10px", marginBottom: "10px", cursor: "pointer" }}
        onClick={() => onTaskClick(task)}
      >
        <Typography>{task.description}</Typography>
        <Typography>{task.dueDate}</Typography>
      </Paper>
    ))}
  </Grid>
);

export default TaskColumn;