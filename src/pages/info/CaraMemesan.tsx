const steps = [
  {
    number: 1,
    title: "Pilih Undangan Favoritmu",
    description:
      "Masuk ke website DuaInsan.Story dan pilih desain undangan yang paling cocok dengan tema pernikahanmu.",
  },
  {
    number: 2,
    title: "Tambahkan Undangan Pilihan ke Keranjang & Lakukan Pembayaran",
    description:
      "Lakukan pembayaran untuk mengamankan harga dan slot produksi. ini tanda jadi untuk mulai proses.",
  },
  {
    number: 3,
    title: "Isi Data Pengantin",
    description:
      "Sebelum lanjut ke pembayaran, Anda akan diminta untuk mengisi form data undangan.",
  },
  {
    number: 4,
    title: "Fix Desain",
    description:
      "Setelah kamu checkout, Pesananmu akan masuk ketahap produksi.",
  },
  {
    number: 5,
    title: "Undangan Diproduksi & Dikirim",
    description:
      "Setelah selesai diproduksi, Anda akan dihubungi untuk diinfokan resi pengiriman.",
  },
];

const OrderSteps = () => {
  return (
    <div className="w-full bg-background py-32 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto font-sans">
        <h2 className="text-foreground text-center text-2xl sm:text-3xl lg:text-4xl font-serif italic mb-10">
          Cara <span className="">Memesan</span>?
        </h2>
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 p-4 rounded-lg backdrop-blur-md bg-card/60 shadow-sm"
            >
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center font-bold text-foreground text-sm sm:text-base">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold text-base text-foreground sm:text-lg mb-1">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSteps;
