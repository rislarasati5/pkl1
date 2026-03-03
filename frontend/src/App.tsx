import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import AuthPage from "./pages/AuthPage";
import CategoryPage from "./pages/CategoryPage";
import Dashboard from "./pages/Dashboard"; // Import file Dashboard asli
import PostUserPage from "./pages/PostUserPage";
import MainLayout from "./components/MainLayout";

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

  if (!token) return <AuthPage />;

  return (
    <MainLayout>
      <Routes>
        {/* Halaman utama langsung ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/PostUserPage" element={<PostUserPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;