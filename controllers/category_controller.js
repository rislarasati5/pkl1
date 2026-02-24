const Category = require('../models/category');
const Joi = require('joi');

// Schema langsung di controller
const categorySchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.base': 'Name harus berupa string',
        'string.empty': 'Name tidak boleh kosong',
        'string.min': 'Name minimal 3 karakter',
        'any.required': 'Name wajib diisi'
    })
});

// GET ALL
exports.getAll = async (req, res) => {
    try {
        const result = await Category.getAll();
        res.json({
            message: 'List category',
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
exports.create = async (req, res) => {
    try {
        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const result = await Category.create(req.body.name);
        res.status(201).json({
            message: 'Category berhasil dibuat',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const result = await Category.update(req.params.id, req.body.name);
        res.json({
            message: 'Category berhasil diupdate',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE
exports.remove = async (req, res) => {
    try {
        await Category.remove(req.params.id);
        res.json({ message: 'Category berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};