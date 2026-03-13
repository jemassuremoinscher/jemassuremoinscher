import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

/** Pages excluded from analytics tracking */
const EXCLUDED_PATHS = ['/admin', '/auth', '/commercial'];

const RouteTracker = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    if (EXCLUDED_PATHS.some(p => location.pathname.startsWith(p))) return;
    trackPageView(location.pathname, document.title);
  }, [location.pathname, trackPageView]);

  return null;
};

export default RouteTracker;
