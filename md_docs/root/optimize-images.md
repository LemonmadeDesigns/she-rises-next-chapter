# Image Optimization Guide

## Required Optimizations for she-rises-banner.png

Current size: 1.4MB PNG (too large!)
Target size: 100-250KB total

### Step 1: Create optimized versions

```bash
# Install optimization tools (requires Node.js)
npm install -g @squoosh/cli

# Or use online tools like:
# - squoosh.app
# - tinypng.com
# - cloudinary.com

# Create optimized versions:
# 1. AVIF format (best compression, ~50-70KB target)
squoosh-cli --avif '{"cqLevel":25,"effort":6}' src/assets/she-rises-banner.png -d src/assets/

# 2. WebP format (good compression, ~80-120KB target)
squoosh-cli --webp '{"quality":75,"effort":6}' src/assets/she-rises-banner.png -d src/assets/

# 3. JPEG fallback (standard compression, ~150-200KB target)
squoosh-cli --jpeg '{"quality":80}' src/assets/she-rises-banner.png -d src/assets/

# 4. Tiny blur placeholder (under 2KB)
squoosh-cli --jpeg '{"quality":20}' --resize '{"enabled":true,"width":20}' src/assets/she-rises-banner.png -d src/assets/
```

### Step 2: Rename files
```bash
mv src/assets/she-rises-banner.avif src/assets/she-rises-banner-hero.avif
mv src/assets/she-rises-banner.webp src/assets/she-rises-banner-hero.webp
mv src/assets/she-rises-banner.jpg src/assets/she-rises-banner-hero.jpg
mv src/assets/she-rises-banner.jpg src/assets/she-rises-banner-blur.jpg  # The 20px version
```

### Expected Results
- AVIF: 50-70KB (80-95% smaller)
- WebP: 80-120KB (90-92% smaller)
- JPEG: 150-200KB (85-90% smaller)
- Blur: <2KB (99.8% smaller)

### Performance Impact
- Largest Contentful Paint (LCP): < 1 second
- Cumulative Layout Shift (CLS): 0 (explicit dimensions)
- Total Blocking Time: Reduced by ~1.2MB download