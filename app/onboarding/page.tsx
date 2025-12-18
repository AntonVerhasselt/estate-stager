"use client";

import { useUser, useOrganization, useSession } from "@clerk/nextjs";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserInfoStep } from "@/components/onboarding/user-info-step";
import { OrganizationInfoStep } from "@/components/onboarding/organization-info-step";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { Button } from "@/components/ui/button";
import { withRetry, isAuthError } from "@/lib/auth-utils";
import type { UserPublicMetadata } from "@/types/clerk";

const MAX_INIT_RETRIES = 3;

export default function OnboardingPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { session } = useSession();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const initializingRef = useRef(false);
  const createUser = useMutation(api.users.create.createUser);
  const updateUserMetadata = useAction(
    api.users.updateClerk.updateUserMetadata
  );

  // Simple check: does the user already have an organization?
  const hasOrganization = organization !== null;
  const totalSteps = hasOrganization ? 1 : 2;

  // Create user with retry logic
  const createUserWithRetry = useCallback(async (): Promise<string> => {
    return withRetry(
      async () => {
        const result = await createUser();
        return result as string;
      },
      {
        maxAttempts: MAX_INIT_RETRIES,
        baseDelay: 1000,
        onRetry: (attempt, error) => {
          console.log(
            `Convex user creation attempt ${attempt} failed, retrying...`,
            error
          );
        },
      }
    );
  }, [createUser]);

  // Update metadata with retry logic
  const updateMetadataWithRetry = useCallback(
    async (metadata: UserPublicMetadata): Promise<void> => {
      return withRetry(
        async () => {
          await updateUserMetadata({ publicMetadata: metadata });
        },
        {
          maxAttempts: MAX_INIT_RETRIES,
          baseDelay: 1000,
          onRetry: (attempt, error) => {
            console.log(
              `Metadata update attempt ${attempt} failed, retrying...`,
              error
            );
          },
        }
      );
    },
    [updateUserMetadata]
  );

  // Initialize onboarding - create Convex user if needed
  useEffect(() => {
    const initializeOnboarding = async () => {
      if (!user || !orgLoaded || isInitialized || initializingRef.current)
        return;

      initializingRef.current = true;
      setInitError(null);

      try {
        const currentMetadata = user.publicMetadata as
          | UserPublicMetadata
          | undefined;

        // If already completed, redirect to dashboard
        if (currentMetadata?.onboardingComplete) {
          router.push("/dashboard");
          return;
        }

        const needsConvexUser = !currentMetadata?.convexUserId;

        if (needsConvexUser) {
          let convexUserId: string;

          // Create Convex user (with retry for auth timing)
          try {
            convexUserId = await createUserWithRetry();
          } catch (error) {
            if (isAuthError(error)) {
              throw new Error(
                "Authentication is still being set up. Please wait a moment and try again."
              );
            }
            throw error;
          }

          // Update metadata with convexUserId
          const updatedMetadata: UserPublicMetadata = {
            ...currentMetadata,
            convexUserId,
          };

          await updateMetadataWithRetry(updatedMetadata);

          // Reload to get updated metadata
          try {
            await user.reload();
            await session?.reload();
          } catch (reloadError) {
            // Non-critical - continue even if reload fails
            console.warn("Session reload failed, continuing...", reloadError);
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize onboarding:", error);
        initializingRef.current = false;

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to initialize. Please try again.";

        setInitError(errorMessage);
      }
    };

    if (userLoaded && user && orgLoaded) {
      initializeOnboarding();
    }
  }, [
    userLoaded,
    user,
    orgLoaded,
    isInitialized,
    createUserWithRetry,
    updateMetadataWithRetry,
    session,
    router,
    retryCount,
  ]);

  // Handle retry
  const handleRetry = () => {
    initializingRef.current = false;
    setInitError(null);
    setRetryCount((prev) => prev + 1);
  };

  // Show error state with retry button
  if (initError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-destructive font-medium">
            Something went wrong
          </div>
          <p className="text-sm text-muted-foreground">{initError}</p>
          <Button onClick={handleRetry} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!userLoaded || !orgLoaded || !isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleStep1Complete = () => {
    if (hasOrganization) {
      // User already has org - go directly to dashboard
      router.push("/dashboard");
    } else {
      // New user without org - proceed to step 2
      setStep(2);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Only show stepper if there are multiple steps */}
        {totalSteps > 1 && (
          <StepIndicator currentStep={step} totalSteps={totalSteps} />
        )}

        {step === 1 && (
          <UserInfoStep
            onComplete={handleStep1Complete}
            isInvitedUser={hasOrganization}
          />
        )}

        {step === 2 && !hasOrganization && <OrganizationInfoStep />}
      </div>
    </div>
  );
}
