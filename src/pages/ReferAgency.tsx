import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const SIGNUP_URL = "https://sherises-intake.org/agency/signup";
const REQUEST_ACCESS_URL = "https://sherises-intake.org/agency/request-access";

export default function ReferAgency() {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-text">For referring agencies</p>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4">Refer a Client</h1>
            <p className="text-lg text-muted-foreground">
              Probation officers, parole agents, case managers, and partner organizations can create an agency login and start
              submitting client referrals right away. Your agency details are saved to your account, so you only enter them once.
            </p>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-6 md:p-8 text-center">
              <a
                href={SIGNUP_URL}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3 text-base font-bold text-primary-deep transition-colors hover:bg-accent/90"
              >
                Create an Agency Login
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-5 text-sm text-muted-foreground">
                Prefer to ask first?{" "}
                <a
                  href={REQUEST_ACCESS_URL}
                  className="font-semibold text-accent-text underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Request agency access
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
