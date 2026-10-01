import { Phone, AlertTriangle, Briefcase } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const AssuranceTrottinetteLivreur = () => {
  const advantages = [
    {
      icon: Briefcase,
      title: "Un contrat qui prévoit la livraison",
      description:
        "Pour Uber Eats, Deliveroo, Stuart : la responsabilité civile d'un contrat grand public ne couvre pas l'usage professionnel. Il faut un contrat qui prévoit expressément la livraison.",
    },
    {
      icon: AlertTriangle,
      title: "Usage pro = exclusion fréquente",
      description:
        "Une assurance trottinette grand public exclut explicitement la livraison rémunérée. Souscrire une formule pro évite la nullité de garantie en cas de sinistre.",
    },
    {
      icon: Phone,
      title: "Un conseiller vous présente le contrat",
      description:
        "Demandez votre devis : un conseiller vous présente les garanties et exclusions du contrat.",
    },
  ];

  const faqs = [
    {
      question: "Mon assurance trottinette perso couvre-t-elle la livraison Uber Eats ?",
      answer:
        "En général non : les contrats grand public excluent l'usage professionnel (par exemple, le document d'information d'un contrat du marché, 2025, exclut les tournées et la livraison de restauration rapide). En cas d'accident pendant une course, l'assureur peut refuser la garantie et vous laisser face à la responsabilité civile illimitée. Il faut un contrat qui prévoit expressément la livraison.",
    },
    {
      question: "Que vérifier dans un contrat professionnel de livreur en trottinette ?",
      answer:
        "Vérifiez que l'usage professionnel et la livraison sont mentionnés expressément, puis regardez la responsabilité civile professionnelle, l'individuelle accident (vos propres blessures), la protection juridique, le matériel transporté et les exclusions.",
    },
    {
      question: "Combien coûte une assurance trottinette livreur ?",
      answer:
        "Le prix dépend de votre profil et du contrat. Demandez votre devis : un conseiller vous présente les garanties et exclusions du contrat.",
    },
    {
      question: "Les plateformes (Uber Eats, Deliveroo) fournissent-elles une assurance ?",
      answer:
        "Certaines plateformes proposent une couverture pendant les courses. Vérifiez auprès de la vôtre ce qu'elle couvre réellement (période couverte, franchises, vos propres blessures, votre engin) avant de vous en contenter.",
    },
    {
      question: "Que se passe-t-il si j'ai un accident sans assurance pro pendant une livraison ?",
      answer:
        "Votre assurance personnelle peut refuser la prise en charge pour usage non déclaré, et vous restez personnellement responsable des dommages causés aux tiers.",
    },
  ];

  const contentBody = `
    <p>Vous livrez en trottinette électrique pour <strong>Uber Eats, Deliveroo, Stuart ou Coursier.fr</strong> ? Votre assurance personnelle ne vous couvre pas. La livraison rémunérée est un <strong>usage professionnel</strong> qui exige un contrat qui prévoit expressément la livraison. Sans lui, un seul accident peut vous ruiner financièrement et vous faire perdre votre compte plateforme.</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, un conseiller étudie votre demande et consulte les assureurs adaptés à votre activité de livraison (temps plein, temps partiel, complément d'activité).</p>

    <p><em>Pour un usage personnel, consultez notre guide <a href="/assurance-trottinette">assurance trottinette électrique</a>.</em></p>

    <h3>Pourquoi une assurance pro est obligatoire pour les livreurs en trottinette</h3>
    <p>L'usage professionnel d'un EDPM (Engin de Déplacement Personnel Motorisé) — trottinette, gyroroue, hoverboard — entre dans la catégorie des <strong>activités à risque aggravé</strong> pour les assureurs. Trois raisons :</p>
    <ul>
      <li><strong>Kilométrage élevé</strong> : un livreur roule beaucoup plus qu'un usager occasionnel.</li>
      <li><strong>Conditions de circulation difficiles</strong> : pluie, nuit, sacs isothermes encombrants, créneaux serrés.</li>
      <li><strong>Tiers exposés</strong> : circulation dense en centre-ville, livraisons à pied jusqu'au client = risque RC démultiplié.</li>
    </ul>

    <h3>Les points à vérifier dans un contrat professionnel</h3>
    <ul>
      <li><strong>Usage professionnel et livraison</strong> : ils doivent être mentionnés expressément dans le contrat.</li>
      <li><strong>Responsabilité civile professionnelle</strong> : les dommages causés à des tiers pendant vos livraisons.</li>
      <li><strong>Individuelle accident</strong> : vos propres blessures, que la responsabilité civile ne couvre pas.</li>
      <li><strong>Protection juridique</strong> : l'accompagnement en cas de litige après un accident.</li>
      <li><strong>Matériel transporté</strong> : ce qui est couvert et ce qui ne l'est pas.</li>
      <li><strong>Exclusions</strong> : à lire avant de signer.</li>
    </ul>

    <h2 id="equipement">Équipement</h2>
    <p>Pour le sac isotherme et le reste du matériel, PAKERS, boutique spécialisée dans les sacs de livraison, détaille un kit de démarrage : <a href="https://pakers.co/blogs/guides-livreurs/kit-debutant-livreur-uber-eats-2026" target="_blank" rel="noopener" class="text-primary font-medium underline underline-offset-2">kit débutant livreur Uber Eats de PAKERS</a>.</p>

    <h3>Auto-entrepreneur ou salarié : quel statut, quelle assurance ?</h3>
    <p>La grande majorité des livreurs sont en <strong>auto-entrepreneur</strong>. Dans ce cas, vous êtes votre propre patron et seul responsable de votre couverture. La responsabilité civile reste obligatoire pour toute trottinette électrique (assimilée à un véhicule terrestre à moteur, service-public.gouv.fr), et elle doit couvrir votre usage professionnel. Pour les livreurs <strong>salariés</strong> (rare, mais existant chez certaines dark kitchens), l'employeur a une obligation de couverture professionnelle, mais elle exclut souvent les trajets domicile-zone.</p>

    <p><strong>Demandez votre devis : un conseiller vous présente les garanties et exclusions du contrat.</strong></p>
  `;

  return (
    <SEOLandingPage
      title="Assurance Trottinette Livreur Uber Eats / Deliveroo 2026"
      metaDescription="Assurance trottinette électrique livreur Uber Eats, Deliveroo, Stuart : il faut un contrat qui prévoit la livraison. Un conseiller vous présente garanties et exclusions."
      keyword="assurance trottinette livreur"
      keywords="assurance livreur uber eats trottinette, assurance deliveroo edpm, RC pro livreur trottinette, assurance trottinette professionnelle"
      canonical="https://www.jemassuremoinscher.fr/assurance-trottinette-livreur"
      heroIcon={Briefcase}
      heroTitle="Assurance Trottinette Livreur : un contrat qui couvre la livraison"
      heroSubtitle="Uber Eats, Deliveroo, Stuart : votre assurance perso ne couvre pas la livraison rémunérée. Demandez votre devis, un conseiller vous présente le contrat."
      ctaLabel="Comparer les offres livreur"
      ctaLink="/comparateur?type=trottinette&usage=livreur&source_page=/assurance-trottinette-livreur"
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
      bottomCtaDescription="Demandez votre devis : un conseiller vous présente les garanties et exclusions du contrat."
      bottomCtaLabel="Obtenir mon devis livreur"
      bottomCtaLink="/comparateur?type=trottinette&usage=livreur&source_page=/assurance-trottinette-livreur"
    />
  );
};


export default AssuranceTrottinetteLivreur;
