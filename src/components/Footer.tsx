import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, FileCheck, X, BadgeCheck, ShieldCheck, Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import arthurRunning from "@/assets/mascotte/arthur-running.webp";
import CrossSiteLinks from '@/components/CrossSiteLinks';
import BarometreOptin from '@/components/BarometreOptin';

type ModalType = "mentions" | "cgu" | "confidentialite" | null;

const Footer = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const { t } = useLanguage();

  const insuranceLinks = [
    { to: "/assurance-auto", label: t('footer.autoInsurance') },
    { to: "/assurance-moto", label: t('footer.motoInsurance') },
    { to: "/assurance-trottinette", label: t('footer.trottinetteInsurance') },
    { to: "/assurance-habitation", label: t('footer.homeInsurance') },
    { to: "/assurance-sante", label: t('footer.healthInsurance') },
    { to: "/assurance-animaux", label: t('footer.petInsurance') },
    { to: "/assurance-vie", label: t('footer.lifeInsurance') },
    { to: "/assurance-pret", label: t('footer.loanInsurance') },
    { to: "/assurance-prevoyance", label: t('footer.prevoyanceInsurance') },
    { to: "/assurance-rc-pro", label: t('footer.rcProInsurance') },
    { to: "/assurance-mrp", label: t('footer.mrpInsurance') },
    { to: "/assurance-pno", label: t('footer.pnoInsurance') },
    { to: "/assurance-gli", label: t('footer.gliInsurance') },
  ];

  const guidesLinks = [
    { to: "/blog", label: t('footer.linkAllGuides') },
    { to: "/comparatif", label: t('footer.linkComparators') },
    { to: "/profil", label: t('footer.linkProfiles') },
    { to: "/glossaire", label: t('footer.linkGlossary') },
    { to: "/outils/calculateur-bonus-malus", label: t('footer.linkBonusMalus') },
    { to: "/profil/resilie-non-paiement", label: t('footer.linkResiliated') },
    { to: "/profil/retrait-permis", label: t('footer.linkLicenseLoss') },
    { to: "/blog/loi-hamon-2026-resilier-assurance-3-clics", label: t('footer.linkLawHamon') },
    { to: "/blog/loi-lemoine-2026", label: t('footer.linkLawLemoine') },
    { to: "/blog/guide-choisir-assurance-auto-2026", label: t('footer.linkAutoGuide') },
  ];

  const aboutLinks = [
    { to: "/qui-sommes-nous", label: t('footer.linkWhoWeAre') },
    { to: "/contact", label: t('footer.contact') },
    { to: "/sources-et-methodologie", label: t('footer.linkSourcesMethod') },
    { to: "/mentions-legales", label: t('footer.legal') },
    { to: "/politique-confidentialite", label: t('footer.privacyPolicy') },
    { to: "/cgu", label: t('footer.terms') },
    { to: "/plan-du-site", label: t('footer.sitemap') },
  ];

  return (
    <>
      <footer className="bg-primary text-primary-foreground">
        {/* Zone 1: 4-column grid */}
        <div className="border-b border-primary-foreground/10">
          <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {/* Col 1: Nos Assurances */}
              <nav aria-label={t('footer.colInsurances')}>
                <h3 className="text-sm font-bold text-accent uppercase tracking-wide mb-4">
                  {t('footer.colInsurances')}
                </h3>
                <ul className="space-y-2">
                  {insuranceLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-xs text-primary-foreground/60 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Col 2: Guides & Conseils */}
              <nav aria-label={t('footer.colGuides')}>
                <h3 className="text-sm font-bold text-accent uppercase tracking-wide mb-4">
                  {t('footer.colGuides')}
                </h3>
                <ul className="space-y-2">
                  {guidesLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-xs text-primary-foreground/60 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Col 3: À propos */}
              <nav aria-label={t('footer.colAbout')}>
                <h3 className="text-sm font-bold text-accent uppercase tracking-wide mb-4">
                  {t('footer.colAbout')}
                </h3>
                <ul className="space-y-2">
                  {aboutLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-xs text-primary-foreground/60 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Col 4: Informations Légales + Baromètre optin */}
              <div>
                <h3 className="text-sm font-bold text-accent uppercase tracking-wide mb-4">
                  {t('footer.colLegal')}
                </h3>
                <div className="space-y-3 mb-5">
                  <p className="text-xs text-primary-foreground/50 leading-relaxed">
                    {t('footer.legalMandatoryNotice')}
                  </p>
                  <p className="text-xs text-primary-foreground/50 leading-relaxed">
                    {t('footer.legalRatesNotice')}
                  </p>
                </div>
                <BarometreOptin variant="compact" source="footer" />
              </div>
            </div>
          </div>
        </div>

        {/* Zone 2: Brand + Mascotte */}
        <div className="border-b border-primary-foreground/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col items-center text-center gap-3">
              <img
                src={arthurRunning}
                alt={t('footer.mascotAlt')}
                className="h-14 w-auto"
                width={176}
                height={220}
                loading="lazy"
                decoding="async"
              />
              <p className="text-xs text-primary-foreground/40 max-w-2xl leading-relaxed">
                {t('footer.disclaimer')}
              </p>
              <nav aria-label={t('footer.socialLabel')} className="flex items-center justify-center gap-4 pt-1">
                <a href="https://www.instagram.com/jemassuremoinscher/" target="_blank" rel="noopener noreferrer" aria-label={t('footer.followInstagram')} className="text-primary-foreground/50 hover:text-accent transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://www.linkedin.com/company/jemassuremoinscher" target="_blank" rel="noopener noreferrer" aria-label={t('footer.followLinkedIn')} className="text-primary-foreground/50 hover:text-accent transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="https://www.facebook.com/jemassuremoinscher" target="_blank" rel="noopener noreferrer" aria-label={t('footer.followFacebook')} className="text-primary-foreground/50 hover:text-accent transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              </nav>
              <a
                href="https://g.page/r/CVVFJisN4h4iEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-foreground/60 hover:text-accent transition-colors"
              >
                {t('footer.leaveGoogleReview')}
              </a>
            </div>
          </div>
        </div>

                <CrossSiteLinks />
        {/* Zone 3: Trust bar — paiement sécurisé + SSL */}
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-5">
              <div className="flex items-center gap-1.5 text-primary-foreground/60">
                <Lock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="text-[11px] font-medium">{t('footer.trustSecurePayment')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary-foreground/60">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="text-[11px] font-medium">{t('footer.trustSSL')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary-foreground/60">
                <Shield className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="text-[11px] font-medium">{t('footer.trustGDPR')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary-foreground/60">
                <BadgeCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="text-[11px] font-medium">{t('footer.trustOrias')}</span>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <p className="text-[11px] text-primary-foreground/30 text-center mt-4">
            © {new Date().getFullYear()} <span className="text-primary-foreground/50">jemassure</span><span className="text-accent">moinscher</span><span className="text-primary-foreground/50">.fr</span> — {t('footer.rights')}
          </p>
        </div>
      </footer>

      {/* Mentions Légales Modal */}
      <Dialog open={openModal === "mentions"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 backdrop-blur-sm bg-background/95">
          <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{t('footer.legal')}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t("a11y.footer.closeLegal")}>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <ScrollArea className="h-[60vh] px-6 pb-6">
            <div className="space-y-6 text-sm text-muted-foreground">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Éditeur du site</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Raison sociale :</strong> ARPV (jemassuremoinscher.fr)</li>
                  <li><strong>Forme juridique :</strong> SAS au capital de 10 000 €</li>
                  <li><strong>Siège social :</strong> 2, rue d'Angleterre 06000 Nice</li>
                  <li><strong>SIRET :</strong> 105 387 278 00010</li>
                  <li><strong>RCS :</strong> RCS Nice 105 387 278</li>
                  <li><strong>TVA intracommunautaire :</strong> FR46105387278</li>
                  <li><strong>Email :</strong> contact@jemassuremoinscher.fr</li>
                </ul>
                <CrossSiteLinks />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Propriété intellectuelle</h3>
                <p>L'ensemble du contenu de ce site (textes, images, logos, graphismes) est protégé par le droit d'auteur. Toute reproduction est interdite sans autorisation préalable.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Responsabilité</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Les informations fournies sont à titre indicatif</li>
                  <li>jemassuremoinscher.fr ne saurait être tenu responsable des erreurs ou omissions</li>
                  <li>Les tarifs affichés peuvent varier selon le profil de l'utilisateur</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
          <div className="p-6 pt-0">
            <Button onClick={() => setOpenModal(null)} className="w-full">
              {t('common.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CGU Modal */}
      <Dialog open={openModal === "cgu"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 backdrop-blur-sm bg-background/95">
          <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{t('footer.terms')}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t("a11y.footer.closeCgu")}>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <ScrollArea className="h-[60vh] px-6 pb-6">
            <div className="space-y-6 text-sm text-muted-foreground">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Article 1 - Objet</h3>
                <p>Les présentes CGU régissent l'utilisation du site jemassuremoinscher.fr, service de comparaison d'assurances en ligne gratuit.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Article 2 - Accès au service</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Le service est accessible gratuitement à tout utilisateur</li>
                  <li>L'utilisateur garantit l'exactitude des informations fournies</li>
                  <li>L'accès peut être suspendu pour maintenance</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Article 3 - Service de comparaison</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Notre comparateur analyse les offres de nos partenaires assureurs</li>
                  <li>Les résultats sont présentés de manière objective et transparente</li>
                  <li>Aucune obligation de souscrire n'est imposée</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Article 4 - Responsabilité</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Le site fournit des informations à titre indicatif</li>
                  <li>L'utilisateur reste seul responsable de ses choix d'assurance</li>
                  <li>Il est conseillé de lire les conditions générales des contrats</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Article 5 - Données personnelles</h3>
                <p>Les données collectées sont traitées conformément au RGPD. Consultez notre politique de confidentialité pour plus de détails.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Article 6 - Modifications</h3>
                <p>Jemassuremoinscher.fr se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications importantes.</p>
              </div>
            </div>
          </ScrollArea>
          <div className="p-6 pt-0">
            <Button onClick={() => setOpenModal(null)} className="w-full">
              {t('common.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confidentialité Modal */}
      <Dialog open={openModal === "confidentialite"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 backdrop-blur-sm bg-background/95">
          <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{t('footer.privacy')}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t("a11y.footer.closePrivacy")}>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <ScrollArea className="h-[60vh] px-6 pb-6">
            <div className="space-y-6 text-sm text-muted-foreground">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Collecte des données</h3>
                <p>Nous collectons uniquement les données nécessaires au bon fonctionnement du service :</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Données d'identification :</strong> nom, prénom, email, téléphone</li>
                  <li><strong>Données de profil :</strong> informations pour établir un devis</li>
                  <li><strong>Données de navigation :</strong> cookies techniques et analytiques</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Utilisation des données</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Fournir des devis d'assurance personnalisés</li>
                  <li>Améliorer nos services et l'expérience utilisateur</li>
                  <li>Vous contacter pour le suivi de votre demande</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Vos droits (RGPD)</h3>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Droit d'accès :</strong> consulter vos données personnelles</li>
                  <li><strong>Droit de rectification :</strong> corriger vos informations</li>
                  <li><strong>Droit à l'effacement :</strong> supprimer vos données</li>
                  <li><strong>Droit à la portabilité :</strong> récupérer vos données</li>
                  <li><strong>Droit d'opposition :</strong> refuser certains traitements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Sécurité</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
                  <li>Stockage sécurisé sur serveurs européens</li>
                  <li>Accès restreint aux données personnelles</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Contact</h3>
                <p>Pour exercer vos droits ou toute question relative à vos données :</p>
                <p className="mt-2"><strong>Email :</strong> contact@jemassuremoinscher.fr</p>
              </div>
            </div>
          </ScrollArea>
          <div className="p-6 pt-0">
            <Button onClick={() => setOpenModal(null)} className="w-full">
              {t('common.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
