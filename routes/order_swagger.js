module.exports = {
  paths: {

    '/orders': {

      post: {
        tags: ['Orders'],
        summary: 'Kirim pesanan baru (Self-Ordering)',
        security: [],
        description: 'Endpoint untuk user memesan satu atau lebih menu dengan kuantitas berbeda.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nama_pemesan: { type: 'string', example: 'Mahasiswa Polinela' },
                  nomor_meja: { type: 'integer', example: 5 },
                  total_harga: { type: 'integer', example: 55000 },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 23 },
                        judul: { type: 'string', example: 'rendang' },
                        isi: { type: 'string', example: 'Rp.20.000' },
                        qty: { type: 'integer', example: 2 }
                      }
                    }
                  }
                },
                required: ['nama_pemesan', 'nomor_meja', 'total_harga', 'items']
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Pesanan berhasil diproses',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Pesanan berhasil diproses' },
                    orderId: { type: 'integer', example: 1 }
                  }
                }
              }
            }
          },
          500: { description: 'Internal Server Error' }
        }
      },

      get: {
        tags: ['Orders'],
        summary: 'Dapatkan semua daftar pesanan (Admin)',
        security: [],
        description: 'Menampilkan riwayat pesanan beserta rincian item.',
        responses: {
          200: {
            description: 'Daftar pesanan berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      nama_pemesan: { type: 'string' },
                      nomor_meja: { type: 'integer' },
                      total_harga: { type: 'integer' },
                      status: { type: 'string', example: 'pending' },
                      created_at: { type: 'string', format: 'date-time' },
                      items: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            judul: { type: 'string' },
                            qty: { type: 'integer' },
                            subtotal: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          500: { description: 'Internal Server Error' }
        }
      }

    },

    '/orders/{id}': {

      put: {
        tags: ['Orders'],
        summary: 'Update status pesanan',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'ID pesanan'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'selesai'
                  }
                },
                required: ['status']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Status berhasil diubah'
          },
          404: { description: 'Pesanan tidak ditemukan' },
          500: { description: 'Internal Server Error' }
        }
      },

      delete: {
        tags: ['Orders'],
        summary: 'Hapus pesanan',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Pesanan berhasil dihapus'
          },
          404: { description: 'Pesanan tidak ditemukan' },
          500: { description: 'Internal Server Error' }
        }
      }

    },

    '/payment/create-payment': {

      post: {
        tags: ['Payment'],
        summary: 'Buat transaksi pembayaran Midtrans',
        description: 'Membuat transaksi pembayaran dan mendapatkan Snap Token dari Midtrans.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nama_pemesan: { type: 'string', example: 'Mahasiswa Polinela' },
                  nomor_meja: { type: 'integer', example: 3 },
                  total_harga: { type: 'integer', example: 40000 }
                },
                required: ['nama_pemesan', 'nomor_meja', 'total_harga']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Berhasil membuat transaksi Midtrans',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string', example: 'snap-token-midtrans' },
                    order_id: { type: 'string', example: 'ORDER-123456' }
                  }
                }
              }
            }
          },
          500: { description: 'Gagal membuat transaksi' }
        }
      }

    },

    '/payment/midtrans-notification': {

      post: {
        tags: ['Payment'],
        summary: 'Webhook notifikasi Midtrans',
        description: 'Dipanggil otomatis oleh Midtrans ketika status pembayaran berubah.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  order_id: { type: 'string', example: 'ORDER-123456' },
                  transaction_status: { type: 'string', example: 'settlement' },
                  payment_type: { type: 'string', example: 'qris' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Notifikasi berhasil diproses'
          }
        }
      }

    }

  }
};