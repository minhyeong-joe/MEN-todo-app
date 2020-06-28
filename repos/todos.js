const express = require('express');
const router = express.Router();
const passport = require('passport');
const Todo = require('../models/todo');

// GET
// http://localhost/api/todos/:userId
router.get('/:userId', passport.authenticate('jwt', {session: false}), (req, res) => {
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
                todos: todos
            });
        }
    });
});

// POST
// http://localhost/api/todos
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { userId, title, description } = req.body;
    
    const newTodo = new Todo({
        owner: userId,
        title: title,
        description: description,
        isDone: false
    });
    
    Todo.addTodo(newTodo, (err, todo) => {
        if (err) throw err;
        res.json({
            success: true,
            newTodo: todo
        });
    });
});

// DELETE
// http://localhost/api/todos/:todoId
router.delete('/:todoId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { todoId } = req.params;
    Todo.deleteTodo(todoId, (err, del) => {
        if (err) throw err;
        if (del.ok != 1) {
            res.json({success: false, msg: "Unknown error occurred."});
        } else if (del.deletedCount == 0) {
            res.json({success: false, msg: "Todo with given ID does not exist."});
        } else {
            res.json({success: true, msg: "Successfully deleted a todo item."});
        }
    });
});

module.exports = router;