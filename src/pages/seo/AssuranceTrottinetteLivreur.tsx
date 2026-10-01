import { Bike, ShieldCheck, Euro, AlertTriangle, Briefcase } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const AssuranceTrottinetteLivreur = () => {
  const advantages = [
    {
      icon: Briefcase,
      title: "RC pro livreur obligatoire",
      description:
        "Pour Uber Eats, Deliveroo, Stuart : la RC vie privée ne suffit pas. Les plateformes exigent un contrat qui prévoit expressément la livraison.",
    },
    {
      icon: AlertTriangle,
      title: "Usage pro = exclusion fréquente",
      description:
        "Une assurance trottinette grand public exclut explicitement la livraison rémunérée. Souscrire une formule pro évite la nullité de garantie en cas de sinistre.",
    },
    {
      icon: Euro,
      title: "Dès 12 €/mois en pro",
      description:
        "Formules qui prévoient la livraison : RC pro + dommages + vol + arrêt de travail. Tarifs à partir de 12 €/mois selon le profil et la formule.",
    },
  ];

  const faqs = [
    {
      question: "Mon assurance trottinette perso couvre-t-elle la livraison Uber Eats ?",
      answer:
        "En général non : les contrats grand public excluent l'usage professionnel (par exemple, le document d'information d'un contrat du marché, 2025, exclut les tournées et la livraison de restauration rapide). En cas d'accident pendant une course, l'assureur peut refuser la garantie et vous laisser face à la responsabilité civile illimitée. Il faut un contrat qui prévoit expressément la livraison.",
    },
    {
      question: "Quelles garanties indispensables pour un livreur en trottinette électrique ?",
      answer:
        "Quatre garanties sont essentielles : (1) RC professionnelle livreur (dommages causés aux tiers en mission), (2) Individuelle conducteur (vos blessures + indemnités journalières en arrêt de travail), (3) Vol et casse de la trottinette (votre outil de travail), (4) Bris d'équipement (téléphone, sac isotherme, batterie additionnelle).",
    },
    {
      question: "Combien coûte une assurance trottinette livreur en 2026 ?",
      answer:
        "Comptez entre 12 € et 35 €/mois selon le profil et la formule : 12-18 € pour la RC pro, 20-28 € en formule intermédiaire (avec vol et individuelle), 30-35 € en tous risques avec indemnités journalières d'arrêt de travail. Les plateformes (Uber Eats, Deliveroo) imposent au minimum la RC pro.",
    },
    {
      question: "Les plateformes (Uber Eats, Deliveroo) fournissent-elles une assurance ?",
      answer:
        "Elles proposent une couverture minimale RC pendant la course active (du retrait à la livraison), mais elle est insuffisante : franchises élevées, pas de couverture des trajets entre commandes, pas d'indemnités d'arrêt de travail, pas de vol/casse de l'EDPM. Une assurance personnelle livreur reste indispensable.",
    },
    {
      question: "Que se passe-t-il si j'ai un accident sans assurance pro pendant une livraison ?",
      answer:
        "Conséquences : (1) Votre assurance perso refuse la prise en charge pour usage non déclaré, (2) Vous êtes personnellement responsable des dommages causés aux tiers (jusqu'à plusieurs centaines de milliers d'euros), (3) La plateforme peut désactiver votre compte, (4) Aucune indemnité journalière pendant votre arrêt de travail.",
    },
  ];

  const contentBody = `
    <p>Vous livrez en trottinette électrique pour <strong>Uber Eats, Deliveroo, Stuart ou Coursier.fr</strong> ? Votre assurance personnelle ne vous couvre pas. La livraison rémunérée est un <strong>usage professionnel</strong> qui exige un contrat qui prévoit expressément la livraison. Sans lui, un seul accident peut vous ruiner financièrement et vous faire perdre votre compte plateforme.</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, nos courtiers spécialisés mobilité urbaine professionnelle comparent les assureurs partenaires <strong>livreurs EDPM</strong> pour vous trouver la formule la moins chère et la plus adaptée à votre rythme (temps plein, temps partiel, étudiant complément).</p>

    <p><em>Pour un usage personnel, consultez notre guide <a href="/assurance-trottinette">assurance trottinette électrique</a>.</em></p>

    <h3>Pourquoi une assurance pro est obligatoire pour les livreurs en trottinette</h3>
    <p>L'usage professionnel d'un EDPM (Engin de Déplacement Personnel Motorisé) — trottinette, gyroroue, hoverboard — entre dans la catégorie des <strong>activités à risque aggravé</strong> pour les assureurs. Trois raisons :</p>
    <ul>
      <li><strong>Kilométrage élevé</strong> : un livreur parcourt en moyenne 80 à 150 km/semaine (vs 30 km pour un usager standard).</li>
      <li><strong>Conditions de circulation difficiles</strong> : pluie, nuit, sacs isothermes encombrants, créneaux serrés.</li>
      <li><strong>Tiers exposés</strong> : circulation dense en centre-ville, livraisons à pied jusqu'au client = risque RC démultiplié.</li>
    </ul>

    <h3>Les garanties spécifiques au livreur EDPM</h3>
    <p>Une bonne formule trottinette livreur doit inclure :</p>
    <ul>
      <li><strong>RC professionnelle livreur</strong> (obligatoire) : couvre les dommages causés à un piéton, un véhicule ou un client pendant une mission, jusqu'à 4,5 M€.</li>
      <li><strong>Individuelle conducteur renforcée</strong> : frais médicaux, indemnités journalières (15 à 40 €/jour d'arrêt de travail), invalidité, capital décès.</li>
      <li><strong>Vol et casse de la trottinette</strong> : votre outil de travail. Indemnisation à valeur d'achat si antivol agréé.</li>
      <li><strong>Bris d'équipement</strong> : smartphone (souvent à 400-1 000 €), sac isotherme, batterie additionnelle.</li>
    </ul>

    <h3>Équipement</h3>
    <p>Pour le sac isotherme et le reste du matériel, PAKERS, boutique spécialisée dans les sacs de livraison, détaille un kit de démarrage : <a href="https://pakers.co/blogs/guides-livreurs/kit-debutant-livreur-uber-eats-2026" target="_blank" rel="noopener">kit débutant livreur Uber Eats</a>.</p>

    <h3>Combien gagne réellement un livreur trottinette en 2026 ?</h3>
    <p>Avec une rémunération moyenne de 5 à 9 € par course et 3 à 6 courses/heure, un livreur trottinette gagne entre <strong>1 200 € et 2 800 €/mois</strong> selon l'intensité.</p>

    <h3>Auto-entrepreneur ou salarié : quel statut, quelle assurance ?</h3>
    <p>La grande majorité des livreurs sont en <strong>auto-entrepreneur</strong>. Dans ce cas, vous êtes votre propre patron et seul responsable de votre couverture. Aucune obligation légale d'avoir une assurance, mais sans elle, vous êtes personnellement engagé sur votre patrimoine. Pour les livreurs <strong>salariés</strong> (rare, mais existant chez certaines dark kitchens), l'employeur a une obligation de couverture professionnelle, mais elle exclut souvent les trajets domicile-zone.</p>

    <p>Notre cellule mobilité pro construit votre devis livreur EDPM en 2 minutes, avec une attestation envoyée par email après souscription, à présenter à votre plateforme. <strong>Comparez gratuitement et choisissez la formule adaptée à votre activité.</strong></p>
  `;

  return (
    <SEOLandingPage
      title="Assurance Trottinette Livreur Uber Eats / Deliveroo 2026"
      metaDescription="Assurance trottinette électrique livreur Uber Eats, Deliveroo, Stuart. RC pro obligatoire dès 12€/mois. Devis spécialiste EDPM en 2 min."
      keyword="assurance trottinette livreur"
      keywords="assurance livreur uber eats trottinette, assurance deliveroo edpm, RC pro livreur trottinette, assurance trottinette professionnelle"
      canonical="https://www.jemassuremoinscher.fr/assurance-trottinette-livreur"
      heroIcon={Briefcase}
      heroTitle="Assurance Trottinette Livreur : RC pro dès 12 €/mois"
      heroSubtitle="Uber Eats, Deliveroo, Stuart : votre assurance perso ne couvre pas la livraison rémunérée. Spécialiste EDPM pro, devis en 2 minutes."
      ctaLabel="Comparer les offres livreur"
      ctaLink="/comparateur"
      contentTitle="Assurance trottinette pour livreur Uber Eats, Deliveroo, Stuart"
      contentBody={contentBody}
      advantages={advantages}
      faqTitle="FAQ – Assurance Trottinette Livreur"
      faqs={faqs}
      breadcrumbs={[
        { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
        { name: "Assurance Trottinette Livreur", url: "https://www.jemassuremoinscher.fr/assurance-trottinette-livreur" },
      ]}
      bottomCtaTitle="Roulez pro dès aujourd'hui"
      bottomCtaDescription="Devis assurance livreur EDPM en 2 minutes — attestation par email pour votre plateforme."
      bottomCtaLabel="Obtenir mon devis livreur"
      bottomCtaLink="/comparateur"
    />
  );
};


export default AssuranceTrottinetteLivreur;
