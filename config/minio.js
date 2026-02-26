const Minio = require('minio');

// Konfigurasi koneksi ke MinIO kamu
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin', // Ganti sesuai access key kamu
    secretKey: 'minioadmin'  // Ganti sesuai secret key kamu
});

const bucketName = 'pkl-image';

// Definisi Policy agar Bucket jadi Public (Read-Only)
const policy = {
    Version: "2012-10-17",
    Statement: [
        {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetBucketLocation", "s3:ListBucket"],
            Resource: [`arn:aws:s3:::${bucketName}`]
        },
        {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
    ]
};

// Jalankan perintah untuk mengubah policy
minioClient.setBucketPolicy(bucketName, JSON.stringify(policy), (err) => {
    if (err) {
        return console.log('Gagal mengubah policy:', err);
    }
    console.log(`Bucket "${bucketName}" sekarang sudah Public!`);
});