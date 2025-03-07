const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket, VerificationCode } = require('../models/models');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const generateJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' });
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Configuration Error: ", error);
    } else {
        console.log("SMTP connection successful!");
    }
});

class UserController {
    async registration(req, res, next) {
        console.log("Начало регистрации пользователя");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("Ошибки валидации:", errors.array());
            return next(ApiError.badRequest(errors.array().map(error => error.msg).join(', ')));
        }
    
        const { email, password, role } = req.body;
        console.log("Поиск пользователя в базе данных");
        const candidate = await User.findOne({ where: { email } });
    
        if (candidate) {
            if (candidate.isVerified) {
                console.error("Пользователь уже существует и подтвержден:", email);
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            } else {
                console.log("Пользователь уже существует, но не подтвержден:", email);
                return res.json({ message: 'Код подтверждения уже отправлен. Проверьте почту.' });
            }
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Сгенерирован код подтверждения:", verificationCode);
    
        try {
            console.log("Попытка отправки письма с кодом подтверждения на:", email);
            await transporter.sendMail({
                from: `\"ТД Спарки\" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Подтверждение регистрации',
                text: `Ваш код подтверждения: ${verificationCode}`,
                html: `<p>Ваш код подтверждения: <strong>${verificationCode}</strong></p>`,
            });
            console.log("Письмо успешно отправлено");
    
            console.log("Сохранение кода подтверждения в базе данных");
            await VerificationCode.create({ email, code: verificationCode });
            console.log("Код подтверждения успешно сохранен в таблице VerificationCode");
    
            return res.json({ message: 'Код подтверждения отправлен на email' });
    
        } catch (error) {
            console.error("Ошибка в процессе регистрации:", error);
            return next(ApiError.internal('Ошибка при отправке кода подтверждения'));
        }
    }
    
    
    

    async verifyEmail(req, res, next) {
        console.log("Начало подтверждения email");
        const { email, code } = req.body;
    

        const verificationRecord = await VerificationCode.findOne({ where: { email, code } });
    
        if (!verificationRecord) {
            console.error("Неверный код подтверждения для пользователя:", email);
            return next(ApiError.badRequest('Неверный код подтверждения'));
        }
    

        const user = await User.findOne({ where: { email } });
    
        if (!user) {
            console.error("Пользователь не найден:", email);
            return next(ApiError.badRequest('Пользователь не найден'));
        }
    
        if (user.isVerified) {
            console.error("Email уже подтвержден:", email);
            return next(ApiError.badRequest('Email уже подтвержден'));
        }
    

        user.isVerified = true;
        await user.save();
        console.log("Email успешно подтвержден");
    

        await verificationRecord.destroy();
        console.log("Код подтверждения удален");

        console.log("Создание корзины для пользователя:", user.id);
        await Basket.create({ userId: user.id });
        console.log("Корзина успешно создана");
    
        return res.json({ message: 'Email подтвержден. Теперь вы можете войти.' });
    }
    
    
    
    
    async login(req, res, next) {
        console.log("Начало процесса входа");
        const { email, password } = req.body;
        console.log("Поиск пользователя в базе данных:", email);
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.error("Пользователь не найден:", email);
            return next(ApiError.badRequest('Пользователь не найден'));
        }

        console.log("Проверка пароля");
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            console.error("Неверный пароль для пользователя:", email);
            return next(ApiError.badRequest('Неверный пароль'));
        }

        console.log("Генерация JWT токена для пользователя:", email);
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({ token });
    }
}

module.exports = new UserController();