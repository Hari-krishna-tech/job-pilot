"use client";

import { useCallback } from "react";
import posthog from "posthog-js";

export interface EventProperties {
  [key: string]: any;
}

/**
 * Hook for tracking PostHog events in client components
 * Usage: const trackEvent = usePostHogEvent();
 *        trackEvent('button_clicked', { button_name: 'sign_up' });
 */
export const usePostHogEvent = () => {
  return useCallback((eventName: string, properties?: EventProperties) => {
    if (typeof window !== "undefined" && posthog) {
      posthog.capture(eventName, properties);
    }
  }, []);
};

/**
 * Hook for identifying users (call after login)
 * Usage: const identify = usePostHogIdentify();
 *        identify(userId, { email: 'user@example.com', plan: 'pro' });
 */
export const usePostHogIdentify = () => {
  return useCallback((userId: string, traits?: EventProperties) => {
    if (typeof window !== "undefined" && posthog) {
      posthog.identify(userId, traits);
    }
  }, []);
};

/**
 * Hook for setting user properties without identifying
 * Usage: const setProperties = usePostHogSetProperties();
 *        setProperties({ theme: 'dark', notifications: true });
 */
export const usePostHogSetProperties = () => {
  return useCallback((properties: EventProperties) => {
    if (typeof window !== "undefined" && posthog) {
      posthog.setPersonProperties(properties);
    }
  }, []);
};
