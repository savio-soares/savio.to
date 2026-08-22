// Railway pings this path (healthcheckPath in railway.json) before routing
// traffic to a new deploy. Kept outside `[locale]` on purpose: the proxy
// matcher skips `/api`, so there is no locale redirect in the way.
export async function GET() {
  return Response.json({ status: "ok", uptime: process.uptime() });
}
