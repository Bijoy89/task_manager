import React from 'react';

const priorityClass = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' };
const statusClass = { Pending: 'badge-pending', 'In Progress': 'badge-progress', Completed: 'badge-completed' };

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <span className={`badge ${priorityClass[task.priority]}`}>{task.priority}</span>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-meta">
        <span className={`badge ${statusClass[task.status]}`}>{task.status}</span>
        <span className="task-date">Created {new Date(task.created_date).toLocaleDateString()}</span>
      </div>
      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
          aria-label={`Change status for ${task.title}`}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <button className="btn btn-small btn-secondary" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  );
}