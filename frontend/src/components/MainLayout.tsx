import { useNavigate, useLocation } from "react-router-dom"; // Tambah useLocation
import { Button } from "./ui/button";
import { LogOut, LayoutDashboard, ListTree } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation(); // Ambil info lokasi URL saat ini

  // Tentukan path mana yang GAK BOLEH ada sidebar-nya
  const isUserPage = location.pathname === "/PostUserPage";

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); 
    window.location.href = "/"; 
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-left">
      {/* SIDEBAR: Hanya muncul jika BUKAN di halaman user */}
      {!isUserPage && (
        <aside className="w-64 bg-white border-r p-4 hidden md:block">
          <h2 className="text-xl font-bold mb-8 px-2 text-slate-900 text-left">Menu Admin</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/categories")}>
              <ListTree className="mr-2 h-4 w-4" /> Kategori
            </Button>
            <div className="pt-4 mt-4 border-t">
              <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Keluar
              </Button>
            </div>
          </nav>
        </aside>
      )}

      {/* Konten Utama: Kalau di halaman user, padding-nya kita sesuaikan atau hilangkan */}
      <main className={`flex-1 ${isUserPage ? "p-0" : "p-8"}`}>
        {children}
      </main>
    </div>
  );
}