import React from 'react';

export default function Toolbar({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="toolbar">
      <input
        className="search-input"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tasks"
      />
      <select value={status} onChange={(e) => onStatusChange(e.target.value)} aria-label="Filter by status">
        <option value="">All Statuses</option>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
    </div>
  );
}