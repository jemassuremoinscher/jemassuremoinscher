// Ne pas éditer via Lovable — géré par Claude Code
export const allSites = {
  mayocreche: { name: 'Mayo Crèche', url: 'https://www.mayocreche.fr', description: 'Crèches & services de garde' },
  insurance: { name: "Je m'assure moins cher", url: 'https://www.jemassuremoinscher.fr', description: 'Courtage en assurance' },
  ai: { name: 'Mammouth AI', url: 'https://www.mammouth-ai.com', description: 'Agents IA pour entrepreneurs' },
};
export const getContextualLinks = (domain: string) => {
  const links: Record<string, Array<{ url: string; text: string }>> = {
    'jemassuremoinscher.fr': [
      { url: 'https://www.mayocreche.fr', text: "Assurance pour crèches & structures d'accueil" },
      { url: 'https://www.mammouth-ai.com', text: 'Automatiser vos devis et relances' },
    ],
  };
  return links[domain] || links['jemassuremoinscher.fr'];
};
