import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import ApplicationModal from "@/components/modals/ApplicationModal";
import { siteInfo } from "@/config/siteInfo";
import { Home, Users, Calendar, Phone, Mail, Check } from "lucide-react";

import transitionalHomeImage from "@/assets/transitional-home.jpg";
import employmentReadinessImage from "@/assets/employment-readiness.jpg";
import mentoringImage from "@/assets/mentoring.jpg";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="eyebrow mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-text">{children}</p>
);

type Program = {
  id: string; title: string; subtitle?: string; icon: typeof Home; image: string; description: string;
  features?: string[]; featuresLabel?: string; capacity?: string; availability?: string;
  recentEvents?: string[]; upcoming?: string;
};

const programs: Program[] = [
  {
    id: "transitional-housing",
    title: "Transitional Housing",
    subtitle: "NOW OPEN",
    icon: Home,
    image: transitionalHomeImage,
    description: "Safe and supportive shared housing for women transitioning from incarceration, homelessness, or unstable environments. Our home provides structure, stability, and individualized support as women work toward independence.",
    featuresLabel: "Program Features",
    features: [
      "Safe, structured shared housing",
      "Case management & individualized goal planning",
      "Life skills, empowerment, and reentry support",
      "Employment readiness resources",
      "Referrals to healthcare, mental health, and community resources",
    ],
    capacity: siteInfo.bedsAvailabilityNote,
  },
  {
    id: "reentry-support",
    title: "Reentry Support & Empowerment Services",
    icon: Users,
    image: employmentReadinessImage,
    description: "Community-based services designed to support women reentering society or seeking stability after crisis or hardship.",
    featuresLabel: "Services Include",
    features: [
      "Resume building & job search assistance",
      "Support with IDs, benefits, and documentation",
      "Appointment support",
      "Resource navigation (housing, employment, education, etc.)",
      "Empowerment workshops & peer support",
    ],
    availability: "Open to women throughout Southern California.",
  },
  {
    id: "community-outreach",
    title: "Community Outreach & Events",
    icon: Calendar,
    image: mentoringImage,
    description: "She Rises actively engages in outreach efforts to connect women with essential community resources, partners, and support networks.",
    recentEvents: ["HIRE Reentry Resource Fair — Anaheim", "RCC Rising Scholars Fall Festival — Riverside"],
    upcoming: "Additional community events, workshops, and outreach activities will be announced throughout the year.",
  },
];

const impact = [
  "Transitional Housing Now Open (San Bernardino County)",
  "Comprehensive reentry and empowerment services",
  "Community partnerships across the Inland Empire and Orange County",
  "Expansion planned for 2026–2027",
];

const steps = [
  { title: "Reach Out", text: "Contact us by phone or email to discuss your needs and learn about our programs.", items: ["(909) 330-9240", "Mon–Fri: 9AM–5PM PST"] },
  { title: "Initial Conversation", text: "We'll discuss your situation, answer questions, and determine which services may be right for you.", items: ["Confidential conversation", "No judgment, only support", "Referrals if needed"] },
  { title: "Next Steps Together", text: "If She Rises is the right fit, we'll work with you on intake, planning, and getting started.", items: ["Personalized planning", "Clear expectations", "Ongoing support"] },
];

