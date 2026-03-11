import { useEffect, useState } from "react";
import { getTables, createTable, updateTable, deleteTable } from "../features/table/tableService";
import { getAllOrders } from "../features/posts/postService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit3, Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableData {
  id: number;
  nomor_meja: number;
  status: string;
}

export default function TablePage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [nomorMeja, setNomorMeja] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchTables = async (showSyncLoader = false) => {
    try {
      if (showSyncLoader) setIsSyncing(true);
      else setLoading(true);

      const tableRes = await getTables();
      const orderRes = await getAllOrders();
      const orders = orderRes ?? [];

      const updatedTables = tableRes.data.map((table: TableData) => {
        const hasActiveOrder = orders.some(
          (order: any) =>
            Number(order.nomor_meja) === Number(table.nomor_meja) &&
            order.status !== "selesai"
        );

        return { ...table, status: hasActiveOrder ? "terisi" : table.status };
      });

      setTables(updatedTables);
    } catch (err) {
      console.error("Gagal sinkron:", err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(() => fetchTables(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorMeja) return;

    try {
      setLoading(true);
      await createTable(Number(nomorMeja));
      setNomorMeja("");
      await fetchTables();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "kosong" ? "terisi" : "kosong";

    try {
      await updateTable(id, newStatus);
      await fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus meja ini?")) return;

    try {
      await deleteTable(id);
      await fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-slate-800">
              Manajemen Meja
            </h1>
            <p className="text-sm text-slate-500">
              Pantau ketersediaan meja pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTables(true)}
              className="bg-white gap-2"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              Refresh
            </Button>

            <div className="bg-white px-3 py-1 rounded border text-sm text-slate-600">
              Total: {tables.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FORM TAMBAH MEJA */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Tambah Meja</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">

                <div className="space-y-2">
                  <Label>Nomor Meja</Label>
                  <Input
                    type="number"
                    placeholder="1,2,3..."
                    value={nomorMeja}
                    onChange={(e) => setNomorMeja(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Simpan
                </Button>

              </form>
            </CardContent>
          </Card>

          {/* TABEL MEJA */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daftar Meja</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor Meja</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading && tables.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-sm text-slate-500 mt-2">
                          Memuat data...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : tables.length > 0 ? (
                    tables.map((table) => (
                      <TableRow key={table.id}>

                        <TableCell>
                          {table.nomor_meja}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs ${
                              table.status === "kosong"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {table.status === "kosong"
                              ? <CheckCircle size={12} />
                              : <XCircle size={12} />
                            }
                            {table.status}
                          </span>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdate(table.id, table.status)}
                            >
                              <Edit3 size={16} />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(table.id)}
                            >
                              <Trash2 size={16} />
                            </Button>

                          </div>
                        </TableCell>

                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-16 text-slate-400">
                        Belum ada meja
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}