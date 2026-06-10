import { useEffect, useState } from 'react';
import { getContextualLinks } from '@/config/sites';

export default function CrossSiteLinks() {
  const [domain, setDomain] = useState('jemassuremoinscher.fr');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.hostname.replace('www.', ''));
    }
  }, []);

  const links = getContextualLinks(domain);
  if (links.length === 0) return null;

  return (
    <div className="border-t border-primary-foreground/20 pt-6 mt-6">
      <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-primary-foreground">
        Découvrez nos autres services
      </p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-80 hover:opacity-100 underline transition-opacity"
            >
              {link.text} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
