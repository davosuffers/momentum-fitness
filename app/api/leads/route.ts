import { getRawDb } from "@/db";
import { leadRequestSchema } from "@/lib/leads";
const headers = { "Cache-Control": "no-store" };
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json({ error: "Please submit the form from this website." }, { status: 403, headers });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return Response.json({ error: "Please submit a valid form request." }, { status: 415, headers });
  if (Number(request.headers.get("content-length")) > 8192) return Response.json({ error: "The request is too large." }, { status: 413, headers });
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 8192) return Response.json({ error: "The request is too large." }, { status: 413, headers });
    body = JSON.parse(raw);
  } catch { return Response.json({ error: "Please check your details and try again." }, { status: 400, headers }); }
  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400, headers });
  if (parsed.data.website) return Response.json({ error: "We couldn’t verify this submission. Please reload the page and try again." }, { status: 400, headers });
  const { requestId, businessName, email, businessUrl, monthlyAdSpend } = parsed.data;
  try {
    await getRawDb().prepare('INSERT INTO "Leads" (id, business_name, email, business_url, monthly_ad_spend, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(requestId, businessName, email, businessUrl, monthlyAdSpend, "new", new Date().toISOString()).run();
    return Response.json({ ok: true }, { status: 201, headers });
  } catch (error) {
    console.error("Lead submission failed", error instanceof Error ? error.name : "StorageError");
    return Response.json({ error: "We couldn’t save your request right now. Your details are still here—please try again." }, { status: 503, headers });
  }
}
