require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/user_route');
const swaggerDocument = require('./utils/swagger');
const postRoutes = require('./routes/post_route');

const app = express();
const PORT = 3000;

app.use(express.json());

// Pastikan folder public/images ada
const imageDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Serve folder images agar bisa diakses via browser
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/', userRoutes);
app.use('/', postRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📘 Swagger: http://localhost:${PORT}/api-docs`);
});