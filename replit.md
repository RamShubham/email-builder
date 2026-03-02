# Email Builder JS (Oute Email Editor)

## Overview
A React/Vite email template builder application built as a pnpm monorepo. This is the "editor-sample" package from the email-builder-js project, customized for the Oute platform.

## Project Structure
```
packages/
  editor-sample/        # Main React/Vite frontend app (port 5000)
  email-builder/        # Core email builder library
  document-core/        # Document model
  block-*/              # Individual email block components
  block-rte/            # Rich text editor block
  stub-oute-tiny-auth/  # Local stub for private @oute/oute-ds.common.molecule.tiny-auth
  stub-oute-image-picker/ # Local stub for private @oute/oute-ds.atom.image-picker
```

## Tech Stack
- **Package Manager**: pnpm with workspaces
- **Frontend**: React 18, Vite 5, TypeScript, Material UI
- **State**: Zustand
- **Routing**: React Router v7
- **Styling**: Emotion, Sass

## Running the App
```
pnpm --filter @usewaypoint/editor-sample run vitedev
```
Runs on port 5000 at `0.0.0.0`.

## Important Notes

### Private Packages (Stubs)
Two private `@oute/` packages are not available on npm and have been replaced with local stubs:
- `@oute/oute-ds.common.molecule.tiny-auth` → `packages/stub-oute-tiny-auth`
- `@oute/oute-ds.atom.image-picker` → `packages/stub-oute-image-picker`

The auth stub provides a no-op auth context (no actual authentication).

### App Behavior
This app is designed to be embedded in the Oute platform. It requires specific URL query parameters (`?q=...`) to work properly:
- `/template?q=<encoded-params>` - Edit/create email template
- `/asset?q=<encoded-params>` - Edit existing asset

Without valid params, it redirects to `REACT_APP_WC_LANDING_URL`.

### Environment Variables
See `packages/editor-sample/.env` (copied from `.env.sample`). Key variables:
- `REACT_APP_API_BASE_URL` - Backend API URL
- `REACT_APP_EMAIL_TEMPLATE_SERVER` - Email template server
- `REACT_APP_KEYCLOAK_*` - Auth server config (not used with stub)

### Package Version Fixes
Several `oute-ds-*` packages had version constraints higher than what's published on npm. Fixed to use latest available versions.

## Deployment
Static site deployment configured:
- Build: `pnpm --filter @usewaypoint/editor-sample run vitebuild`
- Public dir: `packages/editor-sample/dist`
