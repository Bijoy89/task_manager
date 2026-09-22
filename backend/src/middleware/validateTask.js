const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];

function validate({ partial = false } = {}) {
  return (req, res, next) => {
    const body = req.body || {};
    const errors = [];

    if (!partial || body.title !== undefined) {
      if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
        errors.push('Title is required and must be a non-empty string.');
      } else if (body.title.length > 150) {
        errors.push('Title must be 150 characters or fewer.');
      }
    }

    if (body.description !== undefined) {
      if (typeof body.description !== 'string') {
        errors.push('Description must be a string.');
      } else if (body.description.length > 2000) {
        errors.push('Description must be 2000 characters or fewer.');
      }
    }

    if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
      errors.push(`Priority must be one of: ${PRIORITIES.join(', ')}.`);
    }

    if (body.status !== undefined && !STATUSES.includes(body.status)) {
      errors.push(`Status must be one of: ${STATUSES.join(', ')}.`);
    }

    if (errors.length) {
      return res.status(400).json({ error: errors.join(' ') });
    }
    next();
  };
}

module.exports = { validate, PRIORITIES, STATUSES };