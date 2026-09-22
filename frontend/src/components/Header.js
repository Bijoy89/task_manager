import React from 'react';

export default function Header({ onNewTask }) {
  return (
    <header className="app-header">
      <h1>Task Manager</h1>
      <button className="btn btn-primary" onClick={onNewTask}>+ New Task</button>
    </header>
  );
}