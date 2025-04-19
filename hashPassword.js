const bcrypt = require('bcrypt');


const password = 'admin123'; 

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Ошибка при хешировании пароля:', err);
    return;
  }
  console.log('Хешированный пароль:', hashedPassword);
});
