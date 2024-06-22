const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    text: { type: String, required: true },
    priority: { type: String, default: 'medium' },
    completed: { type: Boolean, default: false }
});

const TodoListSchema = new Schema({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    todos: [TodoSchema]
});

module.exports = mongoose.model('TodoList', TodoListSchema);
