const Post = require('../models/post');
const response = require('../utils/response');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const minioClient = require('../config/minio');

const BUCKET = "pkl-image";

// ==================
// Upload ke MinIO
// ==================
const uploadToMinio = async (file) => {
    const fileName = `${uuidv4()}.webp`;

    const buffer = await sharp(file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

    await minioClient.putObject(
        BUCKET,
        fileName,
        buffer,
        buffer.length,
        { 'Content-Type': 'image/jpeg' }
    );

    return `http://localhost:9000/${BUCKET}/${fileName}`;
};

// ==================
// GET ALL
// ==================
exports.getAll = async (req, res) => {
    try {
        const data = await Post.getAll();
        response.success(res, data.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================
// GET BY ID
// ==================
exports.getById = async (req, res) => {
    try {
        const data = await Post.getById(req.params.id);
        if (data.rows.length === 0)
            return res.status(404).json({ message: 'Post tidak ditemukan' });

        response.success(res, data.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================
// CREATE
// ==================
exports.create = async (req, res) => {
    try {
        const { judul, isi, category_id } = req.body;

        if (!judul || !isi || !category_id || !req.file) {
            return res.status(400).json({
                message: 'Judul, isi, category, dan gambar wajib diisi'
            });
        }

        const gambarUrl = await uploadToMinio(req.file);

        const data = await Post.create(judul, isi, gambarUrl, category_id);

        response.success(res, data.rows[0], 'Post berhasil dibuat');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================
// UPDATE
// ==================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi, category_id } = req.body;

        if (!judul || !isi || !category_id) {
            return res.status(400).json({
                message: 'Judul, isi, dan category wajib diisi'
            });
        }

        let gambarUrl = null;

        if (req.file) {
            gambarUrl = await uploadToMinio(req.file);
        }

        const data = await Post.update(id, judul, isi, gambarUrl, category_id);

        response.success(res, data.rows[0], 'Post berhasil diupdate');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================
// DELETE
// ==================
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        await Post.remove(id);

        response.success(res, null, 'Post berhasil dihapus');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};