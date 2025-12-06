# She Rises Website Updates - December 5, 2025

## Summary
Major content updates to ensure accuracy and reflect real activities of She Rises organization.

---

## 1. Homepage Updates (src/pages/Index.tsx)

### Removed Inaccurate Statistics
- ❌ Removed "300+ women supported annually"
- ❌ Removed "1,000+ successful reentries"
- ❌ Removed "5 housing sites"

### Added "Our Growing Impact" Section
Replaced statistics with accurate information:
- ✅ Transitional Housing Opening 2025 (San Bernardino County)
- ✅ Reentry & empowerment services
- ✅ Community partnerships across the Inland Empire & Orange County
- ✅ Expansion planned for 2026–2027

### Events Section Update
- Changed title from "Upcoming Events" to **"Recent Events & Community Outreach"**
- Updated subtitle to reflect Southern California community connection
- Added closing message: "More events coming soon. We are actively partnering with agencies throughout Southern California."

### New Photo Section
- Added **"Our Team in Action"** section below hero banner
- Currently shows placeholder ready for event photos
- Subtitle: "Showcase the women and community behind She Rises"

---

## 2. Events Data Update (src/content/events.json)

### HIRE Reentry Resource Fair
- **Date:** September 17, 2025
- **Location:** Honda Center, Anaheim, CA
- **Description:** 4th Annual H.I.R.E. Reentry Resource Fair participation
- **Highlights:**
  - Community networking with reentry partners
  - Outreach to individuals seeking housing and employment support
  - Provided resource materials and intake information

### RCC Fall Festival Resource Fair
- **Date:** November 14, 2025
- **Location:** Riverside City College, Riverside, CA
- **Description:** Resource booth at RCC Rising Scholars Fall Festival
- **Highlights:**
  - Engagement with community partners
  - Outreach to justice-impacted women and families
  - Shared information on transitional housing and services

---

## 3. Footer Updates (src/components/layout/Footer.tsx)

Added important clarifications:
- ✅ "Not a 24-hour crisis shelter."
- ✅ "Serving Southern California. Transitional housing located in San Bernardino County."

---

## 4. Removed 24/7 Availability Claims

### About Page (src/pages/About.tsx)
- Changed "Provide safe, transitional housing with 24/7 support"
- To: "Provide safe, transitional housing with on-site support and case management"

### Programs Page (src/pages/Programs.tsx)
- Removed "24/7 on-site support staff" from features
- Changed to "On-site support and case management"
- Replaced "Program Impact Statistics" section with "Our Growing Impact"
- Updated "Emergency Resources" section to clarify:
  - She Rises contact info vs. external crisis lines (988, 211)
  - Added disclaimer: "Not a 24-hour crisis shelter"

### Program Details Page (src/pages/ProgramDetails.tsx)
- Removed "24/7 on-site support staff"
- Updated to "On-site support and case management"

### Contact Page (src/pages/Contact.tsx)
- Removed duplicate "24/7 Crisis Hotline" entry
- Updated office hours to "Monday - Friday, 9:00 AM - 5:00 PM PST"
- Changed crisis messaging to direct users to:
  - 911 for immediate danger
  - 988 (Suicide & Crisis Lifeline)
  - 211 (Homeless Outreach)
- Added: "She Rises is not a 24-hour crisis shelter"
- Updated email response time to "1-2 business days"
- Changed location info to "San Bernardino County" with "Serving Southern California"

### Donate Page (src/pages/Donate.tsx)
- Changed "Crisis Response" category from "Supports 24/7 hotline and emergency intervention services"
- To: "Emergency Support - Provides rapid response and connection to crisis resources"

### Shop Page (src/pages/Shop.tsx)
- Removed inaccurate "300+ women supported annually" stat
- Replaced with "Quality products that make an impact"

---

## 5. Project Organization

### SQL Files Consolidation
- Created new `sql-scripts/` folder
- Moved all root-level SQL files:
  - ✅ `add_all_events_with_real_images.sql`
  - ✅ `add_more_events_now.sql`
  - ✅ `update_images_now.sql`
- Supabase migrations remain in `supabase/migrations/`

### Files Kept (Analysis Completed)
- `public/_redirects` - **NECESSARY** for SPA routing (React Router)
- `dist/_redirects` - Build output, generated automatically
- `.env` - Contains environment variables (not tracked in git)
- `.env.example` - Template for environment setup
- All `.md` files (documentation)

---

## 6. Package Updates

### Browser Compatibility
- Updated `caniuse-lite` package to latest version
- Resolved outdated browser data warning (was 8 months old)
- Command used: `npm update caniuse-lite --legacy-peer-deps`

---

## Key Messages Reinforced Throughout Site

1. **Not a 24-hour crisis shelter** - Clearly stated on multiple pages
2. **Office hours: Monday-Friday, 9 AM - 5 PM PST** - Consistent across all pages
3. **Transitional housing opening 2025** - Future-focused messaging
4. **San Bernardino County location** - Specific geographic information
5. **Serving Southern California** - Regional scope clarified
6. **Crisis resources redirected** - Proper referrals to 988 and 211

---

## Technical Notes

- All TypeScript errors resolved
- Event data structure updated (removed `donationsNeeded` field where not applicable)
- Maintained consistent styling and branding
- Ensured mobile responsiveness for all new sections

---

## Next Steps

- [ ] Upload real event photos to replace placeholder in "Our Team in Action" section
- [ ] Review all changes on staging/production environment
- [ ] Monitor user feedback regarding new messaging
- [ ] Continue updating events as new community outreach occurs

---

## Files Modified

1. src/pages/Index.tsx
2. src/content/events.json
3. src/components/layout/Footer.tsx
4. src/pages/About.tsx
5. src/pages/Programs.tsx
6. src/pages/ProgramDetails.tsx
7. src/pages/Contact.tsx
8. src/pages/Donate.tsx
9. src/pages/Shop.tsx
10. package-lock.json (caniuse-lite update)

## Files Moved/Organized

1. add_all_events_with_real_images.sql → sql-scripts/
2. add_more_events_now.sql → sql-scripts/
3. update_images_now.sql → sql-scripts/

---

**Date Completed:** December 5, 2025
**Updated By:** Development Team via Claude Code
**Review Status:** Pending stakeholder review
