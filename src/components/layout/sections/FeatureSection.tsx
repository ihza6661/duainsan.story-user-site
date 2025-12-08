import React from "react";
import { Move, LayoutGrid, Paintbrush } from "lucide-react";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  bgColor: string;
  textColor: string;
  iconBoxColor: string;
  iconColor: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  description,
  bgColor,
  textColor,
  iconBoxColor,
  iconColor,
  icon,
}) => {
  return (
    <div
      className={`p-8 rounded-2xl flex flex-col items-start h-full ${bgColor} ${textColor}`}
    >
      {/* Icon Box */}
      <div className={`p-3 rounded-lg mb-6 ${iconBoxColor} ${iconColor}`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3">{title}</h3>

      {/* Subtitle */}
      <p className="font-semibold mb-4 opacity-90">{subtitle}</p>

      {/* Description */}
      <p className="text-sm leading-relaxed opacity-80">{description}</p>
    </div>
  );
};

const InvitationFeatureSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 font-sans">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Undangan Digital yang Bercerita
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Setiap momen spesial layak untuk{" "}
            <span className="font-bold text-foreground">
              dirayakan dengan cara yang unik
            </span>{" "}
            — pernikahan, ulang tahun, atau anniversary. DuaInsan.Story hadir untuk mengabadikan cerita cinta dan kebahagiaan Anda.
          </p>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Lebih dari Sekedar Undangan
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kami memahami bahwa{" "}
            <span className="font-bold text-foreground">setiap acara memiliki cerita yang berbeda</span>.
            DuaInsan.Story menyediakan undangan digital yang elegan, personal, dan mudah disebarkan untuk momen-momen istimewa Anda.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Desain Elegan */}
        <FeatureCard
          title="Desain Elegan"
          subtitle="Undangan yang Mencerminkan Kepribadian Anda"
          description="Pilih dari berbagai tema undangan digital yang elegan dan modern. Dari pernikahan romantis hingga perayaan ulang tahun yang meriah, setiap desain dirancang dengan penuh perhatian untuk momen spesial Anda."
          bgColor="bg-card"
          textColor="text-card-foreground"
          iconBoxColor="bg-primary"
          iconColor="text-primary-foreground"
          icon={<Paintbrush size={24} />}
        />

        {/* Card 2: Mudah Dibagikan */}
        <FeatureCard
          title="Mudah Dibagikan"
          subtitle="Jangkau Tamu Anda dengan Sekali Klik"
          description="Bagikan undangan digital Anda melalui WhatsApp, media sosial, atau email dengan mudah. Tamu dapat mengakses undangan kapan saja, dimana saja, dan melakukan konfirmasi kehadiran secara online."
          bgColor="bg-card"
          textColor="text-card-foreground"
          iconBoxColor="bg-accent"
          iconColor="text-accent-foreground"
          icon={<Move size={24} />}
        />

        {/* Card 3: Fitur Lengkap */}
        <FeatureCard
          title="Fitur Lengkap"
          subtitle="Semua yang Anda Butuhkan dalam Satu Tempat"
          description="Dilengkapi dengan galeri foto, peta lokasi, countdown timer, form RSVP, dan fitur guestbook digital. Buat undangan cetak juga tersedia untuk kebutuhan fisik Anda dengan kualitas terbaik."
          bgColor="bg-card"
          textColor="text-card-foreground"
          iconBoxColor="bg-primary"
          iconColor="text-primary-foreground"
          icon={<LayoutGrid size={24} />}
        />
      </div>
    </section>
  );
};

export default InvitationFeatureSection;
