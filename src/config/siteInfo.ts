// Single source of truth for site-wide facts (Content & Safety brief, Part D + B4).
// Update values here and every page that imports them stays in sync.

export const siteInfo = {
  name: "SHE RISES — Safe Haven for Empowerment",
  shortName: "SHE RISES",
  status: "Registered 501(c)(3) nonprofit · EIN 39-3657272",
  taxMessage:
    "SHE RISES — Safe Haven for Empowerment is a registered 501(c)(3) nonprofit organization. EIN: 39-3657272. Donations are tax-deductible to the extent allowed by law.",
  whatWeAre:
    "A small, non-medical transitional housing program for adult women rebuilding stability after incarceration, homelessness, family disruption, or other major life transitions.",
  whereWeServe: "San Bernardino County, serving Southern California.",
  privacyNote:
    "For the safety and privacy of our residents, our home address is shared only with accepted participants.",
  whatWeAreNot: "Not a medical or clinical facility. Not a 24-hour crisis shelter.",
  tagline: "When SHE rises, we all rise.",
  pillars: ["Structured", "Personal", "Independence"],

  whoWeServe:
    "Adult women rebuilding stability after incarceration or while on parole or probation, homelessness or housing instability, family disruption, or other major life transitions.",

  whatWeOffer: [
    "Safe, structured shared housing",
    "Case management and individual goal planning",
    "Life skills, including the 6-module SHE RISES life-skills program with certificate",
    "Technology prep",
    "Job mentoring and employment readiness",
    "Peer mentoring",
    "Family reunification support",
    "Referrals to outside healthcare, mental health, and community providers",
  ],

  howItWorks: ["Reach Out", "Apply", "Move In", "Grow"],

  // B4 — one editable constant for bed availability, read everywhere it appears.
  bedsAvailable: "3–5",
  bedsAvailabilityNote: "Currently 3–5 beds available. Contact us to check current availability.",

  // C7 — flexible fee wording (never publish a fixed dollar amount).
  feeAnswer:
    "Yes. Program fees vary and are subject to change. Current fees and self-pay arrangements are discussed directly and privately with each applicant before enrollment.",

  contact: {
    email: "pransom@safehavenforempowerment.org",
    phone: "(909) 330-9240",
    phoneHref: "tel:+19093309240",
    hours: "Monday–Friday, 9:00 AM–5:00 PM (Pacific)",
    responseTime: "We respond within 1–2 business days.",
  },

  // A4 — participant app sign-up/intake URL. [CONFIRM: paste the real URL here]
  appUrl: "",
  preferToTalkLine: "Prefer to talk first? Call (909) 330-9240.",

  mission:
    "SHE RISES provides safe, structured transitional housing and supportive services for adult women rebuilding their lives after incarceration, homelessness, family disruption, or other major life transitions, so each woman can build the stability and independence to write her next chapter.",
} as const;

export default siteInfo;
