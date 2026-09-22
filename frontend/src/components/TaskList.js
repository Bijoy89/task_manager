import React from 'react';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

export default function TaskList({ tasks, loading, onEdit, onDelete, onStatusChange }) {
  if (loading) return <LoadingSpinner label="Loading tasks..." />;
  if (!tasks.length) return <EmptyState />;

  return (
    <div className="task-grid">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}