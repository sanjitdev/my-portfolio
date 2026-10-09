---
id: adr-003
title: Add real profile photo to the hero with next/image and editorial backdrop ring
status: accepted
date: 2026-10-09
bolt: post-bolt-evolution (free-form, not in original 3-bolt plan)
commit: 6f67a8b
supersedes: null
---

# ADR-003: Profile photo in the Hero — replacing the monogram as the visual anchor

## Context

The original branding choice (ADR-001) used the `SM` SVG monogram as the visual anchor in the hero. After the user added a real profile photo (`docs/sanjit_photo.png`), the monogram felt impersonal. A real photo conveys professionalism and trust — recruiters and hiring managers expect to see the person they're reading about. The monogram is still used in TopNav and Footer (where a small monogram is appropriate) and as the favicon.

## Decision

Replace the hero monogram with the **real profile photo** as the visual anchor:

1. **Image optimization**: Use `sharp` to generate 3 responsive WebP versions (640w / 960w / 1280w) plus an optimized PNG fallback. Original 1MB PNG → 35-97KB WebPs. Stored in `public/sanjit_photo-{width}w.webp` and `public/sanjit_photo.png`.

2. **`<ProfilePhoto>` component** (`src/components/branding/ProfilePhoto.tsx`):
   - Uses `next/image` with `priority` (LCP — above the fold)
   - `sizes="(max-width: 640px) 160px, 200px"` for responsive loading
   - **Soft accent backdrop ring**: a blurred gradient (`from-accent-200/70 via-accent-100/30 to-transparent`) sits behind the photo for visual lift
   - **1px accent border ring** (`border-accent-300/60`) just outside the photo for a refined frame
   - **Photo styling**: `rounded-2xl`, 1px slate border, subtle shadow, `object-cover`
   - **Responsive sizes**: 144×192 (mobile) → 192×256 (sm) → 208×288 (md)

3. **HeroSection update**: The left column of the hero grid now renders `<ProfilePhoto priority />` instead of `<Monogram size="lg" />`. The monogram is still used in `TopNav`, `Footer`, and `public/icon.svg` (favicon).

## Consequences

### Positive
- The hero now shows a real person — significantly more professional and trust-building.
- The accent backdrop ring creates a focal point without being heavy-handed.
- Image is served as WebP with a responsive `srcset` — under 100KB total transfer for the largest viewport.
- Privacy invariant preserved (the photo is a public profile picture, not the address).

### Negative
- The `next/image` loader adds a small overhead (~1-2 kB of client JS). Acceptable.
- The photo adds ~1MB to the `public/` folder, but only the appropriate WebP variant is sent to each device.
- The hero now has a more "personal" feel — some candidates prefer anonymity. If that changes, the monogram variant is still a one-component swap.

### Neutral
- The accent ring is decorative and `aria-hidden` — doesn't add noise for screen readers.
- The `priority` flag means the image loads eagerly — appropriate for LCP, but slightly slower to first paint. Net win for perceived performance.

## Alternatives Considered

- **Use the monogram in the hero and put the photo elsewhere (e.g., a small avatar in TopNav)**: Rejected — the hero is the most visible spot, and a small avatar wouldn't have the same impact. The monogram is fine in nav/footer where it's the "logo" treatment.
- **CSS filter (grayscale, duotone) on the photo**: Briefly considered for a more "editorial" feel. Rejected — the natural color photo is more personable and the user didn't ask for stylization.
- **Use `next/dynamic` to lazy-load the photo**: Rejected — it's the LCP element. `priority` is the right call.

## Notes

If the candidate updates their photo in the future, drop a new `docs/sanjit_photo.png` and rerun the `sharp` resize command (documented in the bolt walkthrough). The component is fully data-driven; no code changes needed.
