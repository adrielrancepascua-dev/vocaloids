export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Non-commercial fan site: Tracking intentionally disabled to preserve privacy.
  console.log(`[Event Tracking Disabled]: ${eventName}`, properties || {});
};
