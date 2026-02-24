const Joi = require('joi');

const categorySchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.base': 'Name harus berupa string',
        'string.empty': 'Name tidak boleh kosong',
        'string.min': 'Name minimal 3 karakter',
        'any.required': 'Name wajib diisi'
    })
});

module.exports = { categorySchema };