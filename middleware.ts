import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/privacy-policy",
  "/encryption-strategy",
  "/about",
  "/contact",
  "/api/cron",
  "/api/passwords",
  "/api/notes",
  "/api/crypto",
]);

export default clerkMiddleware((auth, request) => {
  const url = request.url.split("/");
  if (!isPublicRoute(request) && url[url.length - 1].length !== 0) {
    auth().protect();
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
