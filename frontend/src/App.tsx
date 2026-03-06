import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import CategoryPage from "./pages/CategoryPage";
import Dashboard from "./pages/Dashboard";
import PostUserPage from "./pages/PostUserPage";
import OrderAdminPage from "./pages/OrderAdminPage"; // TAMBAHKAN IMPORT INI
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
      {/* 1. Halaman Publik */}
      <Route path="/PostUserPage" element={<PostUserPage />} />

      {!token ? (
        /* 2. Jika BELUM LOGIN */
        <>
          <Route path="/" element={<AuthPage />} />
          {/* Redirect ke login jika mencoba akses path lain tanpa token */}
          <Route path="*" element={<NotFound />} />
        </>
      ) : (
        /* 3. Jika SUDAH LOGIN */
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/categories" element={<CategoryPage />} />
                
                {/* TAMBAHKAN ROUTE PESANAN DI SINI */}
                <Route path="/orders" element={<OrderAdminPage />} />
                
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