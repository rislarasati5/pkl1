module.exports = {
  paths: {

    "/tables": {

      get: {
        tags: ["Table"],
        summary: "Ambil semua data meja",
        description: "Endpoint untuk mendapatkan seluruh data meja di restoran",
        security: [],
        responses: {
          200: {
            description: "Berhasil mengambil data meja",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "integer",
                            example: 1
                          },
                          nomor_meja: {
                            type: "integer",
                            example: 5
                          },
                          status: {
                            type: "string",
                            example: "kosong"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },

      post: {
        tags: ["Table"],
        summary: "Tambah meja baru",
        description: "Endpoint untuk menambahkan nomor meja baru",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nomor_meja"],
                properties: {
                  nomor_meja: {
                    type: "integer",
                    example: 5
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Meja berhasil ditambahkan"
          },
          401: {
            description: "Unauthorized - Token tidak ada"
          },
          500: {
            description: "Internal Server Error"
          }
        }
      }

    },

    "/tables/available": {

      get: {
        tags: ["Table"],
        summary: "Ambil meja yang kosong",
        description: "Endpoint untuk mengambil daftar meja yang statusnya kosong",
        security: [],
        responses: {
          200: {
            description: "Berhasil mengambil meja kosong"
          }
        }
      }

    },

    "/tables/{id}": {

      put: {
        tags: ["Table"],
        summary: "Update status meja",
        description: "Mengubah status meja menjadi kosong atau terisi",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            },
            example: 1
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "terisi"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Status meja berhasil diupdate"
          },
          401: {
            description: "Unauthorized"
          }
        }
      },

      delete: {
        tags: ["Table"],
        summary: "Hapus meja",
        description: "Endpoint untuk menghapus meja berdasarkan id meja",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            },
            example: 1
          }
        ],
        responses: {
          200: {
            description: "Meja berhasil dihapus"
          },
          404: {
            description: "Meja tidak ditemukan"
          }
        }
      }

    }

  }
};