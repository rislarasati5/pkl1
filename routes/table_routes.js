const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table_controller');
const verifyToken = require('../middlewares/auth');

// GET bebas
router.get('/', tableController.getAllTables);
router.get('/available', tableController.getAvailableTables);

// yang dikunci
router.post('/', verifyToken, tableController.createTable);
router.put('/:id', verifyToken, tableController.updateTable);
router.delete('/:id', verifyToken, tableController.deleteTable);

module.exports = router;