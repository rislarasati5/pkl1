const pool = require('../config/db');

// ========================
// GET ALL + SEARCH + PAGINATION
// ========================
const getAll = (limit, offset, search) => {
  return pool.query(
    `SELECT 
        posts.*, 
        categories.name AS category_name
     FROM posts
     LEFT JOIN categories 
        ON posts.category_id = categories.id
     WHERE posts.judul ILIKE $1
     ORDER BY posts.id DESC
     LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset]
  );
};

// ========================
// COUNT DATA
// ========================
const countAll = (search) => {
  return pool.query(
    `SELECT COUNT(*) 
     FROM posts
     WHERE judul ILIKE $1`,
    [`%${search}%`]
  );
};

// ========================
// GET BY ID
// ========================
const getById = (id) => {
  return pool.query(
    `SELECT posts.*, categories.name AS category_name
     FROM posts
     LEFT JOIN categories ON posts.category_id = categories.id
     WHERE posts.id = $1`,
    [id]
  );
};

// ========================
// CREATE
// ========================
const create = (judul, isi, gambar, category_id) => {
  return pool.query(
    `INSERT INTO posts (judul, isi, gambar, category_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [judul, isi, gambar, category_id]
  );
};

// ========================
// UPDATE
// ========================
const update = (id, judul, isi, gambar, category_id) => {
  return pool.query(
    `UPDATE posts
     SET judul=$1, isi=$2, gambar=$3, category_id=$4
     WHERE id=$5
     RETURNING *`,
    [judul, isi, gambar, category_id, id]
  );
};

// ========================
// DELETE
// ========================
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