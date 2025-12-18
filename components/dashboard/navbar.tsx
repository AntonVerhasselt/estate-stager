"use client";

import Link from "next/link";
import { UserButton, useClerk } from "@clerk/nextjs";
import { Building2Icon } from "lucide-react";

export function DashboardNavbar() {
  const { openOrganizationProfile } = useClerk();

  return (
    <header className="border-b bg-background h-14 flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/dashboard" className="font-semibold text-lg tracking-tight">
        <span className="text-primary">est</span>ager
      </Link>

      {/* User Button with Organization Settings as modal */}
      <UserButton
        afterSignOutUrl="/login"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Action
            label="Organization Settings"
            labelIcon={<Building2Icon className="size-4" />}
            onClick={() => openOrganizationProfile()}
          />
        </UserButton.MenuItems>
      </UserButton>
    </header>
  );
}
