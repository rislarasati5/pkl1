module.exports = {
  paths: {
    '/posts': {
      get: {
        tags: ['Post'],
        summary: 'Ambil semua post',
        security: [],
        responses: {
          200: {
            description: 'List semua post berhasil diambil'
          }
        }
      },

      post: {
        tags: ['Post'],
        summary: 'Tambah post baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  judul: { type: 'string', example: 'Judul Post' },
                  isi: { type: 'string', example: 'Isi konten post' },
                  category_id: { type: 'integer', example: 1 },
                  gambar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Upload gambar'
                  }
                },
                required: ['judul', 'isi', 'category_id', 'gambar']
              }
            }
          }
        },
        responses: {
          201: { description: 'Post berhasil dibuat' },
          400: { description: 'Validasi gagal' },
          401: { description: 'Unauthorized' }
        }
      }
    },

    '/posts/{id}': {
      get: {
        tags: ['Post'],
        summary: 'Ambil detail post berdasarkan ID',
        security: [],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          200: { description: 'Detail post berhasil diambil' },
          404: { description: 'Post tidak ditemukan' }
        }
      },

      put: {
        tags: ['Post'],
        summary: 'Update post berdasarkan ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  judul: { type: 'string', example: 'Judul Update' },
                  isi: { type: 'string', example: 'Konten update' },
                  category_id: { type: 'integer', example: 1 },
                  gambar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Upload gambar baru (opsional)'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Post berhasil diupdate' },
          400: { description: 'Validasi gagal' },
          401: { description: 'Unauthorized' },
          404: { description: 'Post tidak ditemukan' }
        }
      },

      delete: {
        tags: ['Post'],
        summary: 'Hapus post berdasarkan ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          200: { description: 'Post berhasil dihapus' },
          401: { description: 'Unauthorized' },
          404: { description: 'Post tidak ditemukan' }
        }
      }
    }
  }
};