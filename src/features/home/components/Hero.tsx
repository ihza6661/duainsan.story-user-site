import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ShoppingBag,
  Users,
  Star,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const phoneNumber = "+6283151770146";

// Hero video
const heroVideo = {
  src: "/hero/hero_neo.mp4",
  poster: "/hero/hero_fallback.png", // Fallback image
  alt: "Elegant Wedding Invitation Hero",
};

// Typewriter effect hook
const useTypewriter = (text: string, speed = 100) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
};

// Social proof data
const stats = [
  { icon: Users, value: "1000+", label: "Happy Customers" },
  { icon: Star, value: "4.9/5", label: "Customer Rating" },
  { icon: CheckCircle, value: "100+", label: "Unique Designs" },
];

export const Hero = () => {
  const { displayedText, isComplete } = useTypewriter(
    "Create Your Perfect Invitation",
    80,
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center font-serif bg-background overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <video
            src={heroVideo.src}
            poster={heroVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover brightness-[0.85] contrast-110 saturate-90"
          />
        </motion.div>

        {/* Overlay Gradient - Lighter vignette for better video visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          {/* Glass Card with Enhanced Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/20 ring-1 ring-black/5"
          >
            {/* Main Headline with Typewriter Effect */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight tracking-wide min-h-[1.2em]">
              {displayedText}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1 h-[0.9em] bg-primary ml-1 align-middle"
                />
              )}
            </h1>

            {/* Subheadline with Staggered Animation */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="text-base sm:text-lg text-foreground italic mb-8"
            >
              Make every event unforgettable — starting with the invitation.
            </motion.p>

            {/* Social Proof Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-border/30"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.2 + index * 0.1, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {/* WhatsApp CTA with Animation */}
              <motion.a
                href={`https://wa.me/${phoneNumber.replace("+", "")}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all px-6 py-3 rounded-full shadow-lg text-sm font-medium relative overflow-hidden"
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.div>
                <span>Chat Admin</span>

                {/* Ripple effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-foreground/10 rounded-full"
                  initial={{ scale: 0, opacity: 0.5 }}
                  whileHover={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.a>

              {/* Browse Collection CTA */}
              <motion.a
                href="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all px-6 py-3 rounded-full shadow-lg text-sm font-medium relative overflow-hidden"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Undangan Cetak</span>

                {/* Slide arrow on hover */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-4"
                >
                  →
                </motion.div>
              </motion.a>

              {/* Digital Templates CTA */}
              <motion.a
                href="/digital-templates"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all px-6 py-3 rounded-full shadow-lg text-sm font-medium relative overflow-hidden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Template Digital</span>

                {/* Slide arrow on hover */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-4"
                >
                  →
                </motion.div>
              </motion.a>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4, duration: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"
            >
              <CheckCircle className="w-4 h-4 text-foreground" />
              <span className="text-foreground">
                Free design consultation • Fast delivery • 100% customizable
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 4.5,
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
};
