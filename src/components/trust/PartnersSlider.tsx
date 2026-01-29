import { motion } from "framer-motion";
const PartnersSlider = () => {
  // Generic partner logos - will be replaced with real ones later
  const partners = [{
    name: "Assur1",
    id: 1
  }, {
    name: "Assur2",
    id: 2
  }, {
    name: "Assur3",
    id: 3
  }, {
    name: "Assur4",
    id: 4
  }, {
    name: "Assur5",
    id: 5
  }, {
    name: "Assur6",
    id: 6
  }, {
    name: "Assur7",
    id: 7
  }, {
    name: "Assur8",
    id: 8
  }];

  // Duplicate for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];
  return <section className="py-8 md:py-12 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-[#340e5d] font-bold md:text-4xl text-2xl">Nos partenaires</p>
      </div>

      {/* Infinite Slider */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-muted/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-muted/50 to-transparent z-10" />

        <motion.div className="flex gap-8 md:gap-12" animate={{
        x: [0, -50 * partners.length * 2]
      }} transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear"
        }
      }}>
          {duplicatedPartners.map((partner, index) => <div key={`${partner.id}-${index}`} className="flex-shrink-0 flex items-center justify-center w-24 md:w-32 h-12 md:h-16 bg-white rounded-lg shadow-sm border border-border/50 px-4">
              <span className="text-sm md:text-base font-semibold text-muted-foreground">
                {partner.name}
              </span>
            </div>)}
        </motion.div>
      </div>
    </section>;
};
export default PartnersSlider;