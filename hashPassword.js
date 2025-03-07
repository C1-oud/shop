const bcrypt = require('bcrypt');

// Пароль, который вы хотите захешировать
const password = 'admin123'; // Замените на тот пароль, который хотите захешировать

// Хешируем пароль с использованием 10 раундов
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Ошибка при хешировании пароля:', err);
    return;
  }
  console.log('Хешированный пароль:', hashedPassword);
});
