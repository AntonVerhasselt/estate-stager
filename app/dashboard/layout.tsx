import { DashboardNavbar } from "@/components/dashboard/navbar";
import { OnboardingGuard } from "@/components/dashboard/onboarding-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <main className="p-6">{children}</main>
      </div>
    </OnboardingGuard>
  );
}

