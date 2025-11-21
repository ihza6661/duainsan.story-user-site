import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Pengguna mencoba mengakses halaman yang tidak ada:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">Oops! Halaman tidak ditemukan</p>
        <a href="/" className="underline">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default NotFound;
