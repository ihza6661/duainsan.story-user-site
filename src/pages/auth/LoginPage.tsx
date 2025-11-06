// src/pages/LoginPage.tsx (Dengan Redirect setelah Login)

import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/auth/useLogin';

const LoginPage = () => {
  // State lokal untuk mengelola nilai dari form input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State lokal untuk efek UI floating label (tidak berubah)
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-normal tracking-wider text-gray-800">MASUK</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Menampilkan pesan error jika login gagal */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4 text-sm" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Input Email dengan Floating Label */}
          <div className="relative mb-6">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black peer"
              required
              autoComplete="email"
              disabled={isLoading} // Nonaktifkan input saat loading
            />
            <label
              htmlFor="email"
              className={`absolute left-3 transition-all duration-200 pointer-events-none
                ${(isEmailFocused || email) ? 'top-0 text-xs bg-white px-1 -translate-y-1/2 text-black' : 'top-1/2 -translate-y-1/2 text-gray-500'}
                peer-focus:top-0 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:-translate-y-1/2 peer-focus:text-black`}
            >
              Email
            </label>
          </div>

          {/* Input Password dengan Floating Label */}
          <div className="relative mb-6">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black peer"
              required
              autoComplete="current-password"
              disabled={isLoading} // Nonaktifkan input saat loading
            />
            <label
              htmlFor="password"
              className={`absolute left-3 transition-all duration-200 pointer-events-none
                ${(isPasswordFocused || password) ? 'top-0 text-xs bg-white px-1 -translate-y-1/2 text-black' : 'top-1/2 -translate-y-1/2 text-gray-500'}
                peer-focus:top-0 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:-translate-y-1/2 peer-focus:text-black`}
            >
              Password
            </label>
          </div>

          <div className="mb-6 text-right">
            <a href="#" className="text-sm text-gray-600 hover:underline">Lupa Password?</a>
          </div>

          <button
            type="submit"
            disabled={isLoading} // Tombol dinonaktifkan saat proses login berjalan
            className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mb-4 tracking-widest transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'MEMPROSES...' : 'Masuk'}
          </button>

          <div className="text-center">
            {/* 4. Menggunakan komponen <Link> untuk navigasi yang lebih baik */}
            <Link to="/register" className="text-sm text-gray-600 hover:underline">
              Buat Akun
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
