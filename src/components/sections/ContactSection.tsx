import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Send } from "lucide-react";
import { useState } from "react";
import arthurStanding from "@/assets/mascotte/arthur-standing.png";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Contact form:", formData);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30" aria-labelledby="contact-title">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 id="contact-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Besoin d'aide ?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <motion.img
                src={arthurStanding}
                alt="Arthur mascotte"
                className="w-32 h-auto mx-auto md:mx-0 mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:contact@jemassuremoinscher.fr" className="font-medium text-foreground hover:text-primary transition-colors">
                      contact@jemassuremoinscher.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <a href="tel:+33123456789" className="font-medium text-foreground hover:text-primary transition-colors">
                      01 23 45 67 89
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-foreground font-medium">
                    Nom
                  </Label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 bg-muted/50 border-border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-foreground font-medium">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="votre@email.fr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 bg-muted/50 border-border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-foreground font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="min-h-[120px] bg-muted/50 border-border resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold btn-press"
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;