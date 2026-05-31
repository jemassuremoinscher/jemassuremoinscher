import { Star, Scale, BadgeCheck, TrendingUp } from "lucide-react";
import { motion, useReducedMotion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

import oriasLogo from "@/assets/logos/orias.jpg";
import arthurKarting from "@/assets/mascotte/arthur-karting.webp";
import geoContent from "@/data/geo-content.json";

// Compteur familles accompagnées : démarre au 1er janvier 2026 (date de
// création de jemassuremoinscher.fr) à 0, + 4 nouvelles familles par jour.
const FAMILIES_BASELINE = 0;
const FAMILIES_PER_DAY = 4;
const FAMILIES_SINCE = new Date("2026-01-01T00:00:00");
const computeFamiliesTotal = () => {
  const now = new Date();
  const days = Math.max(0, Math.floor((now.getTime() - FAMILIES_SINCE.getTime()) / 86400000));
  return FAMILIES_BASELINE + days * FAMILIES_PER_DAY;
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const arthurVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 180, damping: 14, delay: 0.4 },
  },
};

const TrustRow = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const arthurReveal = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
    : arthurVariants;
  const arthurFloat = prefersReducedMotion
    ? undefined
    : { x: [0, 4, 0, -4, 0] };

  // Compteur "familles accompagnées" (baseline + +4/jour)
  const [familiesCount, setFamiliesCount] = useState<number>(computeFamiliesTotal());
  const counterRef = useRef<HTMLDivElement>(null);
  const counterInView = useInView(counterRef, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.floor(v).toLocaleString('fr-FR'));
  const [displayCount, setDisplayCount] = useState("0");

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplayCount(v));
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    const interval = setInterval(() => setFamiliesCount(computeFamiliesTotal()), 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!counterInView) return;
    if (prefersReducedMotion) {
      motionVal.set(familiesCount);
      return;
    }
    const controls = animate(motionVal, familiesCount, { duration: 2, ease: "easeOut" });
    return () => controls.stop();
  }, [counterInView, familiesCount, prefersReducedMotion, motionVal]);

  const handleArthurClick = () => {
    const target = document.getElementById('hero-quote-form') || document.getElementById('quote-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = target.querySelector<HTMLElement>('input, select, textarea, button');
      firstInput?.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear(); void currentYear;

  return (
    <section className="py-12 md:py-16 bg-muted/40" aria-label={t('trustRow.sectionLabel')}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {/* Google Reviews */}
          <motion.div variants={itemVariants} role="group" aria-label={`Note Google Reviews ${geoContent.trust.ratingValueLabel} sur 5 basée sur ${geoContent.trust.reviewCountLabel} avis vérifiés`} className="bg-card rounded-3xl p-6 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] border border-border/40 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Logo Google Reviews avec note ${geoContent.trust.ratingValueLabel} étoiles et ${geoContent.trust.reviewCountLabel} avis vérifiés`}>
              <title>{`Logo Google Reviews avec note ${geoContent.trust.ratingValueLabel} étoiles et ${geoContent.trust.reviewCountLabel} avis vérifiés`}</title>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div className="flex items-center gap-1" aria-hidden="true">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-3xl font-black text-foreground">{geoContent.trust.ratingValueLabel}<span className="text-lg text-muted-foreground">/5</span></p>
            <p className="text-xs text-muted-foreground">{t('trustRow.googleReviewsSuffix', { count: geoContent.trust.reviewCountLabel })}</p>
          </motion.div>

          {/* ORIAS */}
          <motion.div variants={itemVariants} role="group" aria-label={t("a11y.trust.orias")} className="bg-card rounded-3xl p-6 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] border border-border/40 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3">
            <img
              src={oriasLogo}
              alt="Logo ORIAS"
              className="h-10 w-auto object-contain"
              width={120}
              height={40}
              loading="lazy"
              decoding="async"
            />
            <p className="text-sm font-bold text-foreground">{t('whyUs.oriasRegistered')}</p>
            <p className="text-xs font-mono text-primary font-semibold">{t('whyUs.oriasNumber')}</p>
            <a href="https://www.orias.fr" target="_blank" rel="noopener noreferrer" aria-label={t("a11y.trust.oriasVerify")} className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">
              {t('whyUs.verifyOrias')}
            </a>
          </motion.div>

          {/* Courtier Indépendant */}
          <motion.div variants={itemVariants} role="group" aria-label={t("a11y.trust.independent")} className="bg-card rounded-3xl p-6 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] border border-border/40 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/10" aria-hidden="true">
              <Scale className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">{t('trustRow.independent')}</p>
            <p className="text-xs text-muted-foreground">{t('trustRow.independentDesc')}</p>
          </motion.div>

          {/* Transparence Totale */}
          <motion.div variants={itemVariants} role="group" aria-label={t("a11y.trust.transparent")} className="bg-card rounded-3xl p-6 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] border border-border/40 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/10" aria-hidden="true">
              <BadgeCheck className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">{t('trustRow.transparency')}</p>
            <p className="text-xs text-muted-foreground">{t('trustRow.transparencyDesc')}</p>
          </motion.div>

          {/* Rappel 5 min - Arthur Karting (clickable) */}
          <motion.button
            type="button"
            onClick={handleArthurClick}
            variants={arthurReveal}
            whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            aria-label={t('trustRow.callbackAria')}
            className="col-span-2 md:col-span-1 lg:col-span-1 bg-primary rounded-3xl p-6 shadow-[0_4px_16px_-6px_rgba(124,58,237,0.3)] hover:shadow-[0_16px_32px_-10px_rgba(124,58,237,0.6)] transition-shadow border border-primary-foreground/10 flex flex-col items-center text-center gap-3 relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            <motion.img
              src={arthurKarting}
              alt=""
              aria-hidden="true"
              className="h-10 w-auto object-contain drop-shadow-lg"
              loading="lazy"
              decoding="async"
              animate={arthurFloat}
              transition={prefersReducedMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="text-sm font-bold text-white">{t('trustRow.callback')}</p>
            <p className="text-xs text-white/90">{t('trustRow.callbackDesc')}</p>
          </motion.button>

          {/* Compteur familles accompagnées (total cumulé) */}
          <motion.div
            ref={counterRef}
            variants={itemVariants}
            role="group"
            aria-label={`${familiesCount.toLocaleString('fr-FR')} familles accompagnées par jemassuremoinscher.fr`}
            className="col-span-2 md:col-span-1 lg:col-span-1 bg-gradient-to-br from-accent/95 to-accent rounded-3xl p-6 shadow-[0_4px_16px_-6px_rgba(252,211,77,0.4)] hover:shadow-[0_16px_32px_-10px_rgba(252,211,77,0.6)] hover:-translate-y-1 transition-all border border-accent-foreground/10 flex flex-col items-center text-center gap-3 relative overflow-hidden"
          >
            <div className="p-3 rounded-full bg-primary/15" aria-hidden="true">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <p className="text-3xl font-black text-primary tabular-nums leading-none">
              {displayCount}+
            </p>
            <p className="text-xs font-bold text-primary/90 uppercase tracking-wide">Familles accompagnées</p>
            <p className="text-[11px] text-primary/70 leading-snug">Depuis la création de jemassuremoinscher.fr</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustRow;
