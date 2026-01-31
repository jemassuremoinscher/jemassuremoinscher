import { motion } from "framer-motion";

// Import partner logos
import generaliLogo from "@/assets/logos/generali.jpg";
import agfLogo from "@/assets/logos/agf.png";
import maifLogo from "@/assets/logos/maif.webp";
import axaLogo from "@/assets/logos/axa.webp";
import swisslifeLogo from "@/assets/logos/swisslife.webp";
import maafLogo from "@/assets/logos/maaf.webp";
import matmutLogo from "@/assets/logos/matmut.webp";
import allianzLogo from "@/assets/logos/allianz.webp";

const PartnersSlider = () => {
  const partners = [
    { name: "Generali", id: 1, logo: generaliLogo },
    { name: "AGF", id: 2, logo: agfLogo },
    { name: "MAIF", id: 3, logo: maifLogo },
    { name: "AXA", id: 4, logo: axaLogo },
    { name: "SwissLife", id: 5, logo: swisslifeLogo },
    { name: "MAAF", id: 6, logo: maafLogo },
    { name: "Matmut", id: 7, logo: matmutLogo },
    { name: "Allianz", id: 8, logo: allianzLogo },
  ];

  // Duplicate for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-8 md:py-12 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-[#340e5d] font-bold md:text-4xl text-2xl">
          Nos partenaires
        </p>
      </div>

      {/* Infinite Slider */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-muted/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-muted/50 to-transparent z-10" />

        <motion.div
          className="flex gap-8 md:gap-12"
          animate={{
            x: [0, -180 * partners.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center w-32 md:w-40 h-16 md:h-20 bg-white rounded-lg shadow-sm border border-border/50 px-4"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} - partenaire assurance moins chère`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSlider;
