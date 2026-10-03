import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Sections réglementaires de /assurance-trottinette (décision de Paul du
 * 3 octobre 2026). Chaque affirmation reprend une fiche Service-Public.fr lue
 * le 3 octobre 2026 : aucun prix, aucun classement, aucune garantie présentée
 * comme incluse en dehors du tableau de garanties de la page. Les fiches sont
 * listées dans la section « Sources » (TrottinetteSources) et citées dans le
 * schema WebPage.citation de AssuranceTrottinette.tsx.
 */
export const TROTTINETTE_SOURCES_CONSULTED = "3 octobre 2026";

export const TROTTINETTE_SOURCES = [
  {
    id: "F34829",
    title: "Amende forfaitaire en cas de délit de conduite sans assurance",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F34829",
    verified: "13 mars 2026",
  },
  {
    id: "F308",
    title: "Circulation à trottinette électrique, hoverboard, gyropode, rollers ou skateboard",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F308",
    verified: "11 août 2026",
  },
  {
    id: "F2697",
    title: "Doit-on s'assurer lorsqu'on circule à vélo ou en trottinette électrique ?",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2697",
    verified: "13 novembre 2025",
  },
  {
    id: "F1435",
    title: "Porter plainte",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1435",
    verified: "8 juillet 2026",
  },
] as const;

type SourceId = (typeof TROTTINETTE_SOURCES)[number]["id"];

const SourceLine = ({ ids }: { ids: SourceId[] }) => (
  <p className="text-xs text-muted-foreground/80 mt-3">
    Source{ids.length > 1 ? "s" : ""} : Service-Public.fr,{" "}
    {ids.map((id, i) => (
      <span key={id}>
        {i > 0 && (i === ids.length - 1 ? " et " : ", ")}
        <a href="#trottinette-sources" className="hover:underline">fiche {id}</a>
      </span>
    ))}
    .
  </p>
);

const h2 = "text-2xl md:text-3xl font-bold text-foreground mb-4";
const p = "text-muted-foreground leading-relaxed";
const ul = "text-muted-foreground leading-relaxed list-disc pl-5 space-y-2";

