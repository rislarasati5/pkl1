import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, LayoutDashboard, ListTree, ShoppingBag } from "lucide-react"; // Tambah ShoppingBag

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isUserPage = location.pathname === "/PostUserPage";

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); 
    window.location.href = "/"; 
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-left">
      {!isUserPage && (
        <aside className="w-64 bg-white border-r p-4 hidden md:block">
          <h2 className="text-xl font-bold mb-8 px-2 text-slate-900 text-left">Menu Admin</h2>
          <nav className="space-y-2">
            <Button 
              variant={location.pathname === "/dashboard" ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Button>
            
            {/* MENU BARU: PESANAN */}
            <Button 
              variant={location.pathname === "/orders" ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => navigate("/orders")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> Pesanan Masuk
            </Button>

            <Button 
              variant={location.pathname === "/categories" ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => navigate("/categories")}
            >
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

      <main className={`flex-1 ${isUserPage ? "p-0" : "p-8"}`}>
        {children}
      </main>
    </div>
  );
}