import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background h-14 flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/dashboard" className="font-semibold text-lg tracking-tight">
          <span className="text-primary">est</span>ager
        </Link>
        
        {/* User Button */}
        <UserButton />
      </header>
      
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}

