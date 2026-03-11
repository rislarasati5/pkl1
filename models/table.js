const pool = require('../config/db');

const getAllTables = async () => {
  const query = `
    SELECT * FROM tables
    ORDER BY nomor_meja ASC
  `;
  return pool.query(query);
};

const getAvailableTables = async () => {
  const query = `
    SELECT * FROM tables
    WHERE status = 'kosong'
    ORDER BY nomor_meja ASC
  `;
  return pool.query(query);
};

const createTable = async (nomor_meja) => {
  const query = `
    INSERT INTO tables (nomor_meja, status)
    VALUES ($1, 'kosong')
    RETURNING *
  `;
  return pool.query(query, [nomor_meja]);
};

const updateTable = async (id, status) => {
  const query = `
    UPDATE tables
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;
  return pool.query(query, [status, id]);
};

const deleteTable = async (id) => {
  const query = `
    DELETE FROM tables
    WHERE id = $1
  `;
  return pool.query(query, [id]);
};

const updateTableStatus = async (nomor_meja, status) => {
  const query = `
    UPDATE tables
    SET status = $1
    WHERE nomor_meja = $2
  `;
  return pool.query(query, [status, nomor_meja]);
};

module.exports = {
  getAllTables,
  getAvailableTables,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus
};