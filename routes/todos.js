const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const TodoList = require('../models/TodoList');
const router = express.Router();

// Добавление нового списка задач
router.post(
    '/',
    [auth, [check('name', 'Name is required').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;

        try {
            const newTodoList = new TodoList({
                name,
                user: req.user.id,
            });

            const todoList = await newTodoList.save();
            res.json(todoList);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    }
);

// Получение всех списков задач пользователя
router.get('/', auth, async (req, res) => {
    try {
        const todoLists = await TodoList.find({ user: req.user.id });
        res.json(todoLists);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Добавление новой задачи в список
router.post('/:id', auth, async (req, res) => {
    const { text, priority } = req.body;

    try {
        const todoList = await TodoList.findById(req.params.id);

        if (!todoList) {
            return res.status(404).json({ message: 'Todo list not found' });
        }

        const newTodo = {
            text,
            priority,
            completed: false
        };

        todoList.todos.push(newTodo);
        await todoList.save();

        res.json(todoList);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Удаление задачи из списка
router.delete('/:listId/:todoId', auth, async (req, res) => {
    try {
        const todoList = await TodoList.findById(req.params.listId);

        if (!todoList) {
            return res.status(404).json({ message: 'Todo list not found' });
        }

        todoList.todos = todoList.todos.filter(todo => todo._id.toString() !== req.params.todoId);
        await todoList.save();

        res.json(todoList);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Обновление задачи в списке
router.put('/:listId/:todoId', auth, async (req, res) => {

    const { text, priority } = req.body;
    try {
        const todoList = await TodoList.findById(req.params.listId);

        if (!todoList) {
            return res.status(404).json({ message: 'Todo list not found' });
        }


        const todo = todoList.todos.id(req.params.todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo item not found' });
        }


        if (text !== undefined) {
            todo.text = text;
        }
        if (priority !== undefined) {
            todo.priority = priority;
        }
        await todoList.save();

        res.json(todoList);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
