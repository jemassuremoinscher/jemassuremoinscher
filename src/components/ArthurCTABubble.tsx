import { motion } from "framer-motion";
import arthurWink from "@/assets/mascotte/arthur-wink-thumbsup.png";

const ArthurCTABubble = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex items-end gap-2"
    >
      <div className="relative bg-white rounded-xl px-3 py-2 shadow-md border border-border/30">
        <p className="text-xs font-semibold text-primary whitespace-nowrap">Besoin d'aide ? 💡</p>
        <div className="absolute -right-1.5 bottom-2 w-3 h-3 bg-white border-r border-b border-border/30 transform rotate-[-45deg]" />
      </div>
      <img
        src={arthurWink}
        alt="Arthur, mascotte jemassuremoinscher"
        className="h-12 w-auto object-contain"
        loading="lazy"
      />
    </motion.div>
  );
};

export default ArthurCTABubble;
