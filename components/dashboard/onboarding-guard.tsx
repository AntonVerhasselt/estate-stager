"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { UserPublicMetadata } from "@/types/clerk";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const metadata = user.publicMetadata as UserPublicMetadata | undefined;
    
    if (!metadata?.onboardingComplete) {
      router.push("/onboarding");
      return;
    }

    setIsChecking(false);
  }, [user, isLoaded, router]);

  if (!isLoaded || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
