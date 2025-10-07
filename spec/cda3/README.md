# How to use this bundle with Claude Code & RooCode

## With Claude Code (recommended first)
1. Open VS Code in your project.
2. Place the `/spec/cda3` folder at the repo root.
3. Ask Claude Code:
   - *“Read `/spec/cda3/ISSUE.md` and the images in `/spec/cda3/images`. Propose a minimal plan and small diffs. Only edit /app,/components,/pages,/styles. Show diffs first.”*
4. Approve diffs; request tests per the **Test Plan**.

## With RooCode (for multi-file execution)
Use after agreeing on the plan with Claude:
- *“Implement the accepted plan from `/spec/cda3/ISSUE.md`. Allowed edits: /app,/components,/pages,/styles. Allowed scripts: lint,typecheck,test:fast,dev. Ask before updating snapshots.”*

## Notes
- Keep secrets out of prompts. Use `.env.example` where needed.
- Prefer self-hosted fonts (Inter/Poppins WOFF2) for exact rendering.
