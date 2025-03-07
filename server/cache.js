const { Pool } = require('pg');


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


const getCache = async (key) => {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT value FROM cache WHERE key = $1', [key]);
        return res.rows.length > 0 ? res.rows[0].value : null; 
    } catch (err) {
        console.error('Ошибка при получении кеша:', err);
    } finally {
        client.release();
    }
};


const setCache = async (key, value) => {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO cache (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', [key, value]);
    } catch (err) {
        console.error('Ошибка при сохранении кеша:', err);
    } finally {
        client.release();
    }
};


module.exports = {
    getCache,
    setCache,
};
