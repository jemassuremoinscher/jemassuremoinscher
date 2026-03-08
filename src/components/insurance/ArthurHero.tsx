import { motion } from "framer-motion";

interface ArthurHeroProps {
  imageSrc: string;
  imageAlt: string;
  speechText: string;
}

const ArthurHero = ({ imageSrc, imageAlt, speechText }: ArthurHeroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center mb-8 px-4"
    >
      <motion.img
        src={imageSrc}
        alt={imageAlt}
        className="w-20 sm:w-24 md:w-32 lg:w-36 h-auto drop-shadow-2xl"
        width={144}
        height={180}
        loading="eager"
        decoding="async"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="relative mt-3 w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px]"
      >
        {/* Triangle pointing up */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-border/30 transform rotate-45 z-0" />
        <div className="relative bg-white rounded-2xl px-4 py-3 shadow-lg border border-border/30 z-10">
          <p className="text-foreground font-medium text-xs sm:text-sm md:text-base text-center">
            {speechText} 💡
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArthurHero;
