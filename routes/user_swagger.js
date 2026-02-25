module.exports = {
  paths: {
    '/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Registrasi user baru',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'user@gmail.com'
                  },
                  password: {
                    type: 'string',
                    example: 'password'
                  }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User berhasil diregistrasi'
          }
        }
      }
    },

    '/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'user@gmail.com'
                  },
                  password: {
                    type: 'string',
                    example: 'password'
                  }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login berhasil'
          }
        }
      }
    },

    '/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    example: 'refresh_token_jwt'
                  }
                },
                required: ['token']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Token berhasil diperbarui'
          }
        }
      }
    }
  }
};