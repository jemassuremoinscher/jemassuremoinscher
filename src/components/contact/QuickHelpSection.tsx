import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";

const QuickHelpSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    prenom: "",
    email: "",
    sujet: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prenom || !formData.email || !formData.sujet) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Message envoyé ! Nous vous répondons dans les 2 minutes.");
    setFormData({ prenom: "", email: "", sujet: "" });
    setIsLoading(false);
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Besoin d'aide ?
          </h2>
        </motion.div>

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Mascot with speech bubble */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            {/* Speech bubble - positioned above mascot */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative bg-white rounded-2xl shadow-lg p-4 max-w-[240px] border border-border/50"
            >
              <p className="text-sm md:text-base font-medium text-foreground text-center">
                Une question ? Je vous réponds en moins de 2 min !
              </p>
              {/* Bubble tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-border/50 transform rotate-45" />
            </motion.div>

            {/* Mascot */}
            <img
              src={arthurThinking}
              alt="Arthur mascotte assurance moins chère - aide et support"
              className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Right: Simple form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                  className="h-12 text-base bg-muted/30 border-border/50 focus:border-primary"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-12 text-base bg-muted/30 border-border/50 focus:border-primary"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Sujet"
                  value={formData.sujet}
                  onChange={(e) =>
                    setFormData({ ...formData, sujet: e.target.value })
                  }
                  className="h-12 text-base bg-muted/30 border-border/50 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold active:scale-95 transition-transform"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer"
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Support buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          {/* Call button */}
          <Button
            asChild
            size="lg"
            className="flex-1 h-14 text-base font-semibold bg-[#4CAF50] hover:bg-[#43A047] text-white active:scale-95 transition-transform"
          >
            <a href="tel:+33123456789">
              <Phone className="mr-2 h-5 w-5" />
              Appeler
            </a>
          </Button>

          {/* WhatsApp button */}
          <Button
            asChild
            size="lg"
            className="flex-1 h-14 text-base font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white active:scale-95 transition-transform"
          >
            <a
              href="https://wa.me/33123456789?text=Bonjour, j'ai une question concernant mon assurance."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickHelpSection;
