import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

import abeilleLogo from "@/assets/logos/abeille.jpg";
import acheelLogo from "@/assets/logos/acheel.png";
import agfLogo from "@/assets/logos/agf.png";
import alanLogo from "@/assets/logos/alan-new.png";
import allianzLogo from "@/assets/logos/allianz.webp";
import amaguizLogo from "@/assets/logos/amaguiz.jpg";
import aonLogo from "@/assets/logos/aon.jpg";
import aprilLogo from "@/assets/logos/april-new.png";
import axaLogo from "@/assets/logos/axa.webp";
import directAssuranceLogo from "@/assets/logos/direct-assurance-new.png";
import ganLogo from "@/assets/logos/gan.svg";
import generaliLogo from "@/assets/logos/generali.jpg";
import gmfLogo from "@/assets/logos/gmf-new.png";
import leocareLogo from "@/assets/logos/leocare.png";
import lolivierLogo from "@/assets/logos/lolivier.png";
import maafLogo from "@/assets/logos/maaf.webp";
import macifLogo from "@/assets/logos/macif-new.png";
import maifLogo from "@/assets/logos/maif.webp";
import matmutLogo from "@/assets/logos/matmut-new.jpg";
import maxanceLogo from "@/assets/logos/maxance.png";
import milaLogo from "@/assets/logos/mila.jpg";
import mmaLogo from "@/assets/logos/mma-new.webp";
import mpaLogo from "@/assets/logos/mpa.png";
import neoLogo from "@/assets/logos/neo.png";
import ornikarLogo from "@/assets/logos/ornikar.png";
import swissLifeLogo from "@/assets/logos/swisslife.webp";
import wilovLogo from "@/assets/logos/wilov.jpg";

const PartnersSlider = () => {
  const { t } = useLanguage();
  const partners = [
    { name: "Abeille Assurances", id: 1, logo: abeilleLogo },
    { name: "Acheel", id: 2, logo: acheelLogo },
    { name: "AGF", id: 3, logo: agfLogo },
    { name: "Alan", id: 4, logo: alanLogo },
    { name: "Allianz", id: 5, logo: allianzLogo },
    { name: "Amaguiz", id: 6, logo: amaguizLogo },
    { name: "AON", id: 7, logo: aonLogo },
    { name: "April", id: 8, logo: aprilLogo },
    { name: "AXA", id: 9, logo: axaLogo },
    { name: "Direct Assurance", id: 10, logo: directAssuranceLogo },
    { name: "GAN", id: 11, logo: ganLogo },
    { name: "Generali", id: 12, logo: generaliLogo },
    { name: "GMF", id: 13, logo: gmfLogo },
    { name: "Leocare", id: 14, logo: leocareLogo },
    { name: "L'Olivier", id: 15, logo: lolivierLogo },
    { name: "MAAF", id: 16, logo: maafLogo },
    { name: "MACIF", id: 17, logo: macifLogo },
    { name: "MAIF", id: 18, logo: maifLogo },
    { name: "Matmut", id: 19, logo: matmutLogo },
    { name: "Maxance", id: 20, logo: maxanceLogo },
    { name: "Mila", id: 21, logo: milaLogo },
    { name: "MMA", id: 22, logo: mmaLogo },
    { name: "Mutuelle de Poitiers", id: 23, logo: mpaLogo },
    { name: "Neo Assurances", id: 24, logo: neoLogo },
    { name: "Ornikar", id: 25, logo: ornikarLogo },
    { name: "SwissLife", id: 26, logo: swissLifeLogo },
    { name: "Wilov", id: 27, logo: wilovLogo },
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
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 50, ease: "linear" } }}
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
