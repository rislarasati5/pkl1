import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// Sisipkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tangani jika token bermasalah
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika server bilang 401 atau 403 (token basi/tidak valid)
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('accessToken'); // Hapus token rusak
      window.dispatchEvent(new Event("auth-change")); // Lempar ke halaman Login
      
      // Beri notifikasi simpel
      if (!window.location.pathname.includes('auth')) {
         alert("Sesi Anda berakhir, silakan login kembali.");
      }
    }
    return Promise.reject(error);
  }
);