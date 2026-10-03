import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ORIAS_NUMBER } from "@/config/site";
import { ANIMAUX_FAQ, ANIMAUX_SOURCES } from "@/data/animauxPilier";

// Pilier /assurance-animaux (plan validé par Paul, 10 sections). Texte en
// français, affiché quand la langue du site est le français.
// Règles : fourchettes issues de trois documents d'information seulement,
// aucun nom d'assureur dans le texte (uniquement dans « Sources »), aucun
// prix, aucune note, aucun « meilleur », aucune économie promise. La FAQ
// visible et le JSON-LD FAQPage lisent le même tableau (ANIMAUX_FAQ).

interface AnimauxPillarProps {
  onCtaClick: () => void;
}

const AnimauxPillar = ({ onCtaClick }: AnimauxPillarProps) => (
  <article className="max-w-3xl mx-auto mb-16 prose prose-slate dark:prose-invert prose-headings:scroll-mt-24">
    <p className="lead">
      Une assurance santé pour chien ou chat rembourse une partie des frais vétérinaires : consultations, examens,
      médicaments, hospitalisation ou chirurgie, selon la formule choisie. Elle ne fonctionne pas comme la Sécurité
      sociale : il n'existe aucun régime obligatoire pour les animaux, et chaque contrat fixe ses propres règles. Ce
      guide explique, notion par notion, ce qu'il faut regarder avant de souscrire.
    </p>
    <p>
      Pour donner des ordres de grandeur réels, nous avons lu les documents d'information de trois contrats
      d'assurance chien et chat distribués en France. Ils sont listés dans la section « Sources », en bas de page.
      Les fourchettes citées dans ce guide viennent de ces trois documents uniquement : elles ne décrivent pas tout
      le marché, et d'autres contrats peuvent prévoir des valeurs différentes.
    </p>

    <h2 id="ca-vaut-le-coup">1. Une assurance pour son animal, est-ce que ça vaut le coup ?</h2>
    <p>
      En France, environ 5 % des animaux de compagnie sont assurés : 7 % des chiens et 4 % des chats, selon le
      baromètre de l'assurance animaux publié par HelloSafe (données 2025). Le chiffre de 5 % a été repris par le
      magazine professionnel L'assurance en mouvement. L'assurance santé animale reste donc un choix minoritaire, et
      elle n'est obligatoire pour aucun animal.
    </p>
    <p>
      La bonne question n'est pas de savoir si l'assurance « rapporte ». Sur une année sans problème de santé, vous
      payez des cotisations sans rien recevoir en retour, sauf si votre formule comprend un forfait prévention.
      L'assurance sert à rendre supportable une dépense imprévue et élevée : une fracture, une maladie qui demande des
      examens répétés, une intervention chirurgicale ou une hospitalisation.
    </p>
    <p>Quelques questions aident à décider :</p>
    <ul>
      <li>
        <strong>Pourriez-vous régler sans difficulté une facture vétérinaire importante et imprévue ?</strong> Si oui,
        une épargne dédiée peut jouer le même rôle. Si non, l'assurance répartit ce risque sur l'année, sous forme de
        cotisations.
      </li>
      <li>
        <strong>Quel âge a votre animal ?</strong> Les contrats fixent un âge maximal à la souscription et appliquent
        des délais de carence. Plus on souscrit tôt, plus l'animal a de chances d'être accepté et couvert avant
        l'apparition d'un problème de santé.
      </li>
      <li>
        <strong>Sa race est-elle connue pour certaines affections ?</strong> Les affections congénitales ou
        héréditaires sont exclues par les trois contrats examinés. Lisez cette partie du contrat avec attention.
      </li>
      <li>
        <strong>Quel niveau de protection visez-vous ?</strong> Une formule qui ne couvre que les accidents et une
        formule qui couvre aussi les maladies ne protègent pas du tout de la même façon.
      </li>
    </ul>
    <p>
      Si vous décidez de vous assurer, les notions qui suivent permettent de comparer les offres sur des bases
      concrètes, au-delà du seul montant de la cotisation.
    </p>

    <h2 id="taux-de-remboursement">2. Le taux de remboursement</h2>
    <p>
      Le taux de remboursement est la part des frais vétérinaires que l'assureur prend en charge. Avec un taux de
      80 %, il rembourse 80 % des frais couverts et 20 % restent à votre charge, avant application de la franchise et
      dans la limite du plafond annuel.
    </p>
    <p>
      Dans les contrats examinés qui l'indiquent, le taux va de 60 à 100 % selon la formule choisie. Pour l'un des
      trois contrats, le taux n'apparaît pas dans le document d'information : il figure dans le tableau des garanties.
    </p>
    <p>
      Un taux élevé n'est pas forcément plus avantageux s'il s'accompagne d'un plafond bas ou d'une franchise
      importante : ces trois paramètres se lisent ensemble. Vérifiez aussi l'existence de sous-plafonds, par acte, par
      maladie ou par type de soin. Ils figurent dans le tableau des garanties ou la notice, pas toujours dans le
      document d'information.
    </p>

    <h2 id="plafond-annuel">3. Le plafond annuel</h2>
    <p>
      Le plafond annuel est le montant maximal que l'assureur rembourse sur une année d'assurance, tous soins
      confondus. Une fois ce plafond atteint, les frais suivants restent entièrement à votre charge jusqu'au
      renouvellement du contrat.
    </p>
    <p>
      Dans les deux documents examinés qui le chiffrent, le plafond annuel va de 400 à 4 000 € selon la formule. Le
      troisième document d'information ne donne pas de montant et renvoie à la notice du contrat.
    </p>
    <p>
      Pour choisir un plafond, pensez aux dépenses que vous voulez réellement couvrir. Un plafond bas peut suffire pour
      des soins courants, mais il sera vite atteint en cas de chirurgie ou de maladie qui dure. Regardez aussi s'il
      existe des plafonds particuliers, par exemple pour une intervention chirurgicale ou pour la prévention.
    </p>

    <h2 id="franchise">4. La franchise</h2>
    <p>
      La franchise est la somme qui reste à votre charge sur un remboursement. Selon les contrats, elle peut être
      annuelle (un montant déduit une fois par an), appliquée à chaque acte ou à chaque sinistre, ou exprimée en
      pourcentage. Le mode de calcul compte autant que le montant : une franchise appliquée à chaque acte pèse plus
      lourd si votre animal consulte souvent.
    </p>
    <p>
      Dans le seul des trois documents qui la chiffre, la franchise annuelle va de 0 à 75 € par an selon la formule.
      Les deux autres documents d'information n'en indiquent pas le montant : il faut le chercher dans le tableau des
      garanties ou les conditions générales.
    </p>

    <h2 id="delai-de-carence">5. Le délai de carence</h2>
    <p>
      Le délai de carence est la période qui suit la souscription pendant laquelle un problème de santé n'est pas pris
      en charge. Il évite qu'un propriétaire assure son animal seulement au moment où celui-ci tombe malade.
    </p>
    <p>Dans les contrats examinés :</p>
    <ul>
      <li>
        <strong>accident</strong> : 48 heures dans l'un des contrats ; un autre ne prévoit de délai d'attente que
        pour la maladie ;
      </li>
      <li>
        <strong>maladie</strong> : 45 jours dans les deux contrats qui le chiffrent, le troisième renvoyant à sa
        notice ;
      </li>
      <li>
        <strong>chirurgie liée à une maladie</strong> : jusqu'à 6 mois dans l'un des contrats.
      </li>
    </ul>
    <p>
      Selon les contrats, un problème apparu pendant la carence peut ensuite être traité comme antérieur à
      l'adhésion et rester exclu. Vérifiez ce point dans les conditions générales. Pour la même raison, si vous
      changez de contrat, tenez compte de la nouvelle carence avant de résilier l'ancien.
    </p>

    <h2 id="exclusions">6. Les exclusions</h2>
    <p>
      Les exclusions sont les situations que le contrat ne couvre pas. Elles apparaissent dans le document
      d'information, sous la rubrique « Qu'est-ce qui n'est pas assuré ? », puis en détail dans les conditions
      générales.
    </p>
    <p>Parmi les exclusions relevées dans les documents examinés :</p>
    <ul>
      <li>
        les maladies dont l'origine est antérieure à la souscription ou qui apparaissent pendant le délai de carence ;
      </li>
      <li>
        les affections congénitales ou héréditaires, exclues par les trois contrats ; l'un d'eux cite expressément la
        dysplasie de la hanche et la luxation chronique de la rotule ;
      </li>
      <li>la prévention et les vaccins, dans la formule d'entrée de gamme de l'un des contrats.</li>
    </ul>
    <p>
      Si votre animal appartient à une race prédisposée à certaines affections, demandez avant de signer comment le
      contrat les traite : exclusion totale, exclusion après un certain âge, ou prise en charge limitée.
    </p>

    <h2 id="age-souscription">7. L'âge à la souscription</h2>
    <p>
      Chaque contrat fixe un âge minimal et un âge maximal pour souscrire. Dans les trois contrats examinés, un chien
      ou un chat peut être assuré à partir de 2 mois. L'âge maximal à la souscription va de 5 ans à moins de 10 ans,
      selon le contrat, la formule et, pour l'un d'eux, la race de l'animal.
    </p>
    <p>
      Les espèces couvertes varient aussi : l'un des contrats accepte certains nouveaux animaux de compagnie (furet,
      lapin, cobaye, chinchilla, perroquet), avec leurs propres limites d'âge, alors que les deux autres ne couvrent
      que les chiens et les chats. Les règles de détention et d'identification de ces animaux, et ce que prévoit ce contrat,
      sont détaillées dans notre page <Link to="/assurance-nac">assurance NAC</Link>.
    </p>
    <p>
      Ces limites concernent l'adhésion. Vérifiez aussi ce que prévoit le contrat quand l'animal vieillit : maintien
      des garanties, évolution de la cotisation, éventuelles limitations. Ces règles figurent dans les conditions
      générales.
    </p>
    <p>
      Pour un chiot, les points propres à son âge (identification, délais de carence, vaccins et prévention) sont
      détaillés dans notre page <Link to="/assurance-chiot">assurance chiot</Link> ; pour un chaton (identification,
      délais de carence, stérilisation et prévention), dans notre page{" "}
      <Link to="/assurance-chaton">assurance chaton</Link>.
    </p>

    <h2 id="prevention">8. La prévention</h2>
    <p>
      Les soins de prévention, comme les vaccins, ne relèvent ni de l'accident ni de la maladie. Ils ne sont pris en
      charge que si la formule comprend un forfait prévention, c'est-à-dire un montant annuel réservé à ces soins.
    </p>
    <p>
      Dans les contrats examinés qui en prévoient un, ce forfait va de 30 à 150 € par an selon la formule. La formule
      d'entrée de gamme de l'un des contrats exclut la prévention et les vaccins.
    </p>
    <p>
      Avant de choisir une formule avec forfait prévention, comparez son montant aux soins de prévention que vous
      faites réellement chaque année pour votre animal.
    </p>

    <h2 id="chiens-categorises">9. Chiens de 1re et 2e catégorie : ce que dit la loi</h2>
    <p>
      Pour les chiens de 1re catégorie (chiens d'attaque) et de 2e catégorie (chiens de garde et de défense), la loi
      impose une assurance, mais ce n'est pas une assurance santé. D'après la fiche officielle F1839 de
      service-public.gouv.fr :
    </p>
    <ul>
      <li>
        le propriétaire ou le détenteur doit avoir une <strong>assurance responsabilité civile</strong> qui couvre les
        dommages que le chien peut causer à des tiers ; les membres de la famille sont considérés comme des tiers ;
      </li>
      <li>
        l'absence d'assurance est passible d'une <strong>amende de 450 € au maximum</strong> ;
      </li>
      <li>
        une <strong>attestation d'assurance responsabilité civile</strong> fait partie des pièces exigées pour obtenir
        le permis de détention délivré par le maire de la commune de résidence.
      </li>
    </ul>
    <p>
      Cette obligation porte sur la responsabilité civile, pas sur les frais vétérinaires : l'assurance santé reste
      facultative pour ces chiens comme pour les autres. Demandez à votre assureur habitation si sa garantie
      responsabilité civile couvre un chien catégorisé et s'il peut vous délivrer l'attestation demandée pour le
      permis.
    </p>
    <p>
      Le détail des obligations (permis de détention, identification, vaccination antirabique, évaluation
      comportementale, stérilisation pour la 1re catégorie) est présenté dans notre page{" "}
      <Link to="/assurance-chien-categorie-1-2">chien de 1re ou 2e catégorie : obligations et assurance</Link>.
    </p>

    <h2 id="comparer">10. Comment comparer les offres</h2>
    <p>Pour comparer deux contrats, mettez côte à côte, pour des formules équivalentes :</p>
    <ol>
      <li>le taux de remboursement et les éventuels sous-plafonds ;</li>
      <li>le plafond annuel ;</li>
      <li>la franchise : son montant et son mode de calcul (par an, par acte, en pourcentage) ;</li>
      <li>les délais de carence pour l'accident, la maladie et la chirurgie ;</li>
      <li>les exclusions, en particulier pour la race de votre animal ;</li>
      <li>l'âge maximal à la souscription et les règles prévues quand l'animal vieillit ;</li>
      <li>le forfait prévention, s'il vous est utile ;</li>
      <li>
        la zone géographique couverte si vous voyagez avec votre animal : dans les contrats examinés, elle va de la
        France et de l'Europe au monde entier ;
      </li>
      <li>la cotisation et ses conditions d'évolution.</li>
    </ol>
    <p>
      Trois documents permettent de faire ces vérifications : le document d'information, qui suit un format
      normalisé pour tous les assureurs, le tableau des garanties et les conditions générales. Le document
      d'information donne l'essentiel, mais pas tous les chiffres : comme le montre ce guide, plusieurs valeurs n'y
      figurent pas et se trouvent dans la notice.
    </p>
    <p>
      Un conseiller peut vous aider à lire ces documents et à comparer les propositions adaptées à votre animal.
      Remplissez le formulaire en haut de page : il étudie votre demande et vous rappelle.
    </p>
    <div className="not-prose my-8 text-center">
      <Button size="lg" onClick={onCtaClick} className="rounded-full font-bold px-8">
        Remplir le formulaire
      </Button>
    </div>

    <h2 id="faq">Questions fréquentes</h2>
    <div className="not-prose space-y-6">
      {ANIMAUX_FAQ.map((item) => (
        <div key={item.question}>
          <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</p>
        </div>
      ))}
    </div>

    <h2 id="sources">Sources</h2>
    <p>
      Les fourchettes de garanties de ce guide viennent des trois documents d'information ci-dessous. Elles valent
      pour ces trois contrats et ne décrivent pas l'ensemble du marché.
    </p>
    <ul>
      {ANIMAUX_SOURCES.map((s) => (
        <li key={s.url}>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>{" "}
          (consulté le {s.consulted})
        </li>
      ))}
    </ul>
    <p className="text-sm text-muted-foreground">
      Rédigé par L'équipe jemassuremoinscher.fr, courtier en assurance immatriculé à l'ORIAS sous le n° {ORIAS_NUMBER}.
    </p>
  </article>
);

export default AnimauxPillar;
