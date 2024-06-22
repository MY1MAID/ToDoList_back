const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    theme: {
        type: String,
        default: 'light',
    },
    priorityColors: {
        high: { type: String, default: '#ff0000' },
        medium: { type: String, default: '#ffa500' },
        low: { type: String, default: '#00ff00' },
    },
    sortOrder: {
        type: String,
        default: 'date',
    },
    filter: {
        type: String,
        default: 'all',
    },
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);
