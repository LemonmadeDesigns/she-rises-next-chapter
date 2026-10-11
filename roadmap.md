# Content & Safety Fix Pass (brief: SHE_RISES_PUBLIC_WEBSITE_-_CONTENT_SAFETY_pasted.md)

User confirmed: remove address everywhere; route everything to pransom@safehavenforempowerment.org; flexible fee wording everywhere (no $1,000 published); add Terrell D. Lemon Sr. as President with provided bio.

## Part C — Safety & Accuracy
- [ ] C1 Remove 9154 Laurel Ave / Fontana / 92335 everywhere; privacy wording; remove map embeds; "Schedule a Visit" → "Schedule a Call" (contact form, category Program Services & Support)
- [ ] C2 Delete "Getting Here" list
- [ ] C3 One contact: pransom@ · (909) 330-9240 · Mon–Fri 9–5 PT; remove empowerhavenhomes@gmail.com from site; response wording "1–2 business days" everywhere; edge functions route to pransom@
- [ ] C4 Collapse department directory into one card
- [ ] C5 Crisis language: buttons → "Emergency Resources" scroll; banner text per brief; keep 24/7 list
- [ ] C6 Gold tier "Tour of facilities" → "Virtual program update with leadership"
- [x] C7 Fee wording (flexible, already applied — keep, no $1,000)
- [ ] C8 Remove "100+ Women Supported"; remove unnumbered "Our Growing Impact" list on Get Involved
- [ ] C9 Service wording: job mentoring, peer mentoring, family reunification support, case management and structured daily support; no childcare/legal aid mentions

## Part B — Out-of-date content
- [ ] B1 "Launching 2025" → "NOW OPEN"
- [ ] B2 "New Beds Opening 2025–2026" → "3–5 Beds Available Now"
- [ ] B3 Capacity → "Currently 3–5 beds available. Contact us to check current availability."
- [ ] B4 src/config/siteInfo.ts with bedsAvailable constant
- [ ] B5 Sweep 2024/2025/launching/coming soon/opening
- [ ] B6 Footer copyright dynamic (verify)

## Part A — Missing information
- [ ] A1 Eligibility & What to Expect section on Programs (flexible fee wording)
- [ ] A2 After You Apply
- [ ] A3 Refer a Client (Get Involved + footer link + "Agency Referral" contact category)
- [ ] A4 Apply buttons → APP_URL constant + "Prefer to talk first? Call (909) 330-9240."
- [ ] A5 501(c)(3) + EIN 39-3657272 on Donate, Contact Zelle, footer
- [ ] A6 Zelle receipt note
- [ ] A7 Leadership: rename "Meet Our Founder" → "Our Leadership"; add Terrell D. Lemon Sr., President
- [ ] A8 /privacy page + footer/form links + FAQ entry

## Part D — Core message
- [ ] siteInfo.ts single source of truth (name, status, what we are/not, tagline, pillars, who we serve, what we offer, how it works, beds, fee, contact, mission)
- [ ] Update Home hero subtitle, Home What We Do, About We Provide, Programs features, FAQs, footer description, meta description

## Delivery
- [ ] List of files changed; confirm zero matches for 9154/Laurel/Fontana/92335/empowerhavenhomes in public site code; list of [CONFIRM] placeholders

## Memory updates
- [ ] Update mem://constraints/address-display (address now private), mem://project/contact-details, mem://features/email-delivery
