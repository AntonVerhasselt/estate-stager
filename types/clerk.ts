// Type definitions for Clerk user public metadata
export interface UserPublicMetadata {
  onboardingStep?: number;
  onboardingComplete?: boolean;
  convexUserId?: string;
  isInvitedUser?: boolean; // True if user was invited to an existing org
}

// Type guard to check if metadata has the expected shape
export function isUserPublicMetadata(
  metadata: unknown
): metadata is UserPublicMetadata {
  if (!metadata || typeof metadata !== "object") {
    return false;
  }
  const m = metadata as Record<string, unknown>;
  return (
    (m.onboardingStep === undefined ||
      typeof m.onboardingStep === "number") &&
    (m.onboardingComplete === undefined ||
      typeof m.onboardingComplete === "boolean") &&
    (m.convexUserId === undefined || typeof m.convexUserId === "string") &&
    (m.isInvitedUser === undefined || typeof m.isInvitedUser === "boolean")
  );
}
