import Link from "next/link"
import { Check, ArrowRight, Phone, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ============================================================================
// METADATA
// ============================================================================
export const metadata = {
  title: "Pricing - estager",
  description: "Simple, transparent pricing that scales with how you work.",
}

// ============================================================================
// COMPONENTS
// ============================================================================
function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="size-4 text-primary mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  )
}

// ============================================================================
// PAGE
// ============================================================================
export default function PricingPage() {
  return (
    <div className="py-16 sm:py-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          Pricing
        </h1>
        <p className="text-lg text-muted-foreground">
          Simple, transparent pricing that scales with how you work.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Pay per Prospect */}
          <Card className="relative">
            <CardHeader className="pb-2">
              <Badge variant="secondary" className="w-fit mb-3">
                Best for individual agents
              </Badge>
              <h2 className="text-xl font-semibold">Pay per Prospect</h2>
              <p className="text-sm text-muted-foreground">
                Perfect for individual agents and small teams
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">€25</span>
                  <span className="text-muted-foreground">per prospect</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Max €150 per property
                </p>
              </div>

              {/* When counted - simplified */}
              <p className="text-sm text-muted-foreground">
                You only pay when images are delivered to your prospect. 
                Cancelled visits don&apos;t count.
              </p>

              {/* Features */}
              <div>
                <p className="text-sm font-medium mb-3">What&apos;s included</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <FeatureItem>Unlimited images per prospect</FeatureItem>
                  <FeatureItem>WhatsApp delivery during the visit</FeatureItem>
                  <FeatureItem>No limits on quality, speed, or usage</FeatureItem>
                </ul>
              </div>

              {/* Unsold Property Guarantee */}
              <div className="bg-muted/50 px-3 py-3 rounded-none space-y-1.5">
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary" />
                  Unsold Property Guarantee
                </p>
                <p className="text-xs text-muted-foreground">
                  Property taken off market without selling? We refund all usage costs 
                  for that property. No questions asked.
                </p>
              </div>

              {/* CTA */}
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  Try it yourself
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Unlimited Yearly */}
          <Card className="relative bg-primary/[0.02] ring-primary/20">
            <CardHeader className="pb-2">
              <Badge className="w-fit mb-3">
                Best for agencies
              </Badge>
              <h2 className="text-xl font-semibold">Unlimited — Yearly</h2>
              <p className="text-sm text-muted-foreground">
                Built for agencies selling 100+ homes per year
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">€15,000</span>
                  <span className="text-muted-foreground">per year</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Single predictable cost
                </p>
              </div>

              {/* Features */}
              <div>
                <p className="text-sm font-medium mb-3">Everything unlimited</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <FeatureItem>Unlimited prospects</FeatureItem>
                  <FeatureItem>Unlimited properties</FeatureItem>
                  <FeatureItem>Unlimited images</FeatureItem>
                  <FeatureItem>Unlimited WhatsApp sends</FeatureItem>
                  <FeatureItem>No tracking, no caps, no friction</FeatureItem>
                </ul>
              </div>

              {/* Ideal for */}
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Ideal if you:</p>
                <ul className="space-y-0.5">
                  <li>• work with multiple agents,</li>
                  <li>• handle a high volume of viewings,</li>
                  <li>• want a single predictable cost.</li>
                </ul>
              </div>

              {/* CTA */}
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <Phone data-icon="inline-start" />
                  Schedule a call
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* First-Month Activity Guarantee - Full Width Block */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-primary/5 ring-primary/20">
            <CardContent className="py-8 px-6 sm:px-10 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <ShieldCheck className="size-6 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                First-Month Activity Guarantee
              </h2>
              <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                Complete fewer than <strong className="text-foreground">10 visits</strong> in 
                your first month? We refund <strong className="text-foreground">100%</strong> of 
                what you paid. We&apos;ll even email you before month-end if you&apos;re below the threshold.
              </p>
              <p className="text-lg font-medium text-primary">
                There&apos;s no risk in trying.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


