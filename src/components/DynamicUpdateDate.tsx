import { Calendar } from "lucide-react";

const DynamicUpdateDate = () => {
  const today = new Date();
  const formatted = today.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-3">
      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
      <span>Données mises à jour en temps réel le {formatted}</span>
    </div>
  );
};

export default DynamicUpdateDate;
