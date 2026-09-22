import React from 'react';

export default function EmptyState() {
  return (
    <div className="state-box">
      <p className="empty-icon">📋</p>
      <h3>No tasks yet</h3>
      <p>Create your first task to get started.</p>
    </div>
  );
}