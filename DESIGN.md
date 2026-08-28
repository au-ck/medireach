# Design Brief

## Direction

MediReach — a calm, trustworthy rural healthcare platform that pairs a bright clinical blue/teal public-health palette with rounded, approachable surfaces for patients and care workers.

## Tone

Refined public-health minimalism — airy, reassuring, and human, built for trust and clarity in low-connectivity rural settings rather than sterile or corporate.

## Differentiation

Script-aware trilingual typography (English, Telugu, Hindi) with Devanagari/Telugu font fallbacks, plus a signature teal-on-blue gradient used only on primary actions and hero accents.

## Color Palette

| Token      | OKLCH          | Role                                    |
| ---------- | -------------- | --------------------------------------- |
| background | 0.98 0.008 230 | cool off-white page canvas              |
| foreground | 0.18 0.025 245 | deep navy ink for text                  |
| card       | 1 0.004 230    | white elevated card surface             |
| primary    | 0.4 0.15 250   | medical blue for CTAs and active states |
| accent     | 0.6 0.15 172   | teal for highlights and secondary cues  |
| muted      | 0.945 0.012 230| light-gray for subtle fills             |
| muted-fg   | 0.5 0.015 235  | gray secondary text                     |
| success    | 0.58 0.16 150  | health/positive signals                 |
| warning    | 0.72 0.15 85   | caution signals                         |

## Typography

- Display: Space Grotesk — headings, hero, section titles
- Body: DM Sans — paragraphs, UI labels, forms
- Mono: Geist Mono — codes, IDs, numeric readouts
- Script fallbacks: Noto Sans Devanagari + Noto Sans Telugu appended to display/body stacks
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-3xl md:text-4xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base text-lg`

## Elevation & Depth

Layered surfaces with soft cool shadows (`shadow-subtle` on cards, `shadow-elevated` on hover/overlays); depth comes from elevation and subtle gradients, never full-page gradient backgrounds.

## Structural Zones

| Zone    | Background        | Border   | Notes                                        |
| ------- | ----------------- | -------- | -------------------------------------------- |
| Header  | bg-card           | border-b | elevated white bar, sticky, language switcher|
| Content | bg-background     | —        | alternate `bg-muted/30` for feature sections |
| Footer  | bg-muted/40       | border-t | muted gray band with contact + trust cues    |

## Spacing & Rhythm

Spacious section gaps (`py-16 md:py-24`), consistent `gap-4/6` card grids, generous `p-6` card padding, tight `tracking-tight` headings for hierarchy.

## Component Patterns

- Buttons: rounded-full pills; primary uses `bg-gradient-primary`, hover `shadow-elevated`
- Cards: `rounded-2xl` white surfaces with `shadow-subtle`, hover lift to `shadow-elevated`
- Badges: `rounded-full` pills; teal accent for highlights, muted for neutral tags
- Icons: medical line icons (lucide) in a soft `bg-muted` rounded square

## Motion

- Entrance: `animate-fade-in-up` staggered on hero and cards (0.5s)
- Hover: card lift + shadow transition via `transition-smooth` (0.3s)
- Decorative: `animate-float-soft` on hero illustration, `animate-pulse-soft` on live/online indicators

## Constraints

- Tokens only — no raw hex/rgb or arbitrary Tailwind color classes in components
- AA+ contrast maintained in both light and dark; never rely on opacity for contrast
- Script-aware stacks must render Devanagari and Telugu; Latin fonts fall back gracefully
- Minimal, choreographed motion only — no bouncy or distracting animation
- Rounded cards and medical icons throughout; low-connectivity offline/online indicators

## Signature Detail

The teal-on-blue gradient reserved for primary actions and the hero, paired with script-aware trilingual typography, gives MediReach a distinctive, trustworthy public-health identity.
