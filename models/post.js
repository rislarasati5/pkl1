const pool = require('../config/db');

// GET semua post dengan pagination
const getAll = (limit, offset) => {
  return pool.query(
    `SELECT posts.*, categories.name AS category_name
     FROM posts
     LEFT JOIN categories ON posts.category_id = categories.id
     ORDER BY posts.id DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
};

// hitung total data post
const countAll = () => {
  return pool.query(`SELECT COUNT(*) FROM posts`);
};

// GET post by ID
const getById = (id) => {
  return pool.query(
    `SELECT posts.*, categories.name AS category_name
     FROM posts
     LEFT JOIN categories ON posts.category_id = categories.id
     WHERE posts.id = $1`,
    [id]
  );
};

// CREATE post
const create = (judul, isi, gambar, category_id) => {
  return pool.query(
    `INSERT INTO posts (judul, isi, gambar, category_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [judul, isi, gambar, category_id]
  );
};

// UPDATE post
const update = (id, judul, isi, gambar, category_id) => {
  return pool.query(
    `UPDATE posts
     SET judul=$1, isi=$2, gambar=$3, category_id=$4
     WHERE id=$5
     RETURNING *`,
    [judul, isi, gambar, category_id, id]
  );
};

// DELETE post
const remove = (id) => {
  return pool.query(
    `DELETE FROM posts WHERE id=$1`,
    [id]
  );
};

module.exports = {
  getAll,
  countAll,
  getById,
  create,
  update,
  remove
};