import { useState } from "react";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, ShieldCheck } from "lucide-react";

const schema = z.object({
  contactName: z.string().trim().min(2, "Please enter your full name").max(100),
  title: z.string().trim().min(2, "Please enter your title").max(100),
  agencyName: z.string().trim().min(2, "Please enter your agency name").max(150),
  agencyType: z.string().min(2, "Please choose an agency type"),
  email: z.string().trim().email("Please enter a valid work email").max(255),
  phone: z.string().trim().min(7, "Please enter a work phone").max(30),
  notes: z.string().trim().max(1000).optional(),
});

const agencyTypes = ["Probation", "Parole", "Reentry Organization", "Case Management / Social Services", "Shelter / Housing Program", "Treatment Program", "Other"];

const empty = { contactName: "", title: "", agencyName: "", agencyType: "", email: "", phone: "", notes: "", honeypot: "" };

export default function ReferAgency() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setStatus("sending");
    const { data, error } = await supabase.functions.invoke("submit-agency-request", { body: { ...r.data, honeypot: form.honeypot } });
    setStatus(error || !data?.ok ? "error" : "done");
  };

  const field = (k: keyof typeof empty, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} maxLength={255} />
      {errors[k] && <p className="text-sm text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-text">For referring agencies</p>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4">Agency Access Request</h1>
            <p className="text-lg text-muted-foreground">
              Probation officers, parole agents, case managers, and partner organizations can request access to our secure
              referral portal. Once we confirm your agency, we'll email you a private sign-up link to submit client referrals.
            </p>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-6 md:p-8">
              {status === "done" ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-accent-text mx-auto mb-4" />
                  <h2 className="font-heading text-2xl font-bold mb-2">Request received</h2>
                  <p className="text-muted-foreground">
                    Thank you. We'll verify your agency and email your private sign-up link within 1–2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {field("contactName", "Your full name")}
                    {field("title", "Title / role")}
                  </div>
                  {field("agencyName", "Agency name")}
                  <div className="space-y-2">
                    <Label>Agency type</Label>
                    <Select value={form.agencyType} onValueChange={(v) => set("agencyType", v)}>
                      <SelectTrigger><SelectValue placeholder="Choose one" /></SelectTrigger>
                      <SelectContent>
                        {agencyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.agencyType && <p className="text-sm text-destructive">{errors.agencyType}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {field("email", "Work email", "email")}
                    {field("phone", "Work phone", "tel")}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Anything we should know? (optional)</Label>
                    <Textarea id="notes" value={form.notes} maxLength={1000} onChange={(e) => set("notes", e.target.value)} />
                  </div>
                  <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={form.honeypot} onChange={(e) => set("honeypot", e.target.value)} aria-hidden="true" />
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                    Please don't include client information here — you'll submit that securely after you sign up.
                  </p>
                  {status === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again or call (909) 330-9240.</p>}
                  <Button type="submit" size="lg" disabled={status === "sending"} className="w-full rounded-full bg-accent text-primary-deep hover:bg-accent/90 font-bold">
                    {status === "sending" ? "Sending..." : "Request Agency Access"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
