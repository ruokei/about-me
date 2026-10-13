# Derrick Tan portfolio

React, TypeScript, Tailwind CSS, and shadcn-compatible source lives in `app/`. The site is hosted by GitHub Pages from the repository root at <https://ruokei.github.io/about-me/>.

## Work locally

```sh
npm ci
npm run dev
```

`app/src/components/ui/` is the shadcn UI component directory, mapped to `@/components/ui` in `components.json` and the TypeScript/Vite aliases. Keep that folder so shadcn's CLI and imports agree. Styles live in `app/src/styles.css`.

## Publish to GitHub Pages

```sh
npm run publish:pages
git add app assets/site.js assets/site.css index.html package.json package-lock.json components.json scripts tsconfig*.json vite.config.ts .gitignore README.md
git commit -m "Update portfolio"
git push origin main
```

`publish:pages` checks TypeScript, builds the app with `/about-me/` as its base path, and copies the generated HTML, CSS, and JavaScript into the repository root. Commit those generated files with source changes so GitHub Pages can serve the new version without changing its existing branch settings.
