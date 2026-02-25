require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoutes = require('./routes/category_route');
const swaggerDocument = require('./utils/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder images
const imageDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Static images
app.use('/images', express.static(imageDir));

// ===== ROUTES API =====
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', categoryRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/test', (req, res) => res.send('API Aktif!'));

app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📘 Swagger: http://localhost:${PORT}/api-docs`);
});