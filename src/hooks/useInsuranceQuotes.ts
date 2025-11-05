import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Coverage {
  id: string;
  name: string;
  description: string | null;
  value: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  insurer_name: string;
  insurer_logo: string | null;
  coverages: Coverage[];
}

interface Quote {
  id: string;
  calculated_price: number;
  product: Product;
}

export const useInsuranceQuotes = (insuranceType: string, formData: any) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateQuotes = async () => {
      if (!formData) return;
      
      setIsLoading(true);
      try {
        // Fetch products for this insurance type
        const { data: products, error: productsError } = await supabase
          .from('insurance_products')
          .select(`
            id,
            name,
            description,
            insurer:insurers(name, logo_url),
            product_coverages(id, name, description, value)
          `)
          .eq('type', insuranceType);

        if (productsError) throw productsError;
        if (!products || products.length === 0) {
          setQuotes([]);
          return;
        }

        // Calculate price for each product based on form data
        const quotesData = products.map((product: any) => {
          const basePrice = calculatePrice(insuranceType, formData);
          // Vary prices between insurers (simulate competition)
          const variation = (Math.random() - 0.5) * 0.3; // ±15%
          const calculatedPrice = basePrice * (1 + variation);

          return {
            product_id: product.id,
            user_input_data: formData,
            calculated_price: Math.max(10, calculatedPrice), // Minimum 10€
          };
        });

        // Insert quotes into database
        const { data: insertedQuotes, error: quotesError } = await supabase
          .from('quotes')
          .insert(quotesData)
          .select(`
            id,
            calculated_price,
            product:insurance_products(
              id,
              name,
              description,
              insurer:insurers(name, logo_url),
              product_coverages(id, name, description, value)
            )
          `);

        if (quotesError) throw quotesError;

        // Transform data for the component
        const transformedQuotes = insertedQuotes?.map((quote: any) => ({
          id: quote.id,
          calculated_price: quote.calculated_price,
          product: {
            id: quote.product.id,
            name: quote.product.name,
            description: quote.product.description,
            insurer_name: quote.product.insurer.name,
            insurer_logo: quote.product.insurer.logo_url,
            coverages: quote.product.product_coverages,
          },
        })) || [];

        setQuotes(transformedQuotes);
      } catch (error) {
        console.error('Error generating quotes:', error);
        setQuotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    generateQuotes();
  }, [insuranceType, formData]);

  return { quotes, isLoading };
};

// Helper function to calculate base price
const calculatePrice = (type: string, formData: any): number => {
  let basePrice = 50;

  switch (type) {
    case 'auto':
      basePrice = 40;
      if (formData.driverAge < 25) basePrice *= 1.5;
      if (formData.vehicleYear && formData.vehicleYear < 2015) basePrice *= 1.2;
      if (formData.fuelType === 'electric') basePrice *= 0.9;
      break;

    case 'sante':
      basePrice = 60;
      if (formData.familySituation === 'family') basePrice *= 1.8;
      if (formData.age > 50) basePrice *= 1.3;
      if (formData.coverageLevel === 'premium') basePrice *= 1.5;
      break;

    case 'habitation':
      basePrice = 30;
      if (formData.housingType === 'house') basePrice *= 1.4;
      if (formData.surface > 100) basePrice *= 1.3;
      if (formData.rooms > 4) basePrice *= 1.2;
      break;

    case 'animaux':
      basePrice = 25;
      if (formData.animalType === 'dog') basePrice *= 1.3;
      if (formData.age > 8) basePrice *= 1.4;
      if (!formData.sterilized) basePrice *= 1.1;
      break;

    case 'pret':
      basePrice = 35;
      const loanAmount = parseFloat(formData.loanAmount) || 100000;
      basePrice = (loanAmount / 100000) * 35;
      if (formData.age > 50) basePrice *= 1.5;
      if (formData.smoker) basePrice *= 1.8;
      break;

    default:
      break;
  }

  return basePrice;
};
