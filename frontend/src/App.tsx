import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import CategoryPage from "./pages/CategoryPage";
import Dashboard from "./pages/Dashboard";
import PostUserPage from "./pages/PostUserPage";
import OrderAdminPage from "./pages/OrderAdminPage"; 
import OrderHistory from "./pages/OrderHistory"; // IMPORT HALAMAN BARU
import TablePage from "./pages/TablePage";
import MainLayout from "./components/MainLayout";
import NotFound from "./pages/NotFound";

function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    const checkToken = () => setToken(localStorage.getItem("accessToken"));
    window.addEventListener("auth-change", checkToken);
    window.addEventListener("storage", checkToken);
    return () => {
      window.removeEventListener("auth-change", checkToken);
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  return (
    <Routes>
      {/* 1. Halaman Publik (Tanpa Login) */}
      <Route path="/PostUserPage" element={<PostUserPage />} />

      {!token ? (
        /* 2. Jika BELUM LOGIN */
        <>
          <Route path="/" element={<AuthPage />} />
          {/* Redirect ke login jika mencoba akses path lain tanpa token */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        /* 3. Jika SUDAH LOGIN */
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                {/* Arahkan root login ke dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/tablepage" element={<TablePage />} />
                
                {/* ROUTE PESANAN AKTIF */}
                <Route path="/orders" element={<OrderAdminPage />} />
                
                {/* ROUTE RIWAYAT PESANAN (BARU) */}
                <Route path="/order-history" element={<OrderHistory />} />

                {/* Fallback kalau route dalam layout tidak ditemukan */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          }
        />
      )}
    </Routes>
  );
}

export default App;