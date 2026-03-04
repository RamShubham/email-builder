# Email Builder JS (Oute Email Editor)

## Overview
A React/Vite email template builder application built as a pnpm monorepo. This is the "editor-sample" package, rebuilt with Tailwind CSS + shadcn/ui + Lucide React — zero MUI, zero ODS packages. Features a conversational AI assistant that helps users design email templates through natural chat. Includes a TinyCommand AI integration layer with embeddable editor, postMessage API, template CRUD, and server-side rendering.

## Project Structure
```
server/                   # Express AI backend (port 3001)
  index.ts                # Express server entry point
  db.ts                   # PostgreSQL connection pool
  renderHtml.ts           # Server-side template rendering (CSS module shim)
  webhooks.ts             # Webhook event emitter
  middleware/
    auth.ts               # API key authentication middleware
  routes/
    templates.ts          # Template CRUD + render + block schema endpoints
  ai/
    templateAgent.ts      # OpenAI-powered conversational agent
    systemPrompt.ts       # System prompt with block schema + examples
packages/
  editor-sample/          # Main React/Vite frontend app (port 5000)
    src/                  # New Tailwind+shadcn UI (rebuilt)
      App/AiChat/         # AI chat overlay components
        AiChatOverlay.tsx  # Full-screen chat overlay
        ChatMessage.tsx    # Message bubble component
        ChatInput.tsx      # Chat input component
        useAiChat.ts       # Chat state management hook
      embed/
        usePostMessage.ts  # Bidirectional postMessage hook for iframe embed
      EmbedEditor.tsx      # Stripped-down editor for iframe embedding
    src_legacy/           # Archived legacy MUI/ODS code (do not delete)
  email-builder/          # Core email builder library (Reader component)
  document-core/          # Document model and block schema infrastructure
  block-*/                # Individual email block components (pure rendering)
  block-rte/              # Rich text editor block (FloatingMenu rebuilt)
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
- **AI Backend**: Express + OpenAI (via Replit AI Integrations, gpt-4.1)
- **AI Packages**: openai, express, cors
- **Database**: PostgreSQL (Replit built-in) with `pg` driver

## Running the App
Two workflows run simultaneously:
1. **Start application**: `pnpm --filter @usewaypoint/editor-sample run vitedev` — Vite dev server on port 5000
2. **AI Server**: `npx tsx server/index.ts` — Express AI backend on port 3001

Vite proxies `/api` requests to the Express server on port 3001.

For development testing, navigate to `/dev` to bypass auth.

## Database
PostgreSQL with a `templates` table:
- `id` UUID PK (auto-generated)
- `name` TEXT NOT NULL
- `description`, `subject`, `category` TEXT
- `template_json` JSONB (full TEditorConfiguration)
- `merge_fields` TEXT[]
- `thumbnail_url`, `workspace_id` TEXT
- `created_at`, `updated_at` TIMESTAMP

## API Endpoints

### AI Chat
- `POST /api/chat` — synchronous chat (returns full response)
- `POST /api/chat/stream` — streaming SSE chat (real-time chunks)
- `POST /api/chat/reset` — reset conversation session
- `POST /api/image/generate` — AI image generation (`{ prompt }` → `{ url }`)
- `GET /api/health` — health check

### Template CRUD
- `POST /api/templates` — create template (201)
- `GET /api/templates` — list templates (`?workspaceId`, `?category`, `?limit`, `?offset`)
- `GET /api/templates/:id` — get template by ID
- `PUT /api/templates/:id` — partial update
- `DELETE /api/templates/:id` — delete

### Rendering & Schema
- `POST /api/templates/:id/render` — render to HTML with variable substitution (`{ variables }` → `{ html, subject }`)
- `GET /api/blocks/schema` — all 12 block types, properties, font families, merge syntax

### Authentication
- API key auth via `Authorization: Bearer <key>` header
- Keys configured via `TINYEMAIL_API_KEYS` env var (comma-separated)
- If no keys configured, auth is skipped (dev mode)
- Public paths (no auth): `/api/health`, `/embed`, `/assets`

### Webhooks
- When `WEBHOOK_URL` env var is set, fires POST on template events:
  - `template.created`, `template.updated`, `template.deleted`, `template.rendered`
- Payload: `{ event, data: { templateId, name, workspaceId, timestamp } }`

## App Routes
- `/template?q=<encoded-params>` - Edit/create email template (production auth flow)
- `/asset?q=<encoded-params>` - Edit existing asset (production auth flow)
- `/dev` - Direct access bypassing auth (development only)
- `/embed` - Stripped-down editor for iframe embedding (no navbar/navigator)
  - URL params: `?mode=edit|preview|json`, `?hideInspector=true`, `?theme=dark`
- `*` - Shows "Page not found" message

## Embed / postMessage API
The `/embed` route supports bidirectional communication via `window.postMessage`:

### Host → Editor Messages
- `TINY_EMAIL_LOAD_TEMPLATE` — load a TEditorConfiguration into the editor
- `TINY_EMAIL_GET_TEMPLATE` — request current template (needs `requestId`)
- `TINY_EMAIL_GET_HTML` — render to HTML with optional variable substitution
- `TINY_EMAIL_SET_VARIABLES` — set merge field preview values
- `TINY_EMAIL_SET_THEME` — switch light/dark theme
- `TINY_EMAIL_SET_MODE` — switch edit/preview/json mode

### Editor → Host Messages
- `TINY_EMAIL_EDITOR_READY` — editor is initialized and ready
- `TINY_EMAIL_TEMPLATE_LOADED` — template was loaded (includes `blockCount`)
- `TINY_EMAIL_TEMPLATE_RESPONSE` — response to GET_TEMPLATE
- `TINY_EMAIL_HTML_RESPONSE` — response to GET_HTML (includes `html`)
- `TINY_EMAIL_TEMPLATE_CHANGED` — debounced (500ms) change notification
- `TINY_EMAIL_ERROR` — error response

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
- **Panels**: Navbar (top), Navigator (left, 180px), Canvas (center), Inspector (right), AI Prompt (bottom of canvas) — all floating
- **AI Prompt**: Separate floating island below the canvas (`AiPromptIsland` component), only visible on editor tab
- **Chat Overlay**: Frosted glass overlay within the canvas island, violet gradient accents
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

### block-rte FloatingMenu (Rebuilt)
The `packages/block-rte/` Rich Text Editor uses Lexical (by Meta). The floating toolbar was rebuilt from scratch:
- **FloatingMenu.tsx**: Toolbar with Bold, Italic, Unordered List, Ordered List, Link buttons. Uses `onMouseDown={preventDefault}` on the entire toolbar container to prevent focus theft from the Lexical editor. Inline styles, no SCSS modules.
- **FloatingMenuPlugin (index.tsx)**: Shows toolbar when text is selected, hides on deselection. Uses `registerUpdateListener` + pointer refs for selection tracking, `BLUR_COMMAND` handler for focus-out detection, `@floating-ui/dom` for positioning.
- **useFloatingMenu.ts**: Tracks active formatting state (bold/italic/list/link) via both `SELECTION_CHANGE_COMMAND` and `registerUpdateListener` so button highlights update after format commands, not just selection moves.
- **LinkPopover**: Renders via React Portal to `document.body` to escape canvas stacking context. URL input with validation, save/cancel, edit/delete existing links. Click-outside-to-close, escape key support. Pre-fills "https://" for new links.
- **Rte.tsx OnChangePlugin**: Uses `editorState.read()` instead of `editor.update()` to avoid nested Lexical updates.
- Dead files removed: `usePointerInteractions.ts`, FloatingMenu `styles.module.scss`, LinkPopover `styles.module.scss`.

### Variable Insertion System
The editor supports merge variables (`{{variableName}}`) in text fields:
- **Insert Variable button**: TextInput component has an optional `showVariableInsert` prop that shows a `{ } Variable` button with a popover containing common presets (firstName, lastName, email, companyName, unsubscribeUrl, previewText) and custom variable input. Enabled on content/URL fields in Text, Heading, Button, and Html inspector panels.
- **Visual pills**: EditableText and EditableHeading render `{{variable}}` as styled violet pills on the canvas (non-editing mode). URL link wrapping is preserved when the block has a URL set. In editing mode, raw `{{variable}}` text is shown for direct editing.
- **Data panel**: Shows detected variables with default value inputs. Empty state shows a helpful hint about the Variable button.
- **VariablePill component**: `src/components/VariablePill.tsx` — renders styled inline pill + `renderTextWithVariables()` utility for splitting text into pills and plain segments.

### Editable Block Components
All editable blocks (`packages/editor-sample/src/documents/blocks/customBlockComponent/editable/`) preserve full visual styling in edit mode:
- **EditableHeading**: Wraps input in styled container with padding/bg/borderRadius; applies explicit fontSize from level (h1=32, h2=24, h3=20), fontFamily, fontWeight, color, textAlign.
- **EditableText**: Applies padding, fontSize, fontFamily, fontWeight, textAlign, color, backgroundColor, borderRadius to textarea.
- **EditableButton**: Two-layer structure matching base Button — outer wrapper with padding/bg/textAlign, inner div with buttonBackgroundColor/borderRadius/size-dependent padding, input with buttonTextColor/fontWeight. Supports fullWidth and all button sizes.
- **EditableHtml**: Uses monospace code-editor styling (intentionally different from rendered output).

### Server-Side Rendering
The render endpoint (`POST /api/templates/:id/render`) uses `renderToStaticMarkup` from `@usewaypoint/email-builder` server-side via `tsx`. A CSS module shim in `server/renderHtml.ts` intercepts `.scss`/`.css` imports that `tsx` can't handle natively, returning empty proxy objects instead.

## Environment Variables
Key variables:
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key (managed by Replit Integrations)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI base URL (managed by Replit Integrations)
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned)
- `TINYEMAIL_API_KEYS` - Comma-separated API keys for authentication (optional, auth skipped if empty)
- `TINYCOMMAND_ORIGIN` - Allowed CORS origin for TinyCommand AI (optional)
- `WEBHOOK_URL` - Webhook endpoint for template events (optional)
- `REACT_APP_API_BASE_URL` - Backend API URL
- `REACT_APP_EMAIL_TEMPLATE_SERVER` - Email template server

## Deployment
Autoscale deployment using the Express server:
- Build: `pnpm --filter @usewaypoint/editor-sample run vitebuild`
- Run: `npx tsx server/index.ts` (serves API + static frontend with SPA fallback)
- In production, the server uses `PORT` env var (defaults to 3001 in dev)
- The Express server serves static files from `packages/editor-sample/dist` and falls back to `index.html` for all unmatched routes (SPA routing)
