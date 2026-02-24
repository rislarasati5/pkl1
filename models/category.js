const pool = require('../config/db');

exports.getAll = () => {
    return pool.query('SELECT * FROM categories ORDER BY id DESC');
};

exports.create = (name) => {
    return pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING *',
        [name]
    );
};

exports.update = (id, name) => {
    return pool.query(
        'UPDATE categories SET name=$1 WHERE id=$2 RETURNING *',
        [name, id]
    );
};

exports.remove = (id) => {
    return pool.query('DELETE FROM categories WHERE id=$1', [id]);
};