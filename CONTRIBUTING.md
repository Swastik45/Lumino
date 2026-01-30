# Contributing

Thanks for your interest in contributing! This guide explains how to set up the project locally and the preferred workflow for changes.

## Getting started
1. Fork the repo and create a feature branch: `git checkout -b feat/my-feature`
2. Install dependencies:

```bash
npm install
```

3. Create a local env file from `.env.example`:

```bash
cp .env.example .env.local
# set UNSPLASH_ACCESS_KEY in .env.local
```

4. Run the dev server:

```bash
npm run dev
# open http://localhost:3000
```

## Branching & commits
- Use short, descriptive branch names (e.g., `feat/search-pagination`, `fix/image-modal`).
- Write clear commit messages. Prefer present-tense, imperative style (e.g., "Add search pagination").

## Pull Requests
- Open a PR against `main` (or the default branch).
- Describe the change, why it was made, and any steps to test it.
- Keep changes focused and include tests or screenshots when relevant.

## Code style & linting
- The project uses TypeScript and ESLint. Run linting before opening a PR:

```bash
npm run lint
```

- Format code using any formatter you prefer (Prettier recommended).

## Reporting issues
- Open issues for bugs or feature requests with clear steps to reproduce and expected behavior.

## Tests
- There are no automated tests yet. Contributions adding tests are welcome!

## Code of Conduct
- Be respectful and constructive. If you plan to contribute regularly, consider adding a formal `CODE_OF_CONDUCT.md`.

Thanks — contributions are very much appreciated! 🙌
