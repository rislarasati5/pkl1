require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser'); // BARU: Untuk membaca refresh token dari cookie

const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoutes = require('./routes/category_route');
const swaggerDocument = require('./utils/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. KONFIGURASI CORS (Pintu Izin Frontend)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Tambahkan OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'] 
}));

// 2. MIDDLEWARE DASAR
app.use(cookieParser()); // BARU: Agar backend bisa baca cookie
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. PENGELOLAAN FOLDER IMAGES (Sesuai Storage Layer MinIO/Local)
const imageDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}
app.use('/images', express.static(imageDir));

// 4. ROUTES API (Backend Layer)
app.use('/api', userRoutes);     // Termasuk login & register
app.use('/api', postRoutes);
app.use('/api', categoryRoutes); // Metadata & Relations PostgreSQL

// 5. SWAGGER UI (Dokumentasi API)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 6. HEALTH CHECK
app.get('/test', (req, res) => res.send('🚀 API Aktif & CORS Terbuka!'));

// 7. JALANKAN SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📘 Swagger: http://localhost:${PORT}/api-docs`);
});