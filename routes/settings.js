// routes/settings.js
const express = require('express');
const UserSettings = require('../models/UserSettings');
const router = express.Router();

// Получить настройки пользователя
router.get('/', async (req, res) => {
    try {
        const settings = await UserSettings.findOne({ userId: req.user.id });
        res.json(settings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Сохранить или обновить настройки пользователя
router.post('/', async (req, res) => {
    const { theme, priorityColors, sortOrder, filter } = req.body;

    try {
        let settings = await UserSettings.findOne({ userId: req.user.id });

        if (settings) {
            // Обновить настройки
            settings = await UserSettings.findOneAndUpdate(
                { userId: req.user.id },
                { theme, priorityColors, sortOrder, filter },
                { new: true }
            );
        } else {
            // Создать новые настройки
            settings = new UserSettings({
                userId: req.user.id,
                theme,
                priorityColors,
                sortOrder,
                filter
            });
            await settings.save();
        }

        res.json(settings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
