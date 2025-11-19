import { useContext } from "react";
import {
  AuthContext,
  AuthContextType,
} from "@/features/auth/context/AuthContext-definition";
import { Button } from "@/components/ui/buttons/button";
import metodePembayaran from "@/assets/metode-pembayaran.webp";

const MetodePembayaran: React.FC = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const isLoggedIn = authContext?.user;
  return (
    <section className="container bg-secondary rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 px-6 py-10 md:px-12">
      <div className="">
        <h2 className="text-3xl font-bold mb-4">Metode pembayaran lengkap</h2>
        <p className="mb-6 leading-relaxed">
          Gak perlu mikirin biaya transfer antar bank, kamu bisa pilih metode
          pembayaran bank / e-wallet sesuai dengan yang sering kamu pake.
        </p>
        {!isLoggedIn && (
          <Button
            className="rounded-lg"
            variant="default"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Daftar →
          </Button>
        )}
      </div>
      {/* Image Section */}
      <div className="flex-shrink-0 w-40 md:w-[45%]">
        <img
          src={metodePembayaran as string}
          alt="Metode pembayaran yang tersedia"
          className="w-full h-auto object-contain mx-auto max-w-md"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default MetodePembayaran;
