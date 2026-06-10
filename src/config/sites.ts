export const allSites = {
  mayocreche: {
      name: 'Mayo Crèche',
          url: 'https://mayocreche.fr',
              description: 'Crèches & services de garde',
                },
                  insurance: {
                      name: "Je m'assure moins cher",
                          url: 'https://jemassuremoinscher.fr',
                              description: 'Courtage en assurance',
                                },
                                  ai: {
                                      name: 'Mammouth AI',
                                          url: 'https://mammouth-ai.com',
                                              description: 'Agents IA pour entrepreneurs',
                                                },
                                                };

                                                export const getContextualLinks = (domain: string) => {
                                                  const links: Record<string, Array<{ url: string; text: string }>> = {
                                                      'jemassuremoinscher.fr': [
                                                            {
                                                                    url: 'https://mayocreche.fr',
                                                                            text: 'Assurance pour crèches & structures d\'accueil',
                                                                                  },
                                                                                        {
                                                                                                url: 'https://mammouth-ai.com',
                                                                                                        text: 'Automatiser vos devis et relances',
                                                                                                              },
                                                                                                                  ],
                                                                                                                    };
                                                                                                                    
                                                                                                                      return links[domain] || links['jemassuremoinscher.fr'];
                                                                                                                      };
                                                                                                                      
