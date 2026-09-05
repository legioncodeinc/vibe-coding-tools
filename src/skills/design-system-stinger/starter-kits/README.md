# Starter Kits

Aesthetic seeds for the bootstrap. The interview chooses one; the Bee
then customizes from there. See `../guides/01-interview-procedure.md` for
how to pick.

| Kit                  | Surface metaphor | Depth   | Typography          | Palette vibe         | Closest real products    |
|----------------------|------------------|---------|---------------------|----------------------|--------------------------|
| `glass-on-beige/`    | Translucent glass on cream | Three-cue shadow + backdrop blur on nav | Playfair Display + DM Sans | Warm, cream + navy + gold | iOS, visionOS |
| `flat-modern/`       | Flat block + hairline border | None: crisp borders only | Inter + Geist Mono | Cool greys, tight | Linear, Vercel, GitHub |
| `editorial-serif/`   | Paper, subtle warmth | One soft tier | Playfair/Fraunces + Inter body | Ivory + ink + accent | Stripe, Substack, Mailchimp |

## Each kit contains

- `01-master-tokens.css`: the token layer seed.
- `02-<utility>.css`: the utility layer seed (named for the aesthetic).
- `sample.html`: a single-page static render so the kit can be previewed
  by double-click.

## How to use

1. Copy the kit into the target product's folder as the starting point.
2. Rename tokens if the product's brand needs it (e.g., `--color-primary`
   for the user's brand hex).
3. Extend: never blank-slate. Most products need one or two additional
   tokens beyond the starter; few need fewer.

## What the kits are not

- They are not the full bootstrap. They are the SEED. The Bee still
  writes the comprehensive brief, per-component briefs, per-screen
  briefs, and the rest of the HTML examples.
- They are not interchangeable mid-project. Picking glass-on-beige then
  switching to flat-modern requires re-authoring most of the system.
  Interview thoroughly first.
