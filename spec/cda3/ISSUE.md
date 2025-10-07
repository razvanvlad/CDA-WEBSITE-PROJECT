# [CDA-3] Homepage bugs — Pixel-Perfect Fixes

This issue contains **small, simple, but precise design fixes**. Treat every item as pixel-critical.
Use the images in `./images/` (rendered from the PDF) as the visual source of truth.

## Constraints
- Do **not** modify infra/build config.
- Allowed paths: `/app`, `/components`, `/pages`, `/styles` (or equivalents in this repo).
- Fonts must be **Inter** and **Poppins** (self‑hosted WOFF2 recommended), with explicit `font-weight` values.
- Show proposed diffs first. Ask before running commands or updating snapshots.

## Acceptance Criteria (by section)

### 1) Hero block
- Title/text/buttons vertical spacing matches the design (reduce current gaps).
- Body text uses **Inter Regular 18px** (not system 17px).
- Button labels use **Poppins Bold**.
- Replace any “Lorem Ipsum” placeholders with final copy.
- “View Our Services” arrow icon is **14×14px** (not 12×12).
- “Start a project” vertical label reads **bottom → top** (use `writing-mode: vertical-rl; transform: rotate(180deg)` if needed).

### 2) “Your digital partner” section
- Button “Meet the Senior Team” uses **Poppins Bold**; description text uses **Inter Regular**.
- Orange dotted arrow begins on white section and extends into gray (currently all gray).
- Normalize `<h2>` styles: avoid oversized look from default heading weight/line-height. Apply tokens for exact size/leading.
- Adjust spacing between title and paragraph to match design rhythm.

### 3) Missing block
- Insert **“What makes us the right choice”** section between “Your digital partner” and “Services / What we excel at”, styled per the images.

### 4) Buttons & services
- “Find out more” button size matches spec (current too large).
- Services titles/descriptions should be **bold** as shown.
- Smaller text in the later section is under‑sized — increase to the design size.
- “What we excel at” `<h2>` again appears oversized — normalize weight/line-height to match a 38px visual size.
- Replace “Join our team” with **Our Careers** where indicated.

### 5) Header
- Header texts render with **Inter 600, 18/21** line-height (not Times/Times‑Bold).

## Deliverables
- Minimal diffs touching only necessary files.
- Unit tests for affected utils/components (if applicable).
- 2–3 Playwright snapshot tests: hero, “Your digital partner”, services header.
- Update any style tokens to stabilize sizes/weights/spacing.

## Test Plan
1. Run `npm run lint`, `npm run typecheck`, `npm run test:fast` (or project equivalents) — all pass.
2. Visual spot-check against `./images` for the three sections above.
3. Run the snapshot tests locally; update only if deviations match the spec.

## Images
Use the PNGs in `./images/` as reference:
- `cda3_page_01.png` … `cda3_page_08.png`
