import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, sessionStatus } = await auth();

  // Handle pending sessions (users who need to complete organization task)
  // Redirect them to onboarding instead of Clerk's organization creation
  if (sessionStatus === "pending" && sessionClaims?.sts === "pending") {
    // If user is trying to access register tasks (organization creation), redirect to onboarding
    if (req.nextUrl.pathname.includes("/register/tasks")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  // Protect dashboard and onboarding routes - require authentication only
  // Onboarding status check is done client-side to avoid JWT propagation timing issues
  if (isProtectedRoute(req)) {
    if (!userId) {
      await auth.protect();
      return;
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
