const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Получаем токен из заголовка
    const token = req.header('Authorization').replace('Bearer ', '');

    // Если токена нет, возвращаем ошибку
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Декодируем токен и извлекаем пользователя
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 15327);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
