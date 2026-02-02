import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, CheckCircle } from "lucide-react";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";

const Hero = () => {
  const [formData, setFormData] = useState({
    insuranceType: "",
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const insuranceTypes = [
    { value: "auto", label: "Assurance Auto" },
    { value: "moto", label: "Assurance Moto" },
    { value: "habitation", label: "Assurance Habitation" },
    { value: "sante", label: "Assurance Santé" },
    { value: "animaux", label: "Assurance Animaux" },
    { value: "vie", label: "Assurance Vie" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
  };

  return (
    <section 
      id="devis"
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-background geometric-bg"
      aria-label="Section principale - Comparateur d'assurances"
    >
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Arthur Mascot */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center lg:justify-start mb-6"
            >
              <motion.img
                src={arthurThumbsUp}
                alt="Arthur mascotte jemassuremoinscher"
                className="w-24 h-auto md:w-32 drop-shadow-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
              L'assurance{" "}
              <span className="text-primary">moins chère</span>,
              <br />
              sans compromis.
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Comparez <span className="font-bold text-foreground">50+ assureurs</span> en 2 minutes.
              <br />
              Gratuit et sans engagement.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>50+ partenaires</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>2 min chrono</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>100% gratuit</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Lead Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 md:p-8 bg-white border-2 border-border shadow-elegant">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Obtenez votre devis gratuit
                </h2>
                <p className="text-muted-foreground text-sm">
                  Réponse en moins de 24h
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="insuranceType" className="text-foreground font-medium">
                    Type d'assurance
                  </Label>
                  <Select 
                    value={formData.insuranceType}
                    onValueChange={(value) => setFormData({ ...formData, insuranceType: value })}
                  >
                    <SelectTrigger id="insuranceType" className="h-12 bg-muted/50 border-border">
                      <SelectValue placeholder="Choisissez une assurance" />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 bg-muted/50 border-border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@exemple.fr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 bg-muted/50 border-border"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg shadow-gold btn-press group"
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Comparer maintenant
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                En soumettant ce formulaire, vous acceptez d'être contacté par nos conseillers.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;