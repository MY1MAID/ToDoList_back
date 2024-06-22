
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db')

dotenv.config();

const app = express();

// Подключение к базе данных
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const todoRoutes = require('./routes/todos');  // Изменено на правильный путь
const auth = require('./middleware/auth');

app.use('/api/auth', authRoutes);
app.use('/api/settings', auth, settingsRoutes);
app.use('/api/todos', auth, todoRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
