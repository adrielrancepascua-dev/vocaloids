# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

This workspace is a Next.js TypeScript site for showcasing Vocaloid-style characters and songs.

Key details
- Framework: Next.js (App Router) with TypeScript
- Purpose: site for characters, songs, shop, and audio experiences
- Major folders:
  - `src/app/` — application routes and pages
  - `src/components/` — reusable React components (audio visualizer, embeds, UI)
  - `src/assets/` and `public/` — images, audio, and static files
  - `src/lib/`, `src/hooks/`, `src/context/` — utilities and app state
  - `src/sanity/` — Sanity client and schemas for content

Development
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`

Notes
- This project includes a web worker for audio math and several client components that depend on browser APIs.
- See `WORKSPACE_GUIDE.md` and `ARCHITECTURE.md` for more architecture and conventions.

Contributing
- Open a PR against the repository; follow existing code style and TypeScript settings.

Repository
- Remote: https://github.com/adrielrancepascua-dev/vocaloids

Contact
- Maintainer: adrielrancepascua-dev
