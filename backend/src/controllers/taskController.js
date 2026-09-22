const db = require('../db');

exports.getAllTasks = (req, res) => {
  const { status, priority, search } = req.query;
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY datetime(created_date) DESC';

  const tasks = db.prepare(query).all(...params);
  res.json(tasks);
};

exports.getTaskById = (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found.' });
  res.json(task);
};

exports.createTask = (req, res) => {
  const { title, description = '', priority = 'Medium', status = 'Pending' } = req.body;
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, created_date, updated_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(title.trim(), description, priority, status, now, now);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(task);
};

exports.updateTask = (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found.' });

  const updated = {
    title: req.body.title !== undefined ? req.body.title.trim() : existing.title,
    description: req.body.description !== undefined ? req.body.description : existing.description,
    priority: req.body.priority !== undefined ? req.body.priority : existing.priority,
    status: req.body.status !== undefined ? req.body.status : existing.status,
  };
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, updated_date = ?
    WHERE id = ?
  `).run(updated.title, updated.description, updated.priority, updated.status, now, req.params.id);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(task);
};

exports.deleteTask = (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found.' });

  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ message: 'Task deleted successfully.', id: Number(req.params.id) });
};