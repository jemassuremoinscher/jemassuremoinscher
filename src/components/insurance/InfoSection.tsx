import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InfoSectionProps {
  title: string;
  description: string;
  items: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  variant?: "default" | "gradient";
}

const InfoSection = ({ title, description, items, variant = "default" }: InfoSectionProps) => {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className={`p-6 ${
                variant === "gradient"
                  ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
                  : ""
              }`}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default InfoSection;
