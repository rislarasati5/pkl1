const Post = require('../models/post');
const response = require('../utils/response');
const fs = require('fs');
const path = require('path');

// GET ALL POSTS
exports.getAll = async (req, res) => {
    try {
        const data = await Post.getAll();
        response.success(res, data.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET POST BY ID
exports.getById = async (req, res) => {
    try {
        const data = await Post.getById(req.params.id);
        response.success(res, data.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE POST (WAJIB semua field)
exports.create = async (req, res) => {
    try {
        const { judul, isi, category_id } = req.body;
        const gambar = req.file ? req.file.filename : null;

    //m
        if (!judul || !isi || !category_id || !gambar) {
            return res.status(400).json({
                message: 'Judul, isi, category, dan gambar wajib diisi'
            });
        }

        const data = await Post.create(judul, isi, gambar, category_id);
        response.success(res, data.rows[0], 'Post berhasil dibuat');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE POST
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi, category_id } = req.body;
        const gambar = req.file ? req.file.filename : null;

        if (!judul || !isi || !category_id) {
            return res.status(400).json({
                message: 'Judul, isi, dan category wajib diisi'
            });
        }

        const data = await Post.update(id, judul, isi, gambar, category_id);
        response.success(res, data.rows[0], 'Post berhasil diupdate');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE POST + HAPUS FILE GAMBAR
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.getById(id);

        if (post.rows[0]?.gambar) {
            const filePath = path.join(__dirname, '../public/images', post.rows[0].gambar);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Post.remove(id);
        response.success(res, null, 'Post berhasil dihapus');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};