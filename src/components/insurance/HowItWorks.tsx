import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
}

const HowItWorks = ({ steps }: HowItWorksProps) => {
  return (
    <section className="py-12 bg-gray-50 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Comment ça marche ?</h2>
          <p className="text-lg text-muted-foreground">
            Obtenez votre devis en quelques étapes simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-6 h-full bg-white">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  <CheckCircle className="h-5 w-5 text-green-500 mt-2" />
                </div>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
