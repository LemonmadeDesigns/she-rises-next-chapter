import Layout from "@/components/layout/Layout";
import { Mail } from "lucide-react";
import siteInfo from "@/config/siteInfo";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Privacy Policy
        </h1>
        <p className="eyebrow mb-8">Last updated: October 2026 · [CONFIRM: legal review]</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">What we collect</h2>
            <p>
              When you contact us, apply for a program, sign up for our newsletter, place a shop
              order, or make a donation, we collect the information you provide — typically your
              name, email address, phone number, and the details of your message or request.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">How we use it</h2>
            <p>
              We use your information only to respond to you, process your application, order, or
              donation, and send you updates you have asked for. We never sell your information,
              and we never share it with anyone outside SHE RISES staff who need it to support you.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Your privacy and safety</h2>
            <p>
              Information you share with SHE RISES is kept confidential and shared only with program
              staff who need it to support you. Our residence address is never published; it is
              shared only with accepted participants.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Requesting deletion</h2>
            <p>
              You may ask us at any time to delete the personal information we hold about you. Email
              us with your request and we will remove it promptly.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Contact us</h2>
            <p className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-accent-text flex-shrink-0 mt-0.5" />
              <a
                href={`mailto:${siteInfo.contact.email}`}
                className="text-foreground font-medium hover:text-primary break-all"
              >
                {siteInfo.contact.email}
              </a>
            </p>
            <p className="mt-2">{siteInfo.contact.phone} · {siteInfo.contact.hours}</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
