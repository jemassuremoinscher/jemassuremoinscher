import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, FileCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import logoNew from "@/assets/logo-new.png";

type ModalType = "mentions" | "cgu" | "confidentialite" | null;

const Footer = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const insuranceLinks = [
    { to: "/assurance-auto", label: "Assurance Auto" },
    { to: "/assurance-moto", label: "Assurance Moto" },
    { to: "/assurance-habitation", label: "Assurance Habitation" },
    { to: "/assurance-sante", label: "Mutuelle Santé" },
    { to: "/assurance-auto", label: "Assurance Jeune Conducteur" },
    { to: "/assurance-auto", label: "Assurance Malus" },
    { to: "/assurance-animaux", label: "Assurance Animaux" },
    { to: "/assurance-pret", label: "Assurance Prêt" },
    { to: "/assurance-vie", label: "Assurance Vie" },
    { to: "/assurance-prevoyance", label: "Prévoyance" },
    { to: "/assurance-rc-pro", label: "RC Professionnelle" },
    { to: "/assurance-pno", label: "Assurance PNO" },
  ];

  const trustBadges = [
    { icon: Lock, label: "Paiement Sécurisé" },
    { icon: Shield, label: "Données Protégées RGPD" },
    { icon: FileCheck, label: "Site Vérifié" },
  ];

  return (
    <>
      <footer className="bg-primary text-primary-foreground">
        {/* Zone 1: SEO Links */}
        <div className="border-b border-primary-foreground/10">
          <div className="container mx-auto px-4 py-10">
            <h3 className="text-lg font-bold mb-6 text-center">Nos Assurances</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {insuranceLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors py-2 px-3 rounded-lg hover:bg-primary-foreground/5 text-center"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Zone 2: Trust Badges */}
        <div className="border-b border-primary-foreground/10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-primary-foreground/80">
                  <badge.icon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
              <button
                onClick={() => setOpenModal("confidentialite")}
                className="text-sm text-accent hover:underline font-medium"
              >
                Charte de Confidentialité
              </button>
            </div>
          </div>
        </div>

        {/* Zone 3: Brand Identity */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center gap-4">
            <img
              src={logoNew}
              alt="Jemassuremoinscher.fr - Comparateur assurance moins chère"
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="text-xs text-primary-foreground/50 max-w-2xl leading-relaxed">
              Jemassuremoinscher.fr est un comparateur indépendant. Les tarifs affichés sont indicatifs et peuvent varier selon votre profil. 
              Ce site ne se substitue pas aux conseils d'un professionnel de l'assurance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-primary-foreground/40 mt-2">
              <button
                onClick={() => setOpenModal("mentions")}
                className="hover:text-accent transition-colors"
              >
                Mentions Légales
              </button>
              <span>•</span>
              <button
                onClick={() => setOpenModal("cgu")}
                className="hover:text-accent transition-colors"
              >
                CGU
              </button>
              <span>•</span>
              <button
                onClick={() => setOpenModal("confidentialite")}
                className="hover:text-accent transition-colors"
              >
                Confidentialité
              </button>
              <span>•</span>
              <Link to="/contact" className="hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-xs text-primary-foreground/40 mt-4">
              © {new Date().getFullYear()} Jemassuremoinscher.fr - Tous droits réservés
            </p>
          </div>
        </div>
      </footer>

      {/* Mentions Légales Modal */}
      <Dialog open={openModal === "mentions"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 backdrop-blur-sm bg-background/95">
          <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Mentions Légales</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <ScrollArea className="h-[60vh] px-6 pb-6">
            <div className="space-y-6 text-sm text-muted-foreground">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Éditeur du site</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Raison sociale :</strong> Jemassuremoinscher.fr</li>
                  <li><strong>Forme juridique :</strong> SAS au capital de 10 000€</li>
                  <li><strong>Siège social :</strong> Paris, France</li>
                  <li><strong>Email :</strong> contact@jemassuremoinscher.fr</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Directeur de la publication</h3>
                <p>Le directeur de la publication est le représentant légal de la société.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Hébergeur</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Nom :</strong> Lovable / Supabase</li>
                  <li><strong>Adresse :</strong> Services Cloud</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Propriété intellectuelle</h3>
                <p>L'ensemble du contenu de ce site (textes, images, logos, graphismes) est protégé par le droit d'auteur. Toute reproduction est interdite sans autorisation préalable.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">Responsabilité</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Les informations fournies sont à titre indicatif</li>
                  <li>Jemassuremoinscher.fr ne saurait être tenu responsable des erreurs ou omissions</li>
                  <li>Les tarifs affichés peuvent varier selon le profil de l'utilisateur</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
          <div className="p-6 pt-0">
            <Button onClick={() => setOpenModal(null)} className="w-full">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CGU Modal */}
      <Dialog open={openModal === "cgu"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 backdrop-blur-sm bg-background/95">
          <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Conditions Générales d'Utilisation</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confidentialité Modal */}
      <Dialog open={openModal === "confidentialite"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 backdrop-blur-sm bg-background/95">
          <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Politique de Confidentialité</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
