const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../middleware/validateTask');
const ctrl = require('../controllers/taskController');

router.get('/', asyncHandler(ctrl.getAllTasks));
router.get('/:id', asyncHandler(ctrl.getTaskById));
router.post('/', validate(), asyncHandler(ctrl.createTask));
router.put('/:id', validate({ partial: true }), asyncHandler(ctrl.updateTask));
router.delete('/:id', asyncHandler(ctrl.deleteTask));

module.exports = router;