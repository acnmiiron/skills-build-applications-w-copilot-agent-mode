# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## OctoFit API

For Codespaces, define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` before starting Vite:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Use `.env.example` as a starting point and replace the value with the Codespace name. Vite reads `VITE_` variables at startup, so restart the dev server after editing the file. When the variable is unset, the frontend safely uses `http://localhost:8000` for local development.

Run the presentation tier on port `5173` with `npm run dev --prefix octofit-tracker/frontend`.
