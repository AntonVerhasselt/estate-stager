import { MarketingNavbar } from "@/components/marketing/navbar"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main>{children}</main>
    </div>
  )
}


