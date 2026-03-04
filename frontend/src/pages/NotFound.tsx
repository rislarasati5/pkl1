import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl space-y-6 max-w-md">
        <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <FileQuestion className="h-10 w-10 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-800">404</h1>
          <h2 className="text-xl font-bold text-slate-700">Halaman Tidak Ditemukan</h2>
          <p className="text-slate-500">
            Waduh wak, sepertinya kamu tersesat. Halaman yang kamu cari nggak ada atau sudah pindah.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl"
        >
          Balik ke Dashboard
        </Button>
      </div>
    </div>
  );
}