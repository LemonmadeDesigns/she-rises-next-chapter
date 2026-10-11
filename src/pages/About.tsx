import { Button } from "@/components/ui/button";
import { Mail, Phone, Heart, Users, Shield, Target, Lightbulb, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import { Link } from "react-router-dom";
import { aboutHeroBlurDataUrl } from "@/assets/about-hero-blur-data";
import heroWomanImage from "@/assets/hero-woman.jpg";
import preciousRansomImage from "@/assets/precious-ransom.jpg";
import terrellLemonsImage from "@/assets/terrell-lemons.jpg";
import { siteInfo } from "@/config/siteInfo";

const values = [
  { icon: Shield, title: "Dignity", description: "Every woman deserves to be treated with respect and honor" },
  { icon: Heart, title: "Safety", description: "Creating secure environments where women can heal and grow" },
  { icon: Target, title: "Opportunity", description: "Opening doors to employment, education, and empowerment" },
  { icon: Users, title: "Community", description: "Building connections that last beyond our programs" },
  { icon: Lightbulb, title: "Empowerment", description: "Providing tools and support for women to rise and thrive" },
];

const whatWeDo = [
  "Safe, structured shared housing",
  "Case management and individual goal planning",
  "Life skills, including the 6-module SHE RISES life-skills program with certificate",
  "Technology prep",
  "Job mentoring and employment readiness",
  "Peer mentoring",
  "Family reunification support",
  "Referrals to outside healthcare, mental health, and community providers",
];

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="eyebrow mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-text">{children}</p>
);

