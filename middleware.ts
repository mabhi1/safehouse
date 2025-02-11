import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/privacy-policy",
  "/encryption-strategy",
  "/encrypt",
  "/decrypt",
  "/verify-master-password",
  "/about",
  "/contact",
  "/api/cron",
  "/api/passwords",
  "/api/notes",
  "/api/events",
  "/api/encryption",
]);

export default clerkMiddleware((auth, request) => {
  const url = request.url.split("/");
  if (!auth().userId && !isPublicRoute(request) && url[url.length - 1].length !== 0) {
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
