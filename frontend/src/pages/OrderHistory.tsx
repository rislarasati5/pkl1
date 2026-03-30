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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl bg-white shadow-2xl border-0">

        <CardHeader className="bg-slate-900 text-white flex justify-between p-6">

          <div>
            <CardTitle className="text-xl uppercase">{order.nama_pemesan}</CardTitle>

            <p className="text-xs text-slate-300">
              Meja {order.nomor_meja} • {new Date(order.created_at).toLocaleString("id-ID")}
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={24} />
          </Button>

        </CardHeader>

        <CardContent className="p-6 space-y-6">

          <div className="border rounded-xl divide-y">

            {order.items?.map((item: any, idx: number) => {

              const harga = getHargaMenu(item.judul);
              const qty = item.qty || 1;
              const subtotal = harga * qty;

              return (
                <div key={idx} className="p-3 flex justify-between">

                  <div>
                    <span className="font-bold text-orange-600 mr-2">
                      {qty}x
                    </span>

                    {item.judul}
                  </div>

                  <span>
                    Rp {subtotal.toLocaleString()}
                  </span>

                </div>
              );
            })}

          </div>

          <div className="flex justify-between font-bold text-orange-600">
            <span>Total</span>
            <span>Rp {order.total_harga?.toLocaleString()}</span>
          </div>

          <Button onClick={onClose} className="w-full">
            Tutup
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderHistory() {

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders-history"],
    queryFn: getAllOrders,
  });

  const { data: menu } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const filteredOrders = orders?.filter((order: any) => {

    if (!startDate && !endDate) return true;

    if (!order.created_at) return true;

    const orderDate = order.created_at.split("T")[0];

    if (startDate && orderDate < startDate) return false;

    if (endDate && orderDate > endDate) return false;

    return true;

  });

  const exportExcel = () => {

    if (!filteredOrders) return;

    const data = filteredOrders.map((o: any, i: number) => ({
      No: i + 1,
      Pemesan: o.nama_pemesan,
      Meja: o.nomor_meja,
      Total: o.total_harga,
      Waktu: new Date(o.created_at).toLocaleString("id-ID")
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Riwayat");
    XLSX.writeFile(wb, "Riwayat_Pesanan.xlsx");
  };

  const exportPDF = () => {

    if (!filteredOrders) return;

    const doc = new jsPDF();

    doc.text("LAPORAN RIWAYAT PESANAN", 14, 15);

    autoTable(doc, {
      head: [["No", "Pemesan", "Meja", "Total", "Waktu"]],
      body: filteredOrders.map((o: any, i: number) => [
        i + 1,
        o.nama_pemesan,
        o.nomor_meja,
        `Rp ${o.total_harga?.toLocaleString()}`,
        new Date(o.created_at).toLocaleString("id-ID")
      ]),
      startY: 20,
    });

    doc.save("Riwayat_Pesanan.pdf");
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-black">
            Riwayat Pesanan
          </h1>

          <p className="text-sm text-gray-500">
            Data pesanan yang telah diselesaikan dari dapur
          </p>
        </div>

        <div className="flex gap-2">

          <Button onClick={exportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2"/>
            Excel
          </Button>

          <Button onClick={exportPDF}>
            <Download className="h-4 w-4 mr-2"/>
            PDF
          </Button>

        </div>

      </div>

      {/* FILTER TANGGAL */}

      <div className="flex gap-4">

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <Button
          variant="outline"
          onClick={()=>{
            setStartDate("")
            setEndDate("")
          }}
        >
          Reset
        </Button>

      </div>

      <Card>

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Pemesan</TableHead>
              <TableHead>Meja</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Loader2 className="animate-spin inline mr-2"/>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (

              filteredOrders?.map((order:any,index:number)=>(
                <TableRow key={order.id}>

                  <TableCell>{index+1}</TableCell>

                  <TableCell className="font-bold">
                    {order.nama_pemesan}
                  </TableCell>

                  <TableCell>
                    MEJA {order.nomor_meja}
                  </TableCell>

                  <TableCell className="text-orange-600 font-bold">
                    Rp {order.total_harga?.toLocaleString()}
                  </TableCell>

                  <TableCell>

                    <Button
                      variant="ghost"
                      onClick={()=>setSelectedOrder(order)}
                    >
                      <Eye size={16}/>
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
        onClose={()=>setSelectedOrder(null)}
        menu={menu}
      />

    </div>
  );
}
