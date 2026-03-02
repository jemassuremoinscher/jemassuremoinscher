import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

import agfLogo from "@/assets/logos/agf.png";
import allianzLogo from "@/assets/logos/allianz.webp";
import amaguizLogo from "@/assets/logos/amaguiz.jpg";
import aonLogo from "@/assets/logos/aon.jpg";
import aprilLogo from "@/assets/logos/april-new.png";
import axaLogo from "@/assets/logos/axa.webp";
import directAssuranceLogo from "@/assets/logos/direct-assurance-new.png";
import ganLogo from "@/assets/logos/gan.svg";
import generaliLogo from "@/assets/logos/generali.jpg";
import gmfLogo from "@/assets/logos/gmf-new.png";
import lolivierLogo from "@/assets/logos/lolivier.png";
import maafLogo from "@/assets/logos/maaf.webp";
import macifLogo from "@/assets/logos/macif-new.png";
import maifLogo from "@/assets/logos/maif.webp";
import matmutLogo from "@/assets/logos/matmut.webp";
import maxanceLogo from "@/assets/logos/maxance.png";
import mmaLogo from "@/assets/logos/mma-new.webp";
import swissLifeLogo from "@/assets/logos/swisslife.webp";

const PartnersSlider = () => {
  const { t } = useLanguage();
  const partners = [
    { name: "AGF", id: 1, logo: agfLogo },
    { name: "Allianz", id: 2, logo: allianzLogo },
    { name: "Amaguiz", id: 3, logo: amaguizLogo },
    { name: "AON", id: 4, logo: aonLogo },
    { name: "April", id: 5, logo: aprilLogo },
    { name: "AXA", id: 6, logo: axaLogo },
    { name: "Direct Assurance", id: 7, logo: directAssuranceLogo },
    { name: "GAN", id: 8, logo: ganLogo },
    { name: "Generali", id: 9, logo: generaliLogo },
    { name: "GMF", id: 10, logo: gmfLogo },
    { name: "L'Olivier", id: 11, logo: lolivierLogo },
    { name: "MAAF", id: 12, logo: maafLogo },
    { name: "MACIF", id: 13, logo: macifLogo },
    { name: "MAIF", id: 14, logo: maifLogo },
    { name: "Matmut", id: 15, logo: matmutLogo },
    { name: "Maxance", id: 16, logo: maxanceLogo },
    { name: "MMA", id: 17, logo: mmaLogo },
    { name: "SwissLife", id: 18, logo: swissLifeLogo },
  ];

  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-8 md:py-12 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-center text-primary font-bold md:text-4xl text-2xl">
          {t('partners.title')}
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-muted/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-muted/50 to-transparent z-10" />

        <motion.div
          className="flex gap-8 md:gap-12"
          animate={{ x: [0, -160 * partners.length] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" } }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center w-32 md:w-40 h-16 md:h-20 bg-white rounded-lg shadow-sm border border-border/50 px-4"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSlider;
