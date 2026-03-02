# Email Builder JS (Oute Email Editor)

## Overview
A React/Vite email template builder application built as a pnpm monorepo. This is the "editor-sample" package, rebuilt with Tailwind CSS + shadcn/ui + Lucide React — zero MUI, zero ODS packages.

## Project Structure
```
packages/
  editor-sample/        # Main React/Vite frontend app (port 5000)
    src/                # New Tailwind+shadcn UI (rebuilt)
    src_legacy/         # Archived legacy MUI/ODS code (do not delete)
  email-builder/        # Core email builder library (Reader component)
  document-core/        # Document model and block schema infrastructure
  block-*/              # Individual email block components (pure rendering)
  block-rte/            # Rich text editor block (FloatingMenu rebuilt)
```

## Tech Stack
- **Package Manager**: pnpm with workspaces
- **Frontend**: React 18, Vite 5, TypeScript
- **UI Library**: Tailwind CSS v3 + shadcn/ui (Radix UI primitives) + Lucide React
- **State**: Zustand (EditorContext)
- **Routing**: React Router v7
- **Toast**: Sonner
- **Drag & Drop**: @dnd-kit
- **Color Picker**: react-colorful

## Running the App
```
pnpm --filter @usewaypoint/editor-sample run vitedev
```
Runs on port 5000 at `0.0.0.0`.

For development testing, navigate to `/dev` to bypass auth.

## App Routes
- `/template?q=<encoded-params>` - Edit/create email template (production auth flow)
- `/asset?q=<encoded-params>` - Edit existing asset (production auth flow)
- `/dev` - Direct access bypassing auth (development only)
- `*` - Shows "Page not found" message

## Path Aliases
Vite and tsconfig are configured with `@` pointing to `src/`:
- `@/components/ui/*` → `src/components/ui/*`
- All shadcn components live in `src/components/ui/`
- Utilities in `src/lib/utils.ts` (cn helper)

## Island Design System (macOS Sequoia-inspired)
The UI uses a floating "island" layout where each major panel is a distinct card:
- **Background**: Subtle slate-gray (`--background: 220 14% 96%`) shows between islands
- **Islands**: White cards with `border-radius: var(--island-radius)` (16px) and multi-layer macOS-style shadow (`.island` utility class)
- **Layout**: `p-2.5 gap-2.5` spacing (10px gaps); `h-screen w-screen` viewport container
- **Panels**: Navbar (top), Navigator (left), Canvas (center), Inspector (right), AI Prompt (bottom of canvas) — all floating
- **AI Prompt**: Separate floating island below the canvas (`AiPromptIsland` component), only visible on editor tab
- **Tabs & selections**: macOS segmented control style — `bg-gray-100/80` pill container with white active pill + `shadow-sm`, `rounded-[10px]` inner pills
- **Block library cards**: Borderless, `rounded-xl`, background-only (`bg-gray-50/80`), hover lifts with shadow
- **Block wrappers**: Soft blue outline with `outlineOffset`, rounded corners
- **TuneMenu**: Dark pill (`bg-gray-900`) with icon buttons
- **Save button**: Rounded-full capsule pill
- CSS variables: `--island-shadow`, `--island-shadow-md`, `--island-radius` (1rem), `--island-radius-sm` (0.625rem), `--island-gap` (0.625rem)
- `ISLAND_GAP` JS constant: `10` (matches `--island-gap`)

## Key Architectural Notes

### No MUI / No ODS
All Material UI and oute-ds-* packages have been completely removed. All UI uses:
- Tailwind CSS classes for layout/spacing/colors
- shadcn/ui components for interactive elements (Radix UI under the hood)
- Lucide React for icons

### SDK Stub
`oute-services-mail-sdk` is a private package. It's stubbed at `src/sdk/stubs/oute-services-mail-sdk.ts`. The stub throws errors on API calls, which are caught and handled gracefully (errors logged, loading dismissed).

### Legacy Archive
`src_legacy/` contains the complete original MUI/ODS codebase for reference. Never delete it.

### block-rte FloatingMenu
The `packages/block-rte/src/component/plugin/FloatingMenu/` has been rebuilt to use Lucide icons and plain HTML instead of ODS components.

## Environment Variables
Key variables in `packages/editor-sample/.env`:
- `REACT_APP_API_BASE_URL` - Backend API URL
- `REACT_APP_EMAIL_TEMPLATE_SERVER` - Email template server

## Deployment
Static site deployment:
- Build: `pnpm --filter @usewaypoint/editor-sample run vitebuild`
- Public dir: `packages/editor-sample/dist`
