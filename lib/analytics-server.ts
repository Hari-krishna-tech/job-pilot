import { getPostHogClient } from "./posthog-server";
import type { AnalyticsEventName, EventProperties } from "./analytics-events";

/**
 * Track events on the server side (e.g., in API routes)
 * Usage: await trackServerEvent('user_signed_in', userId, { provider: 'google' });
 */
export async function trackServerEvent(
  eventName: AnalyticsEventName,
  userId: string,
  properties?: EventProperties,
) {
  try {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: userId,
      event: eventName,
      properties: properties || {},
    });
  } catch (error) {
    console.error("Error tracking server event:", error);
  }
}

/**
 * Identify a user on the server side (usually after login)
 * Usage: await identifyServerUser('user-123', { email: 'user@example.com', plan: 'premium' });
 */
export async function identifyServerUser(
  userId: string,
  traits?: EventProperties,
) {
  try {
    const posthog = getPostHogClient();
    posthog.identify({
      distinctId: userId,
      properties: traits || {},
    });
  } catch (error) {
    console.error("Error identifying server user:", error);
  }
}

/**
 * Batch track multiple events (useful for complex operations)
 * Usage: await batchTrackEvents(userId, [
 *   { event: 'job_applied', properties: { jobId: '123' } },
 *   { event: 'email_sent', properties: { recipient: 'recruiter@company.com' } }
 * ]);
 */
export async function batchTrackEvents(
  userId: string,
  events: Array<{ event: AnalyticsEventName; properties?: EventProperties }>,
) {
  try {
    const posthog = getPostHogClient();
    events.forEach(({ event, properties }) => {
      posthog.capture({
        distinctId: userId,
        event,
        properties: properties || {},
      });
    });
  } catch (error) {
    console.error("Error batch tracking events:", error);
  }
}
