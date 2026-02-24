const categorySwagger = {
  paths: {
    '/categories': {
      get: {
        tags: ['Category'],
        summary: 'Ambil semua category',
        security: [],
        responses: {
          200: { description: 'Berhasil ambil data category' }
        }
      },
      post: {
        tags: ['Category'],
        summary: 'Tambah category',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'category' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Category berhasil dibuat' }
        }
      }
    },
        '/categories/{id}': {
      put: {
        tags: ['Category'],
        summary: 'Update category',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Update' }
                },
                required: ['name']
              }
            }
          }
        },
        responses: {
          200: { description: 'Category berhasil diupdate' }
        }
      },
      delete: {
        tags: ['Category'],
        summary: 'Hapus category',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Category berhasil dihapus' }
        }
      }
    }
  }
};

module.exports = categorySwagger;