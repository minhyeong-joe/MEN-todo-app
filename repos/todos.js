const express = require('express');
const router = express.Router();
const passport = require('passport');
const Todo = require('../models/todo');

// GET
// http://localhost/api/todos/:userId
router.get('/:userId', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {userId} = req.params;

    // if userId requested does not match token's user Id (ie. a user trying to get other user's todo list)
    if (userId != req.user._id) {
        res.json({success: false, msg: "Unauthorized"});
        return;
    }
    
    Todo.getAllTodosByUserId(userId, (err, todos) => {
        if (err) throw err;
        res.json({
            success: true,
            todos: todos
        });
    });
});

// POST
// http://localhost/api/todos
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { userId, title, description } = req.body;

    // if userId requested does not match token's user Id (ie. a user trying to get other user's todo list)
    if (userId != req.user._id) {
        res.json({success: false, msg: "Unauthorized"});
        return;
    }
    
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
    const tokenUser = req.user;

    Todo.getTodoByTodoId(todoId, (err, todo) => {
        if (err) throw err;
        if (!todo.owner.equals(tokenUser._id)) {
            res.json({success:false, msg: "Unauthorized"});
            return;
        }
        
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
});

// PUT
// http://localhost/api/todos
router.put('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { todoId, isDone } = req.body;
    const tokenUser = req.user;

    Todo.getTodoByTodoId(todoId, (err, todo) => {
        if (todo === undefined) {
            res.json({success: false, msg: "Todo with given ID not found"});
            return;
        }
        if (err) throw err;
        if (!todo.owner.equals(tokenUser._id)) {
            res.json({success:false, msg: "Unauthorized"});
            return;
        }

        Todo.updateTodo(todoId, isDone, (err, prev) => {
            if (err) throw err;
            res.json({success: true, prev: prev});
        })
    });
});

module.exports = router;