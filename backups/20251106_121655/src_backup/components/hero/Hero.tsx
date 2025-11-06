const phoneNumber = "+6283151770146";


export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center font-serif bg-background overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero/4.jpg"
          alt="Elegant Invitation Background"
          className="w-full h-full object-cover brightness-90 saturate-75"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
        {/* Glass Card */}
        <div className="bg-card/70 backdrop-blur-md rounded-3xl shadow-lg p-8 sm:p-12 animate-fadeIn border border-border/40">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-wide">
            Create Your Perfect Invitation
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground italic mb-10">
            Make every event unforgettable — starting with the invitation.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={`https://wa.me/${phoneNumber.replace("+", "")}`}
              className="inline-block border border-foreground text-foreground hover:bg-foreground hover:text-background transition px-6 py-3 rounded-full shadow-sm text-sm font-medium"
            >
              Chat Admin
            </a>
            <a
              href="/products"
              className="inline-block bg-primary text-primary-foreground hover:bg-primary/80 transition px-6 py-3 rounded-full shadow-sm text-sm font-medium"
            >
              Lihat Koleksi
            </a>
          </div>
        </div>

        {/* Decorative Secondary Image */}
        <div className="relative hidden lg:block animate-slideIn">
          <div className="absolute -top-10 -right-10 w-80 h-96 rounded-2xl overflow-hidden shadow-xl transform rotate-3">
            <img
              src="/hero/7.jpg"
              alt="Invitation Sample"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(40px) rotate(5deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(3deg);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 1.2s ease-out forwards;
        }
      `}</style>
    </section>
  );
};