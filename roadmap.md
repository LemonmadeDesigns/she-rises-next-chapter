# Content & Safety Fix Pass (brief: SHE_RISES_PUBLIC_WEBSITE_-_CONTENT_SAFETY_pasted.md)

User confirmed: remove address everywhere; route everything to pransom@safehavenforempowerment.org; flexible fee wording everywhere (no $1,000 published); add Terrell D. Lemons, B.S. as President with provided bio.

## Part C — Safety & Accuracy
- [x] C1 Remove 9154 Laurel Ave / Fontana / 92335 everywhere; privacy wording; "Schedule a Visit" → "Schedule a Call" (contact form, category Program Services & Support); walk-in block → "Meet With Us" appointment wording on ProgramDetails
- [x] C2 Delete "Getting Here" list
- [x] C3 One contact: pransom@ · (909) 330-9240 · Mon–Fri 9–5 PT; empowerhavenhomes@gmail.com gone from public site; response wording "1–2 business days" everywhere; all six edge functions route to pransom@
- [x] C4 Collapse department directory into one card
- [x] C5 Crisis language: buttons → "Emergency Resources" scroll; banner text per brief; keep 24/7 list
- [x] C6 Gold tier "Tour of facilities" → "Virtual program update with leadership"
- [x] C7 Fee wording (flexible, already applied — keep, no $1,000)
- [x] C8 Remove "100+ Women Supported"; remove unnumbered "Our Growing Impact" list on Get Involved; replace unverified Donate stats grid with trust row
- [x] C9 Service wording: job mentoring, peer mentoring, family reunification support, case management and structured daily support; childcare volunteer role removed; childcare/legal aid removed from programs.json copies and Events 2

## Part B — Out-of-date content
- [x] B1 "Launching 2025" → "NOW OPEN"
- [x] B2 "New Beds Opening 2025–2026" → "3–5 Beds Available Now"
- [x] B3 Capacity → "Currently 3–5 beds available. Contact us to check current availability."
- [x] B4 src/config/siteInfo.ts with bedsAvailable constant
- [x] B5 Sweep 2024/2025/launching/coming soon/opening (stale 2025 announcements replaced on Programs/Home)
- [x] B6 Footer copyright dynamic (was already using new Date().getFullYear())

## Part A — Missing information
- [x] A1 Eligibility & What to Expect section on Programs (flexible fee wording, [CONFIRM] placeholders kept visible)
- [x] A2 After You Apply
- [x] A3 Refer a Client (Get Involved section for probation/parole/reentry partners + footer link + "Agency Referral" contact category preselected via ?category=referral)
- [x] A4 Apply buttons → siteInfo.appUrl (empty until user pastes URL; falls back to /contact) + "Prefer to talk first? Call (909) 330-9240."
- [x] A5 501(c)(3) + EIN 39-3657272 on Donate, Contact Zelle, footer; GuideStar badge removed
- [x] A6 Zelle receipt note
- [x] A7 Leadership: "Our Leadership" heading; Terrell D. Lemons, B.S. President card (bio replaced with user's 2026-10-11 version) with photo placeholder
- [x] A8 /privacy page (draft marked [CONFIRM: legal review]) + Contact links

## Part D — Core message
- [x] siteInfo.ts single source of truth (name, status, what we are/not, tagline, pillars, who we serve, what we offer, how it works, beds, fee, contact, mission)
- [x] Home hero, impact items, fee/privacy FAQs; About mission + We Provide; Programs eligibility; footer description; meta description (index.html OG/Twitter updated)

## Delivery
- [x] Zero matches for 9154/Laurel/Fontana/92335/empowerhavenhomes in public site code (verified by search)
- [x] Build OK; typecheck clean

## Memory updates
- [x] mem://constraints/address-display (address now private), mem://project/contact-details, mem://features/email-delivery, mem://features/site-facts (new)

## Open items waiting on the user
- Participant app URL for siteInfo.appUrl (Apply buttons currently fall back to /contact)
- Eligibility [CONFIRM] placeholders (age range, length of stay, house guidelines, move-in items, waitlist process)
- Legal review of the draft /privacy policy