const About = () => {
  return (
    <Layout>
      <Hero
        title="Our Mission"
        subtitle={siteInfo.mission}
        backgroundImage={heroWomanImage}
        backgroundImageBlur={aboutHeroBlurDataUrl}
        backgroundImageAlt="She Rises: Empowering women through safe housing and supportive services"
        backgroundImageWidth={1920}
        backgroundImageHeight={1080}
        parallax={true}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/programs">
            <Button size="lg" className="bg-accent text-primary-deep hover:bg-accent/90 font-bold rounded-full px-8">
              Our Programs
            </Button>
          </Link>
          <Link to="/get-involved">
            <Button size="lg" className="hero-button-secondary btn-force-visible rounded-full px-8">
              Get Involved
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="rounded-2xl bg-primary p-10 md:p-12 text-primary-foreground shadow-soft transition-transform duration-300 hover:-translate-y-1">
              <Eyebrow>Why we exist</Eyebrow>
              <h2 className="text-3xl font-extrabold mb-5">Our Mission</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                {siteInfo.mission}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-alt p-10 md:p-12 shadow-soft transition-transform duration-300 hover:-translate-y-1">
              <Eyebrow>Where we're going</Eyebrow>
              <h2 className="text-3xl font-extrabold text-foreground mb-5">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A community where women have the stability, tools, and encouragement to write her next chapter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-surface-alt">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Eyebrow>What guides us</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work and define our commitment to the women we serve
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {values.map((v) => (
              <div key={v.title} className="group rounded-2xl border border-border bg-surface p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
                  <v.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Eyebrow>Our story in brief</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">What We Do in 60 Seconds</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A quick overview of how we support women in their journey to independence
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-surface p-8 md:p-10 shadow-soft">
              <h3 className="text-2xl font-bold text-foreground mb-6">We Provide</h3>
              <ul className="space-y-4">
                {whatWeDo.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                      <Check className="h-3.5 w-3.5 text-primary-deep" />
                    </span>
                    <span className="text-foreground/90 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-primary-deep p-8 md:p-10 text-primary-foreground flex flex-col justify-center shadow-soft">
              <div className="text-7xl text-accent/50 font-extrabold leading-none mb-2">"</div>
              <blockquote className="text-3xl font-extrabold mb-5 leading-tight">When SHE rises, we all rise.</blockquote>
              <p className="opacity-90 mb-8 leading-relaxed">
                This isn't just our motto—it's our belief that when we invest in women,
                we strengthen families, communities, and society as a whole.
              </p>
              <Link to="/donate">
                <Button className="bg-accent text-primary-deep hover:bg-accent/90 font-bold rounded-full px-8">
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 md:py-28 bg-surface-alt">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Eyebrow>Our team</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Our Leadership</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leadership driven by experience, compassion, and unwavering dedication
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-14 shadow-soft">
            <div className="grid md:grid-cols-3 gap-10 items-center">
              <div className="md:col-span-2 space-y-5">
                <h3 className="text-3xl md:text-4xl font-extrabold text-foreground">Precious Ransom</h3>
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-label">Executive Director</p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With over a decade of experience in social services and community advocacy,
                  Precious founded She Rises after witnessing firsthand the challenges women face
                  when transitioning from incarceration back to community life. Her vision combines
                  practical support with dignified care, creating pathways for lasting transformation.
                </p>
                <blockquote className="border-l-4 border-accent bg-surface-alt rounded-r-xl pl-6 py-4 pr-4 text-lg italic text-foreground">
                  "Every woman who walks through our doors has a story of resilience. Our job is to
                  provide the foundation they need to write their next chapter with confidence and hope."
                </blockquote>
              </div>
              <div className="text-center">
                <div className="w-52 h-52 rounded-2xl mx-auto mb-6 overflow-hidden ring-4 ring-accent/40 shadow-soft">

                  <img src={preciousRansomImage} alt="Precious Ransom, Executive Director"
                    className="w-full h-full object-cover" style={{ objectPosition: "center 20%" }} />
                </div>
                <div className="space-y-3 text-sm">
                  <a href="mailto:pransom@safehavenforempowerment.org" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary break-all">
                    <Mail className="h-4 w-4 flex-shrink-0" /> pransom@safehavenforempowerment.org
                  </a>
                  <a href="tel:+19093309240" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
                    <Phone className="h-4 w-4" /> (909) 330-9240
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* President */}
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-14 shadow-soft mt-8">
            <div className="grid md:grid-cols-3 gap-10 items-center">
              <div className="md:col-span-2 space-y-5">
                <h3 className="text-3xl md:text-4xl font-extrabold text-foreground">Terrell D. Lemons, B.S.</h3>
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-label">
                  President | SHE RISES – Safe Haven for Empowerment
                </p>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Terrell D. Lemons, B.S., serves as President of SHE RISES – Safe Haven for
                    Empowerment, bringing a unique combination of leadership, technology, education,
                    and lived experience to the organization's mission.
                  </p>
                  <p>
                    With a Bachelor of Science in Computer Science from California State University,
                    Fullerton, and a professional background in software engineering, program
                    management, and education, Terrell understands the importance of opportunity,
                    accountability, and personal growth.
                  </p>
                  <p>
                    His passion for community empowerment is rooted in his own journey of overcoming
                    adversity and creating meaningful change. Through SHE RISES, he is committed to
                    helping women transitioning from incarceration, homelessness, and other
                    challenging circumstances gain the stability, resources, and practical skills
                    needed to rebuild their lives.
                  </p>
                  <p>
                    As President, Terrell focuses on strengthening program operations, expanding
                    opportunities, and helping participants develop the confidence, independence, and
                    long-term stability necessary to succeed beyond transitional housing.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-52 h-52 rounded-2xl mx-auto mb-6 overflow-hidden ring-4 ring-accent/40 shadow-soft">
                  <img src={terrellLemonsImage} alt="Terrell D. Lemons, B.S., President of SHE RISES"
                    className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3 text-sm">
                  <a href="mailto:pransom@safehavenforempowerment.org" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary break-all">
                    <Mail className="h-4 w-4 flex-shrink-0" /> pransom@safehavenforempowerment.org
                  </a>
                  <a href="tel:+19093309240" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
                    <Phone className="h-4 w-4" /> (909) 330-9240
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Eyebrow>Join us</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl opacity-90 mb-10 leading-relaxed">
            Join us in empowering women to write their next chapter. Every contribution,
            volunteer hour, and voice of support helps create lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate"><Button size="lg" className="w-full bg-accent text-primary-deep hover:bg-accent/90 font-bold rounded-full px-10">Donate Now</Button></Link>
            <Link to="/get-involved"><Button size="lg" className="w-full bg-rose text-rose-foreground hover:bg-rose-hover font-semibold rounded-full px-10">Get Involved</Button></Link>
            <Link to="/contact"><Button size="lg" variant="outline" className="w-full border-2 border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-full px-10">Contact Us</Button></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
