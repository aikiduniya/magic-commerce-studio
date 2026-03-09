import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function BannerSlider() {
  const { banners } = useStore();
  const activeBanners = banners.filter(b => b.active);
  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = useCallback((dir: number) => {
    setCurrent(([prev]) => [(prev + dir + activeBanners.length) % activeBanners.length, dir]);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length, paginate]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[current % activeBanners.length];

  return (
    <section className="relative w-full h-[70vh] min-h-[400px] max-h-[700px] overflow-hidden bg-muted">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={banner.id + current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-4xl md:text-6xl font-bold text-primary-foreground max-w-2xl"
            >
              {banner.title}
            </motion.h2>
            {banner.subtitle && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-xl"
              >
                {banner.subtitle}
              </motion.p>
            )}
            {banner.buttonText && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6"
              >
                <a href={banner.buttonLink || "#products"}>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {banner.buttonText}
                  </Button>
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/50 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent([i, i > current ? 1 : -1])}
                className={`h-2 rounded-full transition-all ${i === current % activeBanners.length ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
