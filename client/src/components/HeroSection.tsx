import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playVideo = () => {
        video.currentTime = 0;
        video.play().catch(console.error);
      };

      video.addEventListener('loadeddata', playVideo);
      video.addEventListener('ended', playVideo);
      
      // Force initial play
      if (video.readyState >= 3) {
        playVideo();
      }

      return () => {
        video.removeEventListener('loadeddata', playVideo);
        video.removeEventListener('ended', playVideo);
      };
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 60;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <source src="/videos/hero-video-optimized.mp4" type="video/mp4" />
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          <source src="/videos/hero-video.mov" type="video/quicktime" />
        </motion.video>
        {/* Video overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Text content */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-montserrat font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cuca-white mb-4 sm:mb-6 leading-tight"
          >
            <motion.span 
              className="text-cuca-yellow"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              CUCA
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-montserrat font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-cuca-white mb-6 sm:mb-8 max-w-4xl mx-auto"
          >
            Em Angola, cerveja é CUCA
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed text-[#ffd900] px-4 lg:px-0"
          >
            A cerveja que une Angola há gerações. Sabor autêntico, tradição
            genuína, orgulho nacional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 lg:px-0"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => scrollToSection("heritage")}
                className="bg-cuca-red hover:bg-red-700 text-cuca-white font-montserrat font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 shadow-lg w-full sm:w-auto"
              >
                Descubra Nossa História
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => scrollToSection("products")}
                variant="outline"
                className="border-2 border-cuca-yellow text-cuca-yellow hover:bg-cuca-yellow hover:text-cuca-black font-montserrat font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 w-full sm:w-auto"
              >
                Ver Produtos
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cuca-white animate-bounce"
      >
        <ChevronDown className="h-8 w-8" />
      </motion.div>
    </section>
  );
}