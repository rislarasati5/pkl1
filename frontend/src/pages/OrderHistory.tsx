import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders, getPosts } from "../features/posts/postService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, FileSpreadsheet, Download, X, User } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function OrderDetailModal({ order, onClose, menu }: any) {
  if (!order) return null;

  const getHargaMenu = (judul: string) => {
    if (!menu) return 0;

    const found = menu.find((m: any) => m.judul === judul);

    if (!found) return 0;

    return Number(
      found.isi
        ?.replace("Rp.", "")
        ?.replace("Rp", "")
        ?.replace(/\./g, "")
        ?.trim()
    ) || 0;
  };

  const totalItem = order.items?.reduce((acc: number, it: any) => acc + (it.qty || 1), 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl bg-white shadow-2xl border-0 overflow-hidden">

        <CardHeader className="bg-slate-900 text-white flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <User size={20} className="text-white" />
            </div>

            <div>
              <CardTitle className="text-xl uppercase">{order.nama_pemesan}</CardTitle>
              <p className="text-xs text-slate-300">
                Meja {order.nomor_meja} • {new Date(order.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X size={24} />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">

          <div className="space-y-3">
            <p className="font-bold text-sm text-slate-500 uppercase tracking-widest">
              Detail Pesanan
            </p>

            <div className="border rounded-xl divide-y">

              {order.items?.map((item: any, idx: number) => {

                const harga = getHargaMenu(item.judul);
                const qty = item.qty || 1;
                const subtotal = harga * qty;

                return (
                  <div key={idx} className="p-3 flex justify-between items-center bg-slate-50/30">

                    <div>
                      <span className="font-bold text-orange-600 mr-2">
                        {qty}x
                      </span>

                      <span className="font-medium text-slate-800">
                        {item.judul}
                      </span>

                      <div className="text-[11px] text-slate-400 ml-6">
                        @Rp {harga.toLocaleString()}
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-slate-700">
                      Rp {subtotal.toLocaleString()}
                    </span>

                  </div>
                );
              })}

            </div>
          </div>

          <div className="flex justify-between text-sm text-slate-500">
            <span>Total Item</span>
            <span>{totalItem}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
            <span className="font-bold text-slate-700">Total Pembayaran</span>
            <span className="text-xl font-black text-orange-600">
              Rp {order.total_harga?.toLocaleString()}
            </span>
          </div>

          <Button
            onClick={onClose}
            className="w-full py-6 bg-slate-900 hover:bg-black font-bold"
          >
            Tutup Riwayat
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders-history"],
    queryFn: getAllOrders,
  });

  const { data: menu } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const exportExcel = () => {
    if (!orders) return;

    const data = orders.map((o: any, i: number) => ({
      No: i + 1,
      Pemesan: o.nama_pemesan,
      Meja: o.nomor_meja,
      Total: o.total_harga,
      Waktu: new Date(o.createdAt).toLocaleString("id-ID"),
      Items: o.items?.map((it: any) => `${it.judul} (${it.qty}x)`).join(", ")
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Riwayat");
    XLSX.writeFile(wb, "Laporan_Riwayat_Pesanan.xlsx");
  };

  const exportPDF = () => {
    if (!orders) return;

    const doc = new jsPDF();

    doc.text("LAPORAN RIWAYAT PESANAN", 14, 15);

    autoTable(doc, {
      head: [["No", "Pemesan", "Meja", "Total", "Waktu"]],
      body: orders.map((o: any, i: number) => [
        i + 1,
        o.nama_pemesan,
        o.nomor_meja,
        `Rp ${o.total_harga?.toLocaleString()}`,
        new Date(o.createdAt).toLocaleString("id-ID")
      ]),
      startY: 20,
    });

    doc.save("Riwayat_Pesanan.pdf");
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Riwayat Pesanan
          </h1>
          <p className="text-slate-500 text-sm italic">
            Data pesanan yang telah diselesaikan dari dapur.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">

          <Button
            onClick={exportExcel}
            variant="outline"
            className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>

          <Button
            onClick={exportPDF}
            variant="outline"
            className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>

        </div>
      </div>

      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">

        <Table>

          <TableHeader className="bg-slate-800">
            <TableRow className="hover:bg-slate-800">
              <TableHead className="text-white text-center w-16">NO</TableHead>
              <TableHead className="text-white">PEMESAN</TableHead>
              <TableHead className="text-white">MEJA</TableHead>
              <TableHead className="text-white">TOTAL</TableHead>
              <TableHead className="text-white text-right pr-10">AKSI</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <Loader2 className="animate-spin inline mr-2" />
                  Menarik data...
                </TableCell>
              </TableRow>
            ) : (

              orders?.map((order: any, index: number) => (

                <TableRow key={order.id} className="hover:bg-slate-50 border-b">

                  <TableCell className="text-center">
                    {index + 1}
                  </TableCell>

                  <TableCell className="font-bold uppercase">
                    {order.nama_pemesan}
                  </TableCell>

                  <TableCell>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      MEJA {order.nomor_meja}
                    </span>
                  </TableCell>

                  <TableCell className="font-bold text-orange-600">
                    Rp {order.total_harga?.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right pr-6">

                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:bg-blue-50 font-bold gap-2"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={16} />
                      Lihat Detail
                    </Button>

                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

      </Card>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        menu={menu}
      />

    </div>
  );
}