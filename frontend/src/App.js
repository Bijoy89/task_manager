import React, { useState } from 'react';
import { taskService } from './api/taskService';
import { useTasks } from './hooks/useTasks';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';

export default function App() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const { tasks, setTasks, loading, error, reload } = useTasks({ status, search });

  const [toast, setToast] = useState({ message: '', type: '' });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, form);
        showToast('Task updated successfully.');
      } else {
        await taskService.create(form);
        showToast('Task created successfully.');
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    const prev = tasks;
    setTasks((cur) => cur.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    try {
      await taskService.update(task.id, { status: newStatus });
      showToast('Status updated.');
    } catch (err) {
      setTasks(prev); 
      showToast(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await taskService.remove(deleteTarget.id);
      showToast('Task deleted.');
      setDeleteTarget(null);
      reload();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="app">
      <Header onNewTask={() => { setEditingTask(null); setFormOpen(true); }} />
      <Toolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />

      {error && <div className="error-banner">{error}</div>}

      <TaskList
        tasks={tasks}
        loading={loading}
        onEdit={(t) => { setEditingTask(t); setFormOpen(true); }}
        onDelete={setDeleteTarget}
        onStatusChange={handleStatusChange}
      />

      <TaskForm
        open={formOpen}
        initialTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setFormOpen(false)}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
    </div>
  );
}