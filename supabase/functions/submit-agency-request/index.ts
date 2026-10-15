import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const rate = new Map<string, { count: number; reset: number }>();
const allow = (ip: string) => {
  const now = Date.now();
  const r = rate.get(ip);
  if (!r || now > r.reset) { rate.set(ip, { count: 1, reset: now + 600_000 }); return true; }
  if (r.count >= 3) return false;
  r.count++; return true;
};

const schema = z.object({
  contactName: z.string().trim().min(2).max(100),
  title: z.string().trim().min(2).max(100),
  agencyName: z.string().trim().min(2).max(150),
  agencyType: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  notes: z.string().trim().max(1000).optional().default(""),
  honeypot: z.string().optional(),
});

const esc = (t: string) => t.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]!));
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json", ...cors } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!allow(ip)) return json({ ok: false, error: "Too many requests. Please try again later." }, 429);

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ ok: false, error: "Please check the form and try again." }, 400);
    const d = parsed.data;
    if (d.honeypot) return json({ ok: false, error: "Invalid submission" }, 400);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error: dbError } = await supabase.from("form_submissions").insert({
      form_type: "agency_access_request",
      name: d.contactName,
      email: d.email,
      phone: d.phone,
      subject: `Agency access request — ${d.agencyName}`,
      category: d.agencyType,
      message: d.notes || null,
      status: "new",
      form_data: { contactName: d.contactName, title: d.title, agencyName: d.agencyName, agencyType: d.agencyType, email: d.email, phone: d.phone, notes: d.notes },
    });
    if (dbError) { console.error("DB insert failed", dbError); return json({ ok: false, error: "Submission failed. Please try again later." }, 500); }

    const rows: [string, string][] = [
      ["Name", d.contactName], ["Title", d.title], ["Agency", d.agencyName], ["Agency type", d.agencyType],
      ["Work email", d.email], ["Work phone", d.phone], ["Notes", d.notes || "—"],
    ];
    const html = `<h2>New Agency Access Request</h2><p>Verify this agency, then send the private sherises-intake.org agency sign-up link.</p><table style="border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="padding:6px;border:1px solid #ddd"><strong>${k}</strong></td><td style="padding:6px;border:1px solid #ddd">${esc(v)}</td></tr>`)
      .join("")}</table>`;

    const key = Deno.env.get("RESEND_API_KEY");
    if (key) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          from: "Safe Haven <no-reply@safehavenforempowerment.org>",
          to: ["pransom@safehavenforempowerment.org"],
          reply_to: d.email,
          subject: `Agency Access Request — ${d.agencyName}`,
          html,
          text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
        }),
      });
      if (!r.ok) console.error("Email failed", await r.text());
    }
    return json({ ok: true });
  } catch (e) {
    console.error("submit-agency-request error", e);
    return json({ ok: false, error: "Submission failed. Please try again later." }, 500);
  }
});
