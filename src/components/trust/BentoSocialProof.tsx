import { Star, Shield, Gift, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";

const BentoSocialProof = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Des milliers de Français nous font déjà confiance
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {/* Trustpilot Rating - Large on desktop */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-2 bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 md:w-7 md:h-7 ${
                      star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/80 text-yellow-400/80"
                    }`}
                  />
                ))}
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-black text-foreground mb-1">
                  4.8<span className="text-xl text-muted-foreground">/5</span>
                </p>
                <p className="text-sm md:text-base text-muted-foreground">
                  sur Trustpilot • +2 500 avis
                </p>
              </div>
            </div>
          </motion.div>

          {/* Free Service */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 shadow-sm border border-accent/20 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-accent/20">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-foreground">
                  Service 100%
                </p>
                <p className="text-2xl md:text-3xl font-black text-accent">
                  Gratuit
                </p>
              </div>
            </div>
          </motion.div>

          {/* Secure Data */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 shadow-sm border border-primary/20 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-foreground">
                  Données
                </p>
                <p className="text-2xl md:text-3xl font-black text-primary">
                  Sécurisées
                </p>
              </div>
            </div>
          </motion.div>

          {/* Arthur Mascot Card - Full width on mobile, spans 2 on larger */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-primary to-primary/90 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <motion.img
                src={arthurThinking}
                alt="Arthur réfléchit pour vous"
                className="w-20 h-auto md:w-28"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <span className="text-primary-foreground/80 text-sm font-medium">
                    Arthur vous dit :
                  </span>
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground">
                  "Je négocie pour vous les{" "}
                  <span className="text-accent">meilleurs tarifs</span> !"
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoSocialProof;