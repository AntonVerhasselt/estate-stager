"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserPublicMetadata } from "@/types/clerk";

interface UserInfoStepProps {
  onComplete: () => void;
  isInvitedUser?: boolean;
}

export function UserInfoStep({ onComplete, isInvitedUser = false }: UserInfoStepProps) {
  const { user } = useUser();
  const { session } = useClerk();
  const completeUserInfo = useMutation(api.users.update.completeUserInfo);
  const updateUserInfo = useAction(api.users.updateClerk.updateUserInfo);
  const updateUserMetadata = useAction(api.users.updateClerk.updateUserMetadata);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("User not found");
      }

      // Update Clerk user info via Convex action (backend)
      await updateUserInfo({
        firstName,
        lastName,
      });

      // Update Convex user
      await completeUserInfo({
        firstName,
        lastName,
        phoneNumber,
      });

      // Update Clerk metadata via Convex action
      const currentMetadata = (user.publicMetadata || {}) as UserPublicMetadata;
      const updatedMetadata: UserPublicMetadata = {
        ...currentMetadata,
        onboardingStep: 1,
        ...(isInvitedUser && { onboardingComplete: true }),
      };

      await updateUserMetadata({
        publicMetadata: updatedMetadata,
      });

      // Reload session to get fresh JWT with updated metadata
      // This is critical for invited users who complete onboarding after step 1
      // Wrap in try-catch as this can fail for invited users with timing issues
      try {
        await session?.reload();
      } catch (reloadError) {
        // Non-critical - the metadata is already updated, so we can continue
        // The next page load will have the updated session
        console.warn("Session reload failed, continuing...", reloadError);
      }

      onComplete();
    } catch (err) {
      let errorMessage = "An error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
        // Provide helpful error message for authentication issues
        if (err.message.includes("Not authenticated") || err.message.includes("authentication")) {
          errorMessage = "Authentication error. Please ensure Personal Accounts are enabled in Clerk Dashboard settings.";
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
        <p className="text-sm text-muted-foreground">
          We need some basic information to get started.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}

