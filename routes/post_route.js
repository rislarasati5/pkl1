const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller'); // Import controllernya
const multer = require('multer');

// Setup multer untuk memproses upload gambar ke memory (buffer)
const upload = multer({ storage: multer.memoryStorage() });

// Definisi route dan hubungkan ke fungsi di controller
router.get('/posts', postController.getAll);
router.get('/posts/:id', postController.getById);

// Tambahkan middleware 'upload.single' untuk route yang butuh upload gambar
router.post('/posts', upload.single('gambar'), postController.create);
router.put('/posts/:id', upload.single('gambar'), postController.update);

router.delete('/posts/:id', postController.remove);

// WAJIB: Ekspor router ini agar bisa dipakai di index.js
module.exports = router;