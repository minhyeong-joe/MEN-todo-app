const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// get all todos
router.get('/:userId', (req, res) => {
    const {userId} = req.params;
    Todo.getAllTodosByUserId(userId, (err, todos) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to load todo items'
            });
        } else {
            res.json({
                success: true,
                msg: 'Successfully loaded todo items',
                todos: todos
            });
        }
    });
});

module.exports = router;