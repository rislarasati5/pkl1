const Table = require('../models/table');

// GET semua meja
exports.getAllTables = async (req, res) => {
  try {

    const result = await Table.getAllTables();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// GET meja kosong
exports.getAvailableTables = async (req, res) => {
  try {

    const result = await Table.getAvailableTables();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// CREATE meja
exports.createTable = async (req, res) => {
  try {

    const { nomor_meja } = req.body;

    const result = await Table.createTable(nomor_meja);

    res.status(201).json({
      success: true,
      message: "Meja berhasil dibuat",
      data: result.rows[0]
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// UPDATE status meja
exports.updateTable = async (req, res) => {
  try {

    const { status } = req.body;

    const result = await Table.updateTable(req.params.id, status);

    res.json({
      success: true,
      message: "Status meja berhasil diupdate",
      data: result.rows[0]
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// DELETE meja
exports.deleteTable = async (req, res) => {
  try {

    await Table.deleteTable(req.params.id);

    res.json({
      success: true,
      message: "Meja berhasil dihapus"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};