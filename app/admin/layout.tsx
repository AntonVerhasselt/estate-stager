import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="p-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard" className="gap-2">
              <ArrowLeftIcon className="size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
      <main className="p-6">{children}</main>
    </div>
  );
}

