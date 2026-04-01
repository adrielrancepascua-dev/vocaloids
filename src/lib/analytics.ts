export const trackEvent = (eventName: string, props: Record<string, any> = {}) => {
  // Console logging for local dev tracking
  console.log('[Analytics] ' + eventName, props);
};
