module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'API PKL Backend',
    version: '1.0.0'
  },

  servers: [
    { url: 'http://localhost:3000/api' }
  ],

  tags: [
    { name: 'Authentication', description: 'Login & Register User' },
    { name: 'Category', description: 'Manajemen Category' },
    { name: 'Post', description: 'Manajemen Post' }
  ],

  // 🔒 INI WAJIB BIAR AUTHORIZE MUNCUL
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },

  // 🔒 GLOBAL AUTH (semua endpoint pakai token kecuali dikosongkan di swagger per endpoint)
  security: [
    {
      bearerAuth: []
    }
  ],

  paths: {
    ...require('../routes/user_swagger').paths,
    ...require('../routes/category_swagger').paths,
    ...require('../routes/post_swagger').paths
  }
};