const TrottinetteGuide = ({ onCtaClick }: { onCtaClick: () => void }) => (
  <>
    <section className="max-w-4xl mx-auto mb-12" aria-labelledby="trottinette-obligation">
      <h2 id="trottinette-obligation" className={h2}>Assurance obligatoire : ce que vous risquez sans contrat</h2>
      <p className={p}>
        La trottinette électrique est un <strong>engin de déplacement personnel motorisé (EDPM)</strong>, assimilé à un véhicule terrestre à moteur : une <strong>assurance responsabilité civile est obligatoire</strong>, même si sa vitesse est limitée à 25 km/h. Elle indemnise les dommages que vous causez à d'autres personnes, par exemple la blessure d'un piéton ou les dégâts sur un autre véhicule.
      </p>
      <p className={`${p} mt-3`}>
        Mettre ou maintenir en circulation un véhicule terrestre à moteur sans assurance est un <strong>délit</strong>, puni d'une amende pouvant aller jusqu'à <strong>3 750 €</strong>. Le véhicule peut être immobilisé et mis en fourrière, et des peines complémentaires sont prévues, dont la confiscation du véhicule si vous en êtes propriétaire.
      </p>
      <p className={`${p} mt-3`}>
        Sous conditions (notamment une première infraction, commise par une personne majeure et constatée après interception), le délit peut être sanctionné par une <strong>amende forfaitaire de 750 €</strong> : 500 €, augmentés de 50 % au profit du Fonds de garantie de l'assurance obligatoire de dommages (FGAO). Elle est ramenée à <strong>600 €</strong> en cas de paiement immédiat ou dans les 15 jours (30 jours par télépaiement).
      </p>
      <SourceLine ids={["F2697", "F308", "F34829"]} />
    </section>

    <section className="max-w-4xl mx-auto mb-12" aria-labelledby="trottinette-circulation">
      <h2 id="trottinette-circulation" className={h2}>Où et comment circuler : les règles à connaître</h2>
      <ul className={ul}>
        <li><strong>Âge minimum : 14 ans.</strong> Vitesse maximale : 25 km/h. Une seule personne à bord, sous peine d'une amende de 135 €.</li>
        <li><strong>En agglomération</strong>, la piste cyclable est obligatoire lorsqu'elle existe. À défaut, vous pouvez rouler sur les routes limitées à 50 km/h, ou dans les aires piétonnes à allure modérée (6 km/h) sans gêner les piétons.</li>
        <li><strong>Le trottoir est interdit</strong>, sauf si le maire l'autorise (6 km/h, sans gêner les piétons). Rouler hors des zones autorisées expose à une amende de 135 €.</li>
        <li><strong>Hors agglomération</strong>, vous pouvez circuler sur les pistes cyclables et les voies vertes. L'autorité chargée de la police de la circulation peut autoriser les routes limitées à 80 km/h.</li>
        <li><strong>Équipements obligatoires de l'engin</strong> : système de freinage, avertisseur sonore, feux de position avant et arrière, dispositifs réfléchissants arrière et latéraux.</li>
        <li><strong>Écouteurs et casque audio interdits.</strong> Le casque et un équipement rétro-réfléchissant sont obligatoires à Paris et dans plusieurs départements, dont les Hauts-de-Seine, la Seine-Saint-Denis, le Val-de-Marne, les Alpes-Maritimes et l'Yonne (liste non exhaustive). Ailleurs, l'équipement rétro-réfléchissant est obligatoire la nuit ou quand la visibilité est insuffisante.</li>
        <li><strong>Stationnement</strong> : il est autorisé sur le trottoir s'il ne gêne pas les piétons, sauf interdiction du maire. Pour une trottinette en libre-service, vérifiez les conditions d'assurance prévues par le contrat de location.</li>
      </ul>
      <SourceLine ids={["F308"]} />
    </section>

    <section className="max-w-4xl mx-auto mb-12" aria-labelledby="trottinette-debridee">
      <h2 id="trottinette-debridee" className={h2}>Trottinette débridée, chute sans tiers : ce qui change</h2>
      <p className={p}>
        Si sa vitesse maximale dépasse 25 km/h, ou si elle a été modifiée (débridée), la trottinette est <strong>requalifiée en cyclomoteur</strong>. Des obligations supplémentaires s'appliquent alors, notamment l'immatriculation, une assurance deux-roues motorisé et le port du casque. L'assureur peut d'ailleurs exiger que l'engin soit bridé avant d'accepter de le garantir.
      </p>
      <p className={`${p} mt-3`}>
        La responsabilité civile couvre les dommages causés aux autres. En cas d'<strong>accident sans responsable identifié</strong>, par exemple une chute seule, les dommages matériels (trottinette, casque…) ne sont pris en charge que si vous avez souscrit une assurance personnelle couvrant ces risques : assurance dommages, garantie accidents de la vie ou extension de votre assurance habitation.
      </p>
      <SourceLine ids={["F2697"]} />
    </section>

    <section className="max-w-4xl mx-auto mb-12" aria-labelledby="trottinette-non-conforme">
      <h2 id="trottinette-non-conforme" className={h2}>Trottinette non conforme ou non homologuée : que faire ?</h2>
      <p className={p}>
        Pour circuler sur la voie publique comme EDPM, une trottinette électrique doit respecter la vitesse maximale de 25 km/h et porter les équipements obligatoires : freinage, avertisseur sonore, feux de position avant et arrière, dispositifs réfléchissants. Un engin qui dépasse 25 km/h relève des règles du cyclomoteur (immatriculation, assurance deux-roues motorisé, casque).
      </p>
      <p className={`${p} mt-3`}>
        Avant d'accepter de garantir votre trottinette, l'assureur peut exiger certaines conditions techniques : éclairage, conformité, bridage. Vérifiez ces points avant de demander un devis, et décrivez l'engin tel que vous l'utilisez réellement.
      </p>
      <SourceLine ids={["F308", "F2697"]} />
    </section>

    <section className="max-w-4xl mx-auto mb-12" aria-labelledby="trottinette-habitation">
      <h2 id="trottinette-habitation" className={h2}>Mon assurance habitation couvre-t-elle ma trottinette ?</h2>
      <p className={p}>
        Pas toujours. Votre assurance habitation <strong>ne couvre pas automatiquement</strong> les trottinettes électriques. Si votre contrat ne le prévoit pas, vous devez souscrire une <strong>extension de garantie</strong> ou une <strong>assurance spécifique EDPM</strong>. Relisez vos conditions générales ou interrogez votre assureur pour savoir si ce type d'engin est prévu.
      </p>
      <SourceLine ids={["F2697"]} />
    </section>

    <section className="max-w-4xl mx-auto mb-12" aria-labelledby="trottinette-vol">
      <h2 id="trottinette-vol" className={h2}>Vol de trottinette : garantie, antivol et plainte</h2>
      <p className={p}>
        La <strong>garantie vol est facultative</strong> : c'est une garantie complémentaire, comme les dommages matériels, la garantie accidents de la vie ou la protection juridique. Le contrat décrit dans le tableau de garanties de cette page ne l'inclut pas ; d'autres assureurs la proposent, selon leurs conditions.
      </p>
      <p className={`${p} mt-3`}>
        L'assureur peut fixer des conditions pour garantir votre trottinette. Si vous souscrivez une garantie vol, vérifiez dans le contrat si un antivol est exigé, et lequel, avant de vous en remettre à elle.
      </p>
      <p className={`${p} mt-3`}>
        En cas de vol, <strong>portez plainte</strong> au commissariat ou à la gendarmerie de votre choix. Si vous ne connaissez pas l'auteur, la plainte peut aussi être déposée en ligne. Conservez le <strong>récépissé</strong>, qui prouve le dépôt de plainte, puis déclarez le vol à votre assureur dans le délai prévu par votre contrat.
      </p>
      <SourceLine ids={["F2697", "F1435"]} />
      <Link to="/blog/assurance-trottinette-vol-garantie-2026" className="inline-flex items-center gap-1.5 mt-3 font-semibold text-primary hover:underline">
        Lire notre guide sur le vol de trottinette →
      </Link>
    </section>

    <section className="max-w-4xl mx-auto mb-12" aria-labelledby="trottinette-etapes">
      <h2 id="trottinette-etapes" className={h2}>Comment s'assurer en 3 étapes</h2>
      <ol className="text-muted-foreground leading-relaxed list-decimal pl-5 space-y-3">
        <li><strong>Vérifiez votre contrat habitation.</strong> S'il ne prévoit pas les EDPM, il vous faut une extension de garantie ou une assurance spécifique.</li>
        <li><strong>Vérifiez votre trottinette.</strong> 25 km/h maximum, pas de débridage, équipements obligatoires présents : l'assureur peut exiger ces conditions.</li>
        <li><strong>Choisissez vos garanties et comparez.</strong> La responsabilité civile est le minimum obligatoire ; dommages matériels, vol, accidents de la vie et protection juridique sont facultatifs. Faites votre demande avec le formulaire de cette page.</li>
      </ol>
      <SourceLine ids={["F2697", "F308"]} />
      <Button onClick={onCtaClick} className="mt-4">Comparer maintenant</Button>
    </section>
  </>
);

export const TrottinetteSources = () => (
  <section id="trottinette-sources" className="max-w-4xl mx-auto mb-12 scroll-mt-24" aria-labelledby="trottinette-sources-title">
    <h2 id="trottinette-sources-title" className="text-xl md:text-2xl font-bold text-foreground mb-4">Sources</h2>
    <ul className="space-y-3 list-none pl-0 text-sm text-muted-foreground">
      {TROTTINETTE_SOURCES.map((s) => (
        <li key={s.id}>
          <span className="font-medium text-foreground">Service-Public.fr (DILA), fiche {s.id} : « {s.title} »</span>
          <br />
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{s.url}</a>
          <br />
          Page vérifiée le {s.verified} par Service-Public.fr, consultée le {TROTTINETTE_SOURCES_CONSULTED}.
        </li>
      ))}
    </ul>
  </section>
);

export default TrottinetteGuide;
