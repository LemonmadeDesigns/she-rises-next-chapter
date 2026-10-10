# SHE RISES Redesign — Phase 1: Audit + Proposed Sitemap

## Current pages and sections

| Page | Route | Current sections |
|---|---|---|
| Home | `/` | Hero ("Place to Rise"), stats (Women Supported, Success Rate, Years of Impact), Our Impact in Action photo carousel, Community Events & Outreach, newsletter signup, partner logos ("Your Logo" placeholders), Partner With Us |
| About | `/about` | Our Mission, Our Vision, Executive Director |
| Programs | `/programs`, `/programs/:id` | Our Programs list, program detail pages, How to Get Started, Contact/Email CTA |
| Events | `/events` | Featured Events, All Events (admin-managed), Host an Event, Partner with She Rises |
| Get Involved | `/get-involved`, `/volunteer/:id` | Volunteer / Corporate Partnership / Sponsorship / In-Kind cards, Featured + All Volunteer Opportunities, Sponsorship tiers, volunteer stats, Partnership + Sponsorship inquiry forms |
| Contact | `/contact` | Contact form (reasons: Program Services, Volunteer, Donations & Partnerships, Media, Feedback), office hours (Mon–Fri, Sat), location, call/email card, Zelle QR + instructions |
| Donate | `/donate`, `/monthly-giving`, `/donation-success` | Donation widget (one-time/monthly, amounts), trust badges, impact stats, Stripe card form (needs keys) |
| Shop | `/shop`, `/shop/:id`, `/cart`, `/checkout` | Products, cart, Stripe checkout (needs keys) |
| Legal | `/privacy`, `/terms` | Policies |
| Account/Admin | `/auth`, `/admin` | Sign in, admin panel (events, form submissions) |
| Dev only | `/image-test` | Should be removed |

Facts to preserve: phone (909) 330-9240, email empowerhavenhomes@gmail.com, office hours, address, crisis lines 800-662-4357 (SAMHSA) and 800-799-7233 (DV hotline), Zelle QR, Executive Director bio, mission/vision text.

Issues found: placeholder phones `(555) 123-4567` / `(555) 555-1234` still in code; stats on Home/Donate look like real numbers but are unverified.

## Proposed sitemap

1. Home — Hero → 3 pillars → Who we serve → What we provide → How it works (4 steps) → Impact stats → Stories → Partner/Donate band → FAQ → Final CTA
2. About — mission, vision, story, values, team
3. Programs — each service + participant pathway (existing detail pages kept)
4. Get Help / Apply (new, `/get-help`) — eligibility, what to expect, Apply + Sign in → APP_URL, call option
5. Get Involved — Donate, Volunteer, Partner (agencies, employers, faith/community), in-kind list, partner inquiry form
6. Impact (new, `/impact`) — count-up stats + consent-based stories
7. Contact — form with new reason dropdown, address, hours, map, Zelle
8. Donate — $25 / $50 / $100 / custom with "what it covers", links to DONATION_URL
9. Footer — quick links, contact, social, non-medical disclaimer, privacy link

Kept but not in new main nav: Events, Shop (reachable from footer/More).

## Placeholders you will need to fill
APP_URL, DONATION_URL, all stats, story photos/quotes (with written consent), team bios/photos, hero photo, social links, street address confirmation.
