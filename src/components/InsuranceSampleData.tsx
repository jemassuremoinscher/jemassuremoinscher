import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const InsuranceSampleData = () => {
  const { toast } = useToast();

  const loadSampleData = async () => {
    try {
      // Check if data already exists
      const { data: existingInsurers } = await supabase
        .from('insurers')
        .select('id')
        .limit(1);

      if (existingInsurers && existingInsurers.length > 0) {
        toast({
          title: "Données déjà présentes",
          description: "Les données d'exemple sont déjà chargées.",
        });
        return;
      }

      // Insert sample insurers
      const { data: insurers, error: insurersError } = await supabase
        .from('insurers')
        .insert([
          { name: 'AssurPlus', logo_url: null },
          { name: 'SecureVie', logo_url: null },
          { name: 'ProtectMax', logo_url: null },
        ])
        .select();

      if (insurersError) throw insurersError;

      // Insert sample products for each insurance type
      const products = [];
      const types = ['auto', 'sante', 'habitation', 'animaux', 'pret'];

      for (const insurer of insurers || []) {
        for (const type of types) {
          products.push({
            insurer_id: insurer.id,
            type,
            name: `Formule ${type === 'auto' ? 'Auto' : type === 'sante' ? 'Santé' : type === 'habitation' ? 'Habitation' : type === 'animaux' ? 'Animaux' : 'Prêt'} ${insurer.name}`,
            description: `Couverture complète pour votre ${type === 'auto' ? 'véhicule' : type === 'sante' ? 'santé' : type === 'habitation' ? 'logement' : type === 'animaux' ? 'animal' : 'prêt'}`,
          });
        }
      }

      const { data: insertedProducts, error: productsError } = await supabase
        .from('insurance_products')
        .insert(products)
        .select();

      if (productsError) throw productsError;

      // Insert sample coverages for each product
      const coverages = [];
      for (const product of insertedProducts || []) {
        const type = product.type;
        
        if (type === 'auto') {
          coverages.push(
            { product_id: product.id, name: 'Responsabilité civile', description: 'Dommages causés à des tiers', value: 'Illimité' },
            { product_id: product.id, name: 'Vol et incendie', description: 'Protection contre le vol et l\'incendie', value: 'Valeur du véhicule' },
            { product_id: product.id, name: 'Assistance 24/7', description: 'Dépannage et remorquage', value: 'Partout en France' }
          );
        } else if (type === 'sante') {
          coverages.push(
            { product_id: product.id, name: 'Hospitalisation', description: 'Frais d\'hospitalisation', value: '200%' },
            { product_id: product.id, name: 'Optique', description: 'Lunettes et lentilles', value: '400€/an' },
            { product_id: product.id, name: 'Dentaire', description: 'Soins et prothèses dentaires', value: '300%' }
          );
        } else if (type === 'habitation') {
          coverages.push(
            { product_id: product.id, name: 'Incendie et dégâts des eaux', description: 'Protection contre les sinistres', value: 'Valeur à neuf' },
            { product_id: product.id, name: 'Vol et vandalisme', description: 'Protection des biens', value: 'Jusqu\'à 50 000€' },
            { product_id: product.id, name: 'Responsabilité civile', description: 'Dommages causés à autrui', value: 'Illimité' }
          );
        } else if (type === 'animaux') {
          coverages.push(
            { product_id: product.id, name: 'Soins vétérinaires', description: 'Consultation et médicaments', value: '80% remboursé' },
            { product_id: product.id, name: 'Chirurgie', description: 'Interventions chirurgicales', value: '90% remboursé' },
            { product_id: product.id, name: 'Prévention', description: 'Vaccins et vermifuges', value: '100€/an' }
          );
        } else if (type === 'pret') {
          coverages.push(
            { product_id: product.id, name: 'Décès', description: 'Protection en cas de décès', value: '100%' },
            { product_id: product.id, name: 'Invalidité', description: 'Prise en charge en cas d\'invalidité', value: '100%' },
            { product_id: product.id, name: 'Perte d\'emploi', description: 'Option perte d\'emploi', value: 'Jusqu\'à 12 mois' }
          );
        }
      }

      const { error: coveragesError } = await supabase
        .from('product_coverages')
        .insert(coverages);

      if (coveragesError) throw coveragesError;

      toast({
        title: "Données chargées",
        description: "Les données d'exemple ont été chargées avec succès.",
      });
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'exemple.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={loadSampleData} variant="secondary">
        Charger données d'exemple
      </Button>
    </div>
  );
};
