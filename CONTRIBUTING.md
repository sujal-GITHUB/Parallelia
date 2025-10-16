# Contributing to Parallelia

Welcome — and thank you for contributing! This repository welcomes contributions of all sizes, especially during Hacktoberfest. The guidance below will help you find issues, set up a development environment, and submit your first pull request.

## Table of contents
- Who can contribute
- Finding issues to work on (Hacktoberfest-friendly)
- How to set up the project locally
- Coding conventions
- Writing tests
- Making a PR (pull request) — checklist
- Labels and issue types
- Code of Conduct
- License

---

Who can contribute
-------------------
Anyone! We welcome new contributors and experienced maintainers. If you're new to open-source, look for issues labeled `good-first-issue` or `help-wanted`.

Finding issues to work on (Hacktoberfest-friendly)
--------------------------------------------------
- Check `USER_FACING_ISSUES.md` and `ISSUES.md` for curated tasks focused on user-facing enhancements and bugs.
- Look for issues labeled:
  - `good-first-issue` — small, well-defined tasks to get started.
  - `help-wanted` — slightly bigger tasks that need attention.
  - `hacktoberfest` — tasks tagged specifically for Hacktoberfest.

If you want mentorship, open an issue asking for a quick pairing session or leave a comment on an issue you're interested in.

How to set up the project locally
---------------------------------
This project uses pnpm and a turborepo-style monorepo under `metaverse/`. The instructions below assume Windows `cmd.exe`.

1. Clone the repository:

```cmd
git clone https://github.com/<owner>/Parallelia.git
cd Parallelia
```

2. Install dependencies (pnpm is required):

```cmd
pnpm install
```

3. Create a local `.env` file (the repo does not include one). At minimum set:

```text
DATABASE_URL=postgresql://user:password@localhost:5432/parallelia_dev
JWT_SECRET=devsecret
```

4. Run database migrations (requires Postgres running):

```cmd
pnpm --filter @repo/db prisma migrate dev
```

5. Start development servers (examples):

```cmd
# frontend (Vite)
pnpm --filter metaverse/apps/frontend dev

# http API (build+start)
pnpm --filter metaverse/apps/http dev

# websocket server
pnpm --filter metaverse/apps/ws dev
```

Notes
- The HTTP server listens on port 3000 by default and the WS server on 3001; the frontend uses Vite (5173) by default.
- If you run into issues, please open an issue describing the problem and the OS/Node/pnpm versions.

Coding conventions
------------------
- TypeScript is used across the repo. Follow type-safety where possible.
- Formatting: run prettier via the `metaverse` package:

```cmd
pnpm --filter metaverse format
```

- Linting: run the workspace lint command (turbo):

```cmd
pnpm --filter metaverse lint
```

Writing tests
-------------
- Unit/integration tests live in `tests/` and package-local test folders. Run tests with:

```cmd
pnpm --filter tests test
```

- If you're adding new functionality, add tests when practical.

Making a PR — checklist
-----------------------
Before opening a pull request, please ensure:
- [ ] Your changes are on a feature branch, not `main`.
- [ ] The code builds and types check locally.
- [ ] You added or updated tests for new/changed behavior.
- [ ] You ran the formatting script (`pnpm --filter metaverse format`).
- [ ] The PR description explains why the change was made and links to any relevant issues.

PR template tips for Hacktoberfest
- Make your PR focused (one feature/bug per PR).
- For small contributions, add the `good-first-issue` label and reference `hacktoberfest` in the PR description to aid maintainers.

Labels and issue types
----------------------
We use the following labels (if you can't set labels, maintainers will add them):
- `good-first-issue` — easy tasks for new contributors
- `help-wanted` — tasks that need more attention
- `bug` — bug fixes
- `enhancement` — feature improvements
- `hacktoberfest` — tasks suitable for Hacktoberfest

Code of Conduct
---------------
Be respectful and constructive in comments and PRs. This project follows the Contributor Covenant. If you experience or witness unacceptable behavior, please open an issue and tag the maintainers.

License
-------
This project is licensed under the MIT License.

---

Thank you for contributing! If you'd like me to create `good-first-issue` PRs or label specific issues `hacktoberfest`, tell me which ones and I can open them for you.