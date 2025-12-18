"use client";

import { useState, useEffect } from "react";
import { useUser, useOrganizationList, useOrganization, useClerk } from "@clerk/nextjs";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UserPublicMetadata } from "@/types/clerk";

export function OrganizationInfoStep() {
  const { user } = useUser();
  const { session } = useClerk();
  const { createOrganization, setActive, isLoaded: orgListLoaded } = useOrganizationList();
  const { organization } = useOrganization();
  const createOrg = useMutation(api.organizations.create.createOrganization);
  const updateOrganizationMetadata = useAction(api.organizations.updateClerk.updateOrganizationMetadata);
  const updateUserMetadata = useAction(api.users.updateClerk.updateUserMetadata);
  const [name, setName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingMetadataUpdate, setPendingMetadataUpdate] = useState<{
    clerkOrgId: string;
    convexOrgId: string;
  } | null>(null);

  // Update organization metadata after it's been set as active
  useEffect(() => {
    const updateOrgMetadata = async () => {
      if (organization && pendingMetadataUpdate && organization.id === pendingMetadataUpdate.clerkOrgId) {
        try {
          await updateOrganizationMetadata({
            organizationId: organization.id,
            publicMetadata: {
              convexOrganizationId: pendingMetadataUpdate.convexOrgId,
            },
          });

          await organization.reload();
          setPendingMetadataUpdate(null);
        } catch (err) {
          console.error("Failed to update organization metadata:", err);
          // Non-critical error, continue with flow
        }
      }
    };
    updateOrgMetadata();
  }, [organization, pendingMetadataUpdate, updateOrganizationMetadata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("User not found");
      }

      if (!orgListLoaded) {
        throw new Error("Organization list is still loading. Please wait.");
      }

      if (!createOrganization) {
        throw new Error("Organization creation not available. Please refresh the page.");
      }

      if (!setActive) {
        throw new Error("Organization switching not available. Please refresh the page.");
      }

      // Create Clerk organization
      const clerkOrg = await createOrganization({
        name,
      });

      if (!clerkOrg) {
        throw new Error("Failed to create organization");
      }

      // Set as active organization
      await setActive({ organization: clerkOrg.id });

      // Create Convex organization
      const convexOrgId = await createOrg({
        clerkOrganizationId: clerkOrg.id,
        name,
        vatNumber,
        address,
      });

      // Update organization metadata immediately (don't wait for useEffect)
      try {
        await updateOrganizationMetadata({
          organizationId: clerkOrg.id,
          publicMetadata: {
            convexOrganizationId: convexOrgId as unknown as string,
          },
        });
      } catch (err) {
        console.error("Failed to update organization metadata:", err);
        // Non-critical error, continue with flow
      }

      // Update Clerk user metadata via Convex action
      const currentMetadata = (user.publicMetadata || {}) as UserPublicMetadata;
      const updatedMetadata: UserPublicMetadata = {
        ...currentMetadata,
        onboardingStep: 2,
        onboardingComplete: true,
      };

      await updateUserMetadata({
        publicMetadata: updatedMetadata,
      });

      // Reload session to get fresh JWT with updated metadata
      // This is critical - user.reload() only refreshes the user object,
      // but session.reload() refreshes the JWT token that middleware reads
      // Wrap in try-catch as this can fail with timing issues
      try {
        await session?.reload();
      } catch (reloadError) {
        // Non-critical - the metadata is already updated
        // The redirect will trigger a full page load with fresh session
        console.warn("Session reload failed, continuing...", reloadError);
      }

      // Now redirect - middleware will see updated claims
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Organization Information</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your organization.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Legal Name</Label>
          <Input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corporation"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vatNumber">VAT Number</Label>
          <Input
            id="vatNumber"
            type="text"
            required
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            placeholder="BE0123456789"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main Street, City, Country"
            disabled={isSubmitting}
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Complete Setup"}
      </Button>
    </form>
  );
}

