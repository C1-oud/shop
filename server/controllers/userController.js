const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket, VerificationCode } = require('../models/models');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Проверка необходимых переменных окружения
const requiredEnvVars = ['SECRET_KEY', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Ошибка: Переменная окружения ${envVar} не установлена`);
        process.exit(1);
    }
}

const generateJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Проверяем подключение к SMTP при запуске
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Configuration Error: ", error);
        process.exit(1);
    } else {
        console.log("SMTP connection successful!");
    }
});

class UserController {
    async registration(req, res, next) {
        try {
        console.log("Начало регистрации пользователя");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("Ошибки валидации:", errors.array());
            return next(ApiError.badRequest(errors.array().map(error => error.msg).join(', ')));
        }
    
            const { email, password, role = 'USER' } = req.body;
        console.log("Поиск пользователя в базе данных");
        const candidate = await User.findOne({ where: { email } });
    
        if (candidate) {
            if (candidate.isVerified) {
                console.error("Пользователь уже существует и подтвержден:", email);
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            } else {
                console.log("Пользователь уже существует, но не подтвержден:", email);
                    // Генерируем новый код для существующего пользователя
                    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                    await VerificationCode.create({ email, code: verificationCode });
                    
                    try {
                        await transporter.sendMail({
                            from: `\"ТД Спарки\" <${process.env.SMTP_USER}>`,
                            to: email,
                            subject: 'Подтверждение регистрации',
                            text: `Ваш код подтверждения: ${verificationCode}`,
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <h2 style="color: #333;">Подтверждение регистрации</h2>
                                    <p>Здравствуйте!</p>
                                    <p>Ваш код подтверждения: <strong style="font-size: 24px; color:rgb(53, 82, 110);">${verificationCode}</strong></p>
                                </div>
                            `,
                        });
                        console.log("Новый код подтверждения отправлен на:", email);
                        return res.json({ message: 'Новый код подтверждения отправлен на email' });
                    } catch (error) {
                        console.error("Ошибка при отправке нового кода:", error);
                        return next(ApiError.internal('Ошибка при отправке кода подтверждения'));
                    }
            }
        }

        const hashPassword = await bcrypt.hash(password, 5);
        
        const user = await User.create({ email, password: hashPassword, role, isVerified: false });
        console.log("Пользователь успешно создан:", email);
    
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Сгенерирован код подтверждения:", verificationCode);
    
        try {
            console.log("Попытка отправки письма с кодом подтверждения на:", email);
            await transporter.sendMail({
                from: `\"ТД Спарки\" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Подтверждение регистрации',
                text: `Ваш код подтверждения: ${verificationCode}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">Подтверждение регистрации</h2>
                            <p>Здравствуйте!</p>
                            <p>Ваш код подтверждения: <strong style="font-size: 24px; color:rgb(53, 82, 110);">${verificationCode}</strong></p>
                        </div>
                    `,
            });
            console.log("Письмо успешно отправлено");
    
            console.log("Сохранение кода подтверждения в базе данных");
            await VerificationCode.create({ email, code: verificationCode });
            console.log("Код подтверждения успешно сохранен в таблице VerificationCode");
    
                // Генерируем временный токен для неподтвержденного пользователя
                const token = generateJwt(user.id, user.email, user.role);
        
                return res.json({ 
                    message: 'Код подтверждения отправлен на email',
                    token: token
                });
    
        } catch (error) {
            console.error("Ошибка в процессе регистрации:", error);
                // Удаляем пользователя, если не удалось отправить код
                await user.destroy();
            return next(ApiError.internal('Ошибка при отправке кода подтверждения'));
            }
        } catch (e) {
            console.error("Необработанная ошибка в registration:", e);
            return next(ApiError.internal('Необработанная ошибка в процессе регистрации'));
        }
    }

    async verifyEmail(req, res, next) {
        try {
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
    
            // Генерируем новый токен для подтвержденного пользователя
            const token = generateJwt(user.id, user.email, user.role);
        
            return res.json({ 
                message: 'Email подтвержден. Теперь вы можете войти.',
                token: token
            });
        } catch (error) {
            console.error("Ошибка при подтверждении email:", error);
            return next(ApiError.internal('Произошла ошибка при подтверждении email'));
        }
    }

    async login(req, res, next) {
        try {
        console.log("Начало процесса входа");
        const { email, password } = req.body;
        console.log("Поиск пользователя в базе данных:", email);
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.error("Пользователь не найден:", email);
            return next(ApiError.badRequest('Пользователь не найден'));
        }

            if (!user.isVerified) {
                console.error("Email не подтвержден:", email);
                return next(ApiError.badRequest('Пожалуйста, подтвердите email перед входом'));
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
        } catch (error) {
            console.error("Ошибка при входе:", error);
            return next(ApiError.internal('Произошла ошибка при входе'));
        }
    }

    async check(req, res, next) {
        try {
            console.log("Проверка авторизации пользователя");
            const user = await User.findOne({ where: { id: req.user.id } });
            
            if (!user) {
                console.error("Пользователь не найден при проверке авторизации");
                return next(ApiError.unauthorized('Пользователь не найден'));
            }

            if (!user.isVerified) {
                console.error("Email пользователя не подтвержден");
                return next(ApiError.unauthorized('Email не подтвержден'));
            }

            console.log("Авторизация успешно проверена для пользователя:", user.email);
            return res.json({ 
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            });
        } catch (error) {
            console.error("Ошибка при проверке авторизации:", error);
            return next(ApiError.internal('Ошибка при проверке авторизации'));
        }
    }
}

module.exports = new UserController();