const Programs = () => {
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <Hero
        title="Our Programs"
        subtitle="SHE RISES provides supportive services to help women rebuild their lives with dignity, stability, and purpose. Our non-medical transitional housing is now open, with supportive services for justice-impacted and at-risk women across Southern California."
        backgroundImage={employmentReadinessImage}
        backgroundImageAlt="She Rises Programs - Empowering women through supportive services"
        backgroundImageWidth={1920}
        backgroundImageHeight={1080}
        parallax={true}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent text-primary-deep hover:bg-accent/90 font-bold rounded-full px-8" onClick={() => setOpen(true)}>
              Apply / Contact Us
            </Button>
            <a href="#our-programs">
              <Button size="lg" className="hero-button-secondary btn-force-visible rounded-full px-8">Learn More</Button>
            </a>
          </div>
          <p className="text-sm text-primary-foreground/90 text-shadow-hero">{siteInfo.preferToTalkLine}</p>
        </div>
      </Hero>

      {/* Programs */}
      <section id="our-programs" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Eyebrow>What we provide</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">Services built around you</h2>
          </div>
          <div className="space-y-8">
            {programs.map((p, i) => (
              <article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-shadow hover:shadow-medium">
                <div className={`md:flex ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                  <div className="md:w-2/5 relative">
                    <img src={p.image} alt={p.title} className="w-full h-64 md:h-full object-cover" loading="lazy" />
                    {p.subtitle && (
                      <span className="absolute top-4 left-4 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-deep">{p.subtitle}</span>
                    )}
                  </div>
                  <div className="p-8 md:p-10 md:w-3/5">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-5">
                      <p.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">{p.title}</h3>
                    <p className="text-muted-foreground text-lg mb-6">{p.description}</p>

                    {p.features && (
                      <>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-label mb-3">{p.featuresLabel}</p>
                        <ul className="space-y-2 mb-6">
                          {p.features.map((f) => (
                            <li key={f} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-accent-text flex-shrink-0 mt-0.5" />
                              <span className="text-foreground/90">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {p.recentEvents && (
                      <>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-label mb-3">Recent Events</p>
                        <ul className="space-y-2 mb-6">
                          {p.recentEvents.map((e) => (
                            <li key={e} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-accent-text flex-shrink-0 mt-0.5" />
                              <span className="text-foreground/90">{e}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {(p.capacity || p.availability || p.upcoming) && (
                      <div className="rounded-xl bg-surface-alt border border-border p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-label mb-1">
                          {p.capacity ? "Capacity" : p.availability ? "Availability" : "Upcoming"}
                        </p>
                        <p className="text-sm text-foreground/90">{p.capacity || p.availability || p.upcoming}</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Eyebrow>Our growth</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5">Our Growing Impact</h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">
            We are building a strong foundation to support women across Southern California through comprehensive programs.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {impact.map((t) => (
              <div key={t} className="flex items-start gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5">
                <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & What to Expect */}
      <section id="eligibility" data-section="services" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Eyebrow>Before you apply</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Eligibility & What to Expect</h2>
            <p className="text-lg text-muted-foreground">Who our program serves and what joining looks like.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
              <h3 className="text-xl font-bold text-foreground mb-3">Who is eligible</h3>
              <p className="text-muted-foreground">Adult women (18+) rebuilding stability after incarceration or while on parole or probation, experiencing homelessness or housing instability, or recovering from family disruption or another major life transition.</p>
              <h3 className="text-xl font-bold text-foreground mb-2 mt-8">Program fee</h3>
              <p className="text-muted-foreground">{siteInfo.feeAnswer}</p>
              <h3 className="text-xl font-bold text-foreground mb-2 mt-8">Who may not be a fit</h3>
              <p className="text-muted-foreground">
                SHE RISES is a non-medical program. Women who need medical detox, 24-hour supervision, or clinical care will be connected with appropriate outside providers.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
              <h3 className="text-xl font-bold text-foreground mb-3">Program requirements</h3>
              <p className="text-muted-foreground mb-8">[CONFIRM: sobriety expectations, background or other requirements]</p>
              <h3 className="text-xl font-bold text-foreground mb-3">Length of stay</h3>
              <p className="text-muted-foreground mb-8">[CONFIRM]</p>
              <h3 className="text-xl font-bold text-foreground mb-3">House guidelines (overview)</h3>
              <p className="text-muted-foreground mb-8">[CONFIRM: curfew, chores, meetings, visitors]</p>
              <h3 className="text-xl font-bold text-foreground mb-3">What to bring on move-in day</h3>
              <p className="text-muted-foreground">[CONFIRM]</p>
            </div>
          </div>
        </div>
      </section>

      {/* After You Apply */}
      <section className="py-20 md:py-28 bg-surface-alt">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <Eyebrow>After you apply</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">What Happens Next</h2>
          </div>
          <ol className="space-y-4">
            {[
              "We review your application and contact you within 1–2 business days.",
              "We schedule an intake conversation.",
              "If a bed is available and the program is a good fit, we set a move-in date. If no bed is open, we'll let you know about the waitlist [CONFIRM: waitlist process].",
              "You move in and begin case management and life-skills work.",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-lg font-extrabold text-primary-deep">{i + 1}</div>
                <p className="text-foreground/90 pt-2">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How to start */}
      <section className="py-20 md:py-28 bg-surface-alt">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">How to Get Started</h2>
            <p className="text-lg text-muted-foreground">Ready to learn more or connect with our programs?</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border bg-surface p-8 shadow-soft transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-5 text-xl font-extrabold text-primary-deep">{i + 1}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground mb-4">{s.text}</p>
                <ul className="space-y-1 text-sm text-foreground/80">
                  {s.items.map((it) => <li key={it}>• {it}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="bg-accent text-primary-deep hover:bg-accent/90 font-bold rounded-full px-10" onClick={() => setOpen(true)}>
              Contact Us Today
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-primary-deep text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 mb-3">Contact us to learn more about our programs and services.</p>
          <p className="text-sm opacity-80 mb-10">
            Not a 24-hour crisis shelter. For immediate crisis support, please call 988 (Suicide & Crisis Lifeline) or 211 (Homeless Outreach).
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <a href="tel:+19093309240" className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 transition-colors hover:bg-primary-foreground/10">
              <Phone className="h-7 w-7 text-accent mx-auto mb-3" />
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent mb-1">Call She Rises</p>
              <p className="text-2xl font-extrabold">(909) 330-9240</p>
              <p className="text-sm opacity-80">Mon–Fri: 9AM–5PM PST</p>
            </a>
            <a href="mailto:pransom@safehavenforempowerment.org" className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 transition-colors hover:bg-primary-foreground/10">
              <Mail className="h-7 w-7 text-accent mx-auto mb-3" />
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent mb-1">Email Us</p>
              <p className="text-sm font-bold break-all">pransom@safehavenforempowerment.org</p>
              <p className="text-sm opacity-80">Response within 1–2 business days</p>
            </a>
          </div>
        </div>
      </section>

      <ApplicationModal isOpen={open} onClose={() => setOpen(false)} />
    </Layout>
  );
};

export default Programs;
