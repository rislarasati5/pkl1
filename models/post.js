const pool = require('../config/db');

// GET semua post + nama category
exports.getAll = () => {
    return pool.query(`
        SELECT 
            posts.*, 
            categories.name AS category_name
        FROM posts
        LEFT JOIN categories 
            ON posts.category_id = categories.id
        ORDER BY posts.id DESC
    `);
};

// GET post by id + category
exports.getById = (id) => {
    return pool.query(`
        SELECT 
            posts.*, 
            categories.name AS category_name
        FROM posts
        LEFT JOIN categories 
            ON posts.category_id = categories.id
        WHERE posts.id = $1
    `, [id]);
};

// CREATE post (wajib ada category)
exports.create = (judul, isi, gambar, category_id) => {
    return pool.query(
        `INSERT INTO posts (judul, isi, gambar, category_id) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [judul, isi, gambar, category_id]
    );
};

// UPDATE post (gambar opsional)
exports.update = (id, judul, isi, gambar, category_id) => {
    if (gambar) {
        return pool.query(
            `UPDATE posts 
             SET judul=$1, isi=$2, gambar=$3, category_id=$4 
             WHERE id=$5 
             RETURNING *`,
            [judul, isi, gambar, category_id, id]
        );
    }

    return pool.query(
        `UPDATE posts 
         SET judul=$1, isi=$2, category_id=$3 
         WHERE id=$4 
         RETURNING *`,
        [judul, isi, category_id, id]
    );
};

// DELETE post
exports.remove = (id) => {
    return pool.query('DELETE FROM posts WHERE id=$1', [id]);
};