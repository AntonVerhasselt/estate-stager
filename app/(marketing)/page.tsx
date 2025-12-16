import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Clock,
  Eye,
  Zap,
  Users,
  TrendingUp,
  Home,
  Quote,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ============================================================================
// METADATA
// ============================================================================
export const metadata = {
  title: "estager - Turn 'I Like It' Into 'I Want It'",
  description:
    "Show buyers their future home – in their style – at the moment it matters most. Personalized virtual staging delivered via WhatsApp during property viewings.",
}

// ============================================================================
// PAGE
// ============================================================================
export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="secondary" className="mb-6">
            Early Access Now Available
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">
            Turn &ldquo;I Like It&rdquo; Into{" "}
            <span className="text-primary">&ldquo;I Want It&rdquo;</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Show buyers their future home – in their style – at the moment it
            matters most. Our service lets real estate agents send buyers fully
            furnished, personalized room visuals during a viewing, via WhatsApp.
            No extra apps, no complicated tech – just an instant way for clients
            to imagine life in a new home.
          </p>
          <Button asChild size="lg" className="h-11 px-6">
            <Link href="/dashboard">
              Get Early Access Now
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8">
            Why Buyers Hesitate
          </h2>

          <div className="space-y-6 text-muted-foreground">
            <p className="text-center text-lg">
              &ldquo;I like the house, but I can&apos;t imagine it.&rdquo;{" "}
              <span className="text-foreground font-medium">Sound familiar?</span>
            </p>

            <p>
              Real estate decisions are emotional, yet most viewings leave buyers
              staring at empty or mis-matched spaces. They struggle to picture
              their own furniture, family, or style in a house that&apos;s not
              theirs (yet).
            </p>

            {/* Quote */}
            <Card className="bg-background">
              <CardContent className="py-6">
                <div className="flex gap-4">
                  <Quote className="size-8 text-primary/30 shrink-0" />
                  <div>
                    <p className="italic text-foreground mb-2">
                      &ldquo;Buyers only know what they see, not the way it&apos;s
                      going to be.&rdquo;
                    </p>
                    <p className="text-sm">— Barb Schwarz, Home-staging pioneer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistic */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-primary/5 px-5 py-3 rounded-none">
                <span className="text-3xl font-semibold text-primary">82%</span>
                <span className="text-sm text-foreground">
                  of buyer&apos;s agents say staging makes it easier
                  <br />
                  for buyers to visualize a property as their future home
                </span>
              </div>
            </div>

            <p>
              When buyers can&apos;t mentally move in, they hesitate. Momentum
              fades, second-guessing creeps in, and agents hear &ldquo;We need to
              think about it.&rdquo; Deals stall not because the home isn&apos;t
              right, but because the buyer can&apos;t see it as right.
            </p>

            <p className="text-center font-medium text-foreground">
              There&apos;s a gap between a house that&apos;s merely viewed and a
              home that&apos;s envisioned.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              Our Solution: Personalized Staging, Live During the Visit
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We created a solution to remove that imagination gap on the spot.
              Think of it as personalized virtual staging delivered in real-time.
            </p>
          </div>

          <Card className="bg-primary/[0.02] ring-primary/20">
            <CardContent className="py-8 px-6 sm:px-10 space-y-6">
              <p className="text-muted-foreground">
                Before a showing, your buyer quickly swipes through a fun,
                60-second style quiz (no homework, no app download). Our system
                then prepares tailored interior designs for each room using your
                actual listing photos – but now furnished and decorated in the
                buyer&apos;s own taste.
              </p>

              <p className="text-muted-foreground">
                During the visit, as you walk into the empty living room or that
                dated bedroom, you simply pull up the app&apos;s Visit Mode and
                hit send. An image of the room, fully furnished in their favorite
                style, appears in your shared WhatsApp chat.
              </p>

              <p className="text-foreground font-medium">
                The buyer looks at their phone and then back at the room with new
                eyes – suddenly, it clicks! They&apos;re not just looking at walls
                and floors anymore; they&apos;re imagining family dinners in
                &ldquo;their&rdquo; dining room, relaxing in &ldquo;their&rdquo;
                cozy lounge, and picturing their kids playing in the yard.
              </p>

              <div className="flex items-start gap-3 bg-primary/10 px-4 py-3 rounded-none">
                <MessageSquare className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Agent and Buyer, in Sync:
                  </span>{" "}
                  <span className="text-muted-foreground">
                    All the visuals go straight into a WhatsApp group that both
                    you and the buyer have. It&apos;s already in their pocket, to
                    review on the drive home or show to a spouse that evening.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">Three simple steps to transform every viewing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <Badge variant="secondary">Step 1</Badge>
                </div>
                <CardTitle className="text-base">Before the Visit</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Send the buyer a quick &ldquo;style swipe&rdquo; quiz link ahead
                  of the viewing. In about a minute of swiping through decor
                  images, they express their interior design taste.
                </p>
                <p>
                  Our system instantly generates a personalized design profile and
                  creates custom-furnished images for key rooms, perfectly tuned
                  to the buyer&apos;s style preferences.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-primary/[0.02] ring-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
                    <Sparkles className="size-5 text-primary" />
                  </div>
                  <Badge>Step 2</Badge>
                </div>
                <CardTitle className="text-base">During the Visit</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Open our app in Visit Mode. As you step into each empty or
                  undecorated room, simply select the matching prepared image and
                  hit send.
                </p>
                <p>
                  The buyer receives a gorgeous, tailor-made vision of that very
                  room on WhatsApp in seconds. No clunky setup, no camera needed,
                  no asking the buyer to download anything.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
                    <Eye className="size-5 text-primary" />
                  </div>
                  <Badge variant="secondary">Step 3</Badge>
                </div>
                <CardTitle className="text-base">After the Visit</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Your buyer doesn&apos;t walk away with just vague memories. They
                  have a WhatsApp gallery of &ldquo;their future home&rdquo; in
                  hand – the living room styled just for them, the master bedroom
                  as they would have it.
                </p>
                <p>
                  They&apos;ll share these images with a partner, family, or
                  friends, excitedly talking about possibilities. You stay part of
                  the conversation effortlessly.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            All of this happens without changing anything about how you normally
            work. You&apos;re still using your phone, WhatsApp, and your listing
            photos – nothing new to learn or integrate into your CRM.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              Why Real Estate Agents Love This Tool
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Benefit 1 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
                    <Zap className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    Fits Right Into Your Workflow
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  You don&apos;t need to be a tech wizard or change your sales
                  routine. Our solution works with what you already have: use the
                  listing photos you&apos;ve already taken and deliver via
                  WhatsApp, which you&apos;re probably using with clients anyway.
                  There&apos;s no new platform for your buyer to sign up for, no
                  awkward gadgets at the viewing.
                </p>
              </CardContent>
            </Card>

            {/* Benefit 2 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
                    <Users className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    Upgrades the Viewing Experience
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  In a competitive market, you&apos;re not just selling a house –
                  you&apos;re selling how you sell that house. Impress clients
                  from the get-go with a premium, personalized touch.
                  You&apos;ll differentiate yourself as an agent who goes beyond
                  the usual brochure-and-chat routine. The visit turns into a
                  memorable experience, and your professionalism shines through.
                </p>
              </CardContent>
            </Card>

            {/* Benefit 3 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
                    <TrendingUp className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    Helps Buyers Decide Faster
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  By the time they finish the tour, your buyers aren&apos;t saying
                  &ldquo;We&apos;ll think about it&rdquo; – they&apos;re
                  discussing where to place the sofa or how perfect the
                  kids&apos; room looks. By clearing up vague objections and
                  painting a clear picture, you make their decision easier and
                  quicker. When buyers can see themselves living there, you
                  shorten the path from liking a home to loving it.
                </p>
              </CardContent>
            </Card>

            {/* Benefit 4 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
                    <Home className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    Perfect for Normal Homes (Not Just Luxury)
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  This isn&apos;t a toy for multi-million euro penthouses –
                  it&apos;s built for the everyday listings that make up your
                  bread and butter. Selling a mid-priced family home that&apos;s
                  empty, outdated, or blandly furnished? That&apos;s exactly where
                  our tool shines. You can now provide a tailored staging
                  experience without lifting a single couch cushion (or spending
                  thousands on rental furniture).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            See the Difference, Sell the Difference
          </h2>

          <div className="space-y-4 text-muted-foreground mb-8">
            <p>
              Instead of telling clients &ldquo;Imagine this home as yours,&rdquo;
              you&apos;ll be showing them it is theirs – decorated, furnished, and
              brought to life. The result? Stronger emotional engagement, clearer
              &ldquo;this is the one&rdquo; reactions, and yes, ultimately faster
              decisions and smoother deals.
            </p>

            <p className="text-foreground font-medium">
              You become the agent who translates potential into reality, the one
              who turns &ldquo;I like it, but…&rdquo; into &ldquo;I can&apos;t
              wait to move in!&rdquo;
            </p>
          </div>

          {/* Value Proposition */}
          <Card className="bg-background mb-8">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground italic">
                &ldquo;I help your buyer imagine themselves living here — clearly,
                instantly, and without friction.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                That&apos;s the promise behind our product.
              </p>
            </CardContent>
          </Card>

          <p className="text-muted-foreground mb-6">
            Ready to turn &ldquo;I can&apos;t picture it&rdquo; into &ldquo;this
            feels like home&rdquo; for your buyers? Join our early access program
            and make every viewing an aha moment.
          </p>

          <Button asChild size="lg" className="h-11 px-8">
            <Link href="/dashboard">
              <Sparkles data-icon="inline-start" />
              Get Started Today
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            Because when buyers see their future home clearly, you&apos;ll see
            better results – faster.
          </p>
        </div>
      </section>
    </div>
  )
}
