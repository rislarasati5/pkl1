import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "@/features/auth/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const authSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      // PERBAIKAN DI SINI:
      // Backend kamu mengirim { status: 'success', data: { accessToken: '...' } }
      // Axios membungkusnya lagi dalam object 'data'
      const token = response.data?.accessToken; 

      if (token) {
        localStorage.setItem("accessToken", token);
        // Simpan refreshToken juga jika perlu untuk logic di axios.ts nanti
        if (response.data?.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        
        window.dispatchEvent(new Event("auth-change"));
      } else {
        alert("Token tidak ditemukan dalam response server!");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login Gagal! Periksa email/password.";
      alert(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Registrasi Berhasil! Silakan Login.");
      setIsLogin(true);
      form.reset();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Registrasi Gagal!");
    },
  });

  const onSubmit = (data: z.infer<typeof authSchema>) => {
    isLogin ? loginMutation.mutate(data) : registerMutation.mutate(data);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
    <div className="w-full max-w-md">

      <Card className="shadow-2xl border-0 rounded-2xl bg-white">
        <CardHeader className="space-y-3 text-center pb-6">

          <CardTitle className="text-2xl font-bold text-slate-800">
            {isLogin ? "Selamat Datang" : "Buat Akun Baru"}
          </CardTitle>

          <p className="text-sm text-slate-500">
            {isLogin
              ? "Masukkan email dan password untuk masuk"
              : "Lengkapi data untuk membuat akun baru"}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@gmail.com"
                        {...field}
                        className="h-11 rounded-lg focus-visible:ring-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        className="h-11 rounded-lg focus-visible:ring-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BUTTON */}
              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-all duration-200"
                disabled={
                  loginMutation.isPending ||
                  registerMutation.isPending
                }
              >
                {loginMutation.isPending ||
                registerMutation.isPending ? (
                  "Mohon tunggu..."
                ) : isLogin ? (
                  "Login Sekarang"
                ) : (
                  "Daftar Sekarang"
                )}
              </Button>

              {/* DIVIDER */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400">
                    Atau
                  </span>
                </div>
              </div>

              {/* SWITCH MODE */}
              <p className="text-center text-sm text-slate-600">
                {isLogin
                  ? "Belum punya akun?"
                  : "Sudah punya akun?"}{" "}
                <button
                  type="button"
                  className="text-emerald-600 font-semibold hover:underline transition"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    form.reset();
                  }}
                >
                  {isLogin
                    ? "Daftar di sini"
                    : "Login di sini"}
                </button>
              </p>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  </div>
);
}