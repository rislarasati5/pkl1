module.exports = {
    paths: {
        '/posts': {
    get: {
        tags: ['Posts'],
        summary: 'Ambil semua post',
        responses: {
            200: {
                description: 'Berhasil ambil data posts'
            }
        }
    },
           post: {
    tags: ['Posts'],
    summary: 'Tambah post',
    requestBody: {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    required: ['judul', 'isi', 'gambar'],
                    properties: {
                        judul: { type: 'string', example: 'Judul Post' },
                        isi: { type: 'string', example: 'Isi konten post' },
                        gambar: { type: 'string', format: 'binary' }
                    }
                }
            }
        }
    },
    responses: {
        201: { description: 'Post dibuat' },
        400: { description: 'Validasi gagal' }
        }
    }
},

        '/posts/{id}': {
    put: {
        tags: ['Posts'],
        summary: 'Update post',
        parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
            required: true,
            content: {
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        properties: {
                            judul: { type: 'string' },
                            isi: { type: 'string' },
                            gambar: { type: 'string', format: 'binary' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Post diupdate' }
        }
    },
            delete: {
                tags: ['Posts'],
                summary: 'Hapus post',
                parameters: [{ name: 'id', in: 'path', required: true }],
                responses: { 200: { description: 'Post dihapus' } }
            }
        }
    }
};