import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostsPaginated, postOrder, getAllOrders, createPayment} from "../features/posts/postService";
import { getTables } from "../features/table/tableService";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, ShoppingCart, Plus, Minus, Send, ChevronLeft, ChevronRight, ChevronDown} from "lucide-react";

export default function PostUserPage() {

  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 6; 

  const [namaPemesan, setNamaPemesan] = useState("");
  const [nomorMeja, setNomorMeja] = useState<number | "">("");
  const [cart, setCart] = useState<any[]>([]);

  // FETCH TABLE & ORDER
  const { data: tableData } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    refetchInterval: 5000
  });

  const { data: orderData } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    refetchInterval: 5000
  });

  const tablesRaw = tableData?.data ?? [];
  const activeOrders = orderData ?? [];

  const availableTables = tablesRaw.filter((table: any) => {

    const isOccupied = activeOrders.some(
      (order: any) =>
        Number(order.nomor_meja) === Number(table.nomor_meja) &&
        order.status !== "selesai"
    );

    return !isOccupied;
  });

  // FETCH MENU
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["posts", page, search],
    queryFn: () => getPostsPaginated(page, limit, search),
    placeholderData: (prev) => prev
  });

  const menus = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  // CART LOGIC
  const addToCart = (item: any) => {

    setCart((prev) => {

      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });

  };

  const removeFromCart = (itemId: number) => {

    setCart((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );

  };

  const totalHarga = cart.reduce((acc, item) => {

    const harga = parseInt(item.isi.replace(/\D/g, ""));

    return acc + harga * item.qty;

  }, 0);

  // ORDER MUTATION
  const mutation = useMutation({

    mutationFn: postOrder,

    onSuccess: () => {

      alert("Pesanan Berhasil Terkirim ke Dapur!");

      setCart([]);
      setNamaPemesan("");
      setNomorMeja("");

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });

    },

    onError: (err: any) => {
      alert("Gagal: " + err.message);
    }

  });

  // ======================
  // PAYMENT MUTATION
  // ======================

  const paymentMutation = useMutation({

    mutationFn: createPayment,

    onSuccess: (data) => {

      const snapToken = data.token;

      //@ts-ignore
      window.snap.pay(snapToken, {

        onSuccess: function () {

          mutation.mutate({

            nama_pemesan: namaPemesan,
            nomor_meja: Number(nomorMeja),
            total_harga: totalHarga,

            items: cart.map((item) => ({
              id: item.id,
              judul: item.judul,
              isi: item.isi,
              qty: item.qty
            }))

          });

        },

        onPending: function () {
          alert("Menunggu pembayaran...");
        },

        onError: function () {
          alert("Pembayaran gagal");
        },

        onClose: function () {
          alert("Kamu menutup pembayaran");
        }

      });

    },

    onError: (err: any) => {
      alert("Payment error: " + err.message);
    }

  });

  // ======================
  // CHECKOUT
  // ======================

  const handleCheckout = () => {

    if (!namaPemesan || !nomorMeja || cart.length === 0) {

      alert("Mohon isi Nama, Nomor Meja, dan pilih Menu.");
      return;

    }

    paymentMutation.mutate({

      nama_pemesan: namaPemesan,
      nomor_meja: Number(nomorMeja),
      total_harga: totalHarga,

      items: cart.map((item) => ({
        id: item.id,
        judul: item.judul,
        isi: item.isi,
        qty: item.qty
      }))

    });

  };

  return (

    <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-10">

      {/* ================= MENU ================= */}

      <div className="flex-1 space-y-8">

        <div className="space-y-4">

          <h1 className="text-4xl font-black text-slate-900 uppercase">
            Pesan Menu
          </h1>

          <div className="relative max-w-md">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari makanan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
            />

          </div>

        </div>

        {(isLoading || isFetching) && menus.length === 0 ? (

          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>

        ) : (

          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {menus.map((item: any) => {

                const inCart = cart.find((i) => i.id === item.id);

                return (

                  <Card
                    key={item.id}
                    className="rounded-2xl overflow-hidden bg-white border shadow-sm hover:shadow-lg transition"
                  >

                    <div className="h-44 w-full overflow-hidden">

                      <img
                        src={item.gambar}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />

                    </div>

                    <CardContent className="p-5 space-y-3">

                      <h2 className="font-bold text-lg text-slate-800">
                        {item.judul}
                      </h2>

                      <p className="text-orange-500 font-black text-xl">
                        {item.isi}
                      </p>

                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border">

                        {inCart ? (

                          <>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 hover:bg-slate-200 rounded"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="font-bold">
                              {inCart.qty}
                            </span>

                            <button
                              onClick={() => addToCart(item)}
                              className="p-2 hover:bg-orange-100 text-orange-600 rounded"
                            >
                              <Plus size={16} />
                            </button>
                          </>

                        ) : (

                          <button
                            onClick={() => addToCart(item)}
                            className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                          >
                            Tambah
                          </button>

                        )}

                      </div>

                    </CardContent>

                  </Card>

                );
              })}

            </div>

            {/* PAGINATION */}

            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

              <button
                disabled={page === 1}
                onClick={() => {
                  setPage(page - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3 py-2 bg-slate-200 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft size={18}/>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (

                <button
                  key={p}
                  onClick={() => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    page === p
                      ? "bg-orange-500 text-white"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  {p}
                </button>

              ))}

              <button
                disabled={page === totalPages}
                onClick={() => {
                  setPage(page + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3 py-2 bg-slate-200 rounded-lg disabled:opacity-50"
              >
                <ChevronRight size={18}/>
              </button>

            </div>

          </>

        )}

      </div>

      {/* ================= CART ================= */}

      <div className="w-full lg:w-96 bg-slate-900 p-8 rounded-3xl text-white h-fit sticky top-6">

        <div className="flex items-center gap-3 mb-6">

          <ShoppingCart />

          <h2 className="text-xl font-bold">
            Detail Pesanan
          </h2>

        </div>

        <div className="space-y-4 mb-6">

          <input
            type="text"
            placeholder="Nama Pemesan"
            value={namaPemesan}
            onChange={(e) => setNamaPemesan(e.target.value)}
            className="w-full p-3 bg-slate-800 rounded-xl"
          />

          <div className="relative">

            <select
              value={nomorMeja}
              onChange={(e) =>
                setNomorMeja(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full p-3 bg-slate-800 rounded-xl appearance-none"
            >

              <option value="">Pilih Meja</option>

              {availableTables.map((table: any) => (

                <option key={table.id} value={table.nomor_meja}>
                  Meja {table.nomor_meja}
                </option>

              ))}

            </select>

            <ChevronDown
              className="absolute right-3 top-3 text-slate-400"
            />

          </div>

        </div>

        <div className="flex justify-between text-lg font-bold mb-6">

          <span>Total</span>

          <span>
            Rp {totalHarga.toLocaleString()}
          </span>

        </div>

        <button
          onClick={handleCheckout}
          disabled={paymentMutation.isPending || cart.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >

          {paymentMutation.isPending
            ? <Loader2 className="animate-spin" />
            : <>
                <Send size={18} />
                Bayar Sekarang
              </>
          }

        </button>

      </div>

    </div>

  );

}