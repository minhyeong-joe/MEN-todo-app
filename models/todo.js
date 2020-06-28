const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isDone: {
        type: Boolean,
        required: true
    }
});

const Todo = module.exports = mongoose.model('Todo', TodoSchema);

// get user's todos
module.exports.getAllTodosByUserId = (userId, callback) => {
    Todo.find({owner:userId}).exec(callback);
}

// add a todo
module.exports.addTodo = (newTodo, callback) => {
    newTodo.save(callback);
}

// delete a todo
module.exports.deleteTodo = (todoId, callback) => {
    Todo.deleteOne({_id: todoId}, callback);
}