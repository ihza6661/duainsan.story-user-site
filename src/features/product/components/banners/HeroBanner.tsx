import React from "react";
import { Button } from "@/components/ui/buttons/button";
import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient / texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[hsl(var(--card))]/80" />

      {/* Content */}
      <div className="container relative z-10 flex flex-col items-center justify-center text-center py-24 md:py-32">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-foreground font-semibold tracking-tight text-4xl md:text-6xl leading-tight max-w-3xl"
        >
          Undangan Modern untuk Momen Spesial Anda
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-muted-foreground mt-6 max-w-xl text-base md:text-lg"
        >
          Desain undangan digital elegan, personal, dan mudah dibagikan. 
          Wujudkan undangan impian Anda dengan sentuhan modern dan profesional.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex gap-4"
        >
          <Button className="btn-transition bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent-hover))]">
            Buat Undangan
          </Button>
          <Button variant="outline" className="btn-transition border-[hsl(var(--accent))] text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))/10]">
            Lihat Contoh
          </Button>
        </motion.div>
      </div>

      {/* Optional Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[hsl(var(--background))] to-transparent" />
    </section>
  );
};

export default HeroBanner;
