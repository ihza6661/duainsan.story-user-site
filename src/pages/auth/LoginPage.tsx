import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";

const LoginPage = () => {
  // State lokal untuk mengelola nilai dari form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State lokal untuk efek UI floating label
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Memanggil custom hook `useLogin` untuk mendapatkan semua logika login
  const { isLoading, error, performLogin } = useLogin();

  /*
    Handler untuk menangani proses submit form.
  */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Mencegah form dari refresh halaman

    await performLogin({ email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-xs bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-foreground text-2xl font-normal tracking-wider">
            MASUK
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Menampilkan pesan error jika login gagal */}
          {error && (
            <div
              className="bg-destructive/10 border border-destructive/40 text-destructive px-4 py-3 rounded-md relative mb-4 text-sm"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Input Email dengan Floating Label */}
          <div className="relative mb-6">
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              required
              autoComplete="email"
              disabled={isLoading} // Nonaktifkan input saat loading
            />
            <Label
              htmlFor="email"
              className={`absolute left-3 transition-all duration-200 pointer-events-none
                ${
                  isEmailFocused || email
                    ? "bg-card rounded-md top-0 text-xs px-1 -translate-y-1/2"
                    : "top-1/2 -translate-y-1/2 text-muted-foreground"
                }
                peer-focus:top-0 peer-focus:text-xs peer-focus:px-1 peer-focus:-translate-y-1/2 peer-focus:text-foreground`}
            >
              Email
            </Label>
          </div>

          {/* Input Password dengan Floating Label */}
          <div className="relative mb-6">
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
              autoComplete="current-password"
              disabled={isLoading} // Nonaktifkan input saat loading
            />
            <Label
              htmlFor="password"
              className={`absolute left-3 transition-all duration-200 pointer-events-none
                ${
                  isPasswordFocused || password
                    ? "top-0 text-xs bg-card rounded-md px-1 -translate-y-1/2 text-foreground"
                    : "top-1/2 -translate-y-1/2 text-muted-foreground"
                }
                peer-focus:top-0 peer-focus:text-xs peer-focus:bg-background peer-focus:px-1 peer-focus:-translate-y-1/2 peer-focus:text-foreground`}
            >
              Password
            </Label>
          </div>

          <div className="mb-6 text-right">
            <a href="#" className="text-sm hover:underline">
              Lupa Password?
            </a>
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={isLoading} // Tombol dinonaktifkan saat proses login berjalan
            className="w-full py-3 px-4 rounded-md focus:outline-none mb-4 tracking-widest transition-colors duration-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>

          <div className="text-center">
            {/* Menggunakan komponen <Link> untuk navigasi yang lebih baik */}
            <Link to="/register" className="text-sm hover:underline">
              Buat Akun
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
