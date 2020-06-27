const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

module.exports.getAllTodosByUserId = (userId, callback) => {
    Todo.find({owner:userId}).exec(callback);
}