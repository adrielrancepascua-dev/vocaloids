export const trackEvent = (eventName: string, props: Record<string, any> = {}) => {
  // Console logging for local dev tracking
  console.log('[Analytics] ' + eventName, props);

  // If Plausible is available on window, track it!
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props });
  }
};
