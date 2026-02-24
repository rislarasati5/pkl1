const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');
const authenticateToken = require('../middlewares/auth');

// GET bebas
router.get('/categories', categoryController.getAll);

// Sisanya wajib token
router.post('/categories', authenticateToken, categoryController.create);
router.put('/categories/:id', authenticateToken, categoryController.update);
router.delete('/categories/:id', authenticateToken, categoryController.remove);

module.exports = router;