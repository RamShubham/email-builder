# TinyEmail — Full Architecture & Technical Documentation

> This document provides an exhaustive technical reference for the TinyEmail project, intended for developers building integrations (e.g., TinyCommand AI). All information is derived directly from the source code.

---

## SECTION 1: Overall Architecture

### Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite 5 (with `@vitejs/plugin-react-swc`) |
| **Language** | TypeScript (strict) |
| **UI Library** | Tailwind CSS v3 + shadcn/ui (Radix UI primitives) + Lucide React |
| **State Management** | Zustand |
| **Drag & Drop** | @dnd-kit/core, @dnd-kit/sortable |
| **Rich Text Editor** | Lexical (by Meta) |
| **Validation** | Zod (pervasive — every block has a Zod schema) |
| **Backend** | Express.js (Node.js, executed via `tsx`) |
| **AI** | OpenAI SDK — GPT-4.1 for chat, gpt-image-1 for image generation |
| **Streaming** | Server-Sent Events (SSE) |
| **Package Manager** | pnpm with workspaces (monorepo) |
| **Testing** | Jest, React Testing Library |
| **Linting** | ESLint, Prettier |
| **Database** | None (stateless — templates are JSON objects held in-memory or exported) |
| **Cache/Queue** | None (in-memory session store with TTL) |

### Project Folder Structure

```
/
├── server/                          # Express AI backend (port 3001)
│   ├── index.ts                     # Express server entry point
│   └── ai/
│       ├── templateAgent.ts         # OpenAI-powered conversational agent
│       └── systemPrompt.ts          # System prompt with block schema + examples
│
├── packages/
│   ├── editor/               # Main React/Vite frontend app (port 5000)
│   │   ├── src/
│   │   │   ├── App/                 # Top-level app components
│   │   │   │   ├── AiChat/          # AI chat overlay (streaming, template apply)
│   │   │   │   ├── InspectorDrawer/ # Right sidebar (Blocks, Styles, Inspect, Data tabs)
│   │   │   │   ├── NavigatorDrawer/ # Left sidebar (document tree view)
│   │   │   │   └── TemplatePanel/   # Canvas (editor, preview, JSON, HTML views)
│   │   │   ├── documents/
│   │   │   │   ├── editor/          # EditorContext (Zustand), EditorBlock, core dictionary
│   │   │   │   └── blocks/          # Custom block components with editable wrappers
│   │   │   ├── getConfiguration/    # Sample templates (welcome, reset-password, etc.)
│   │   │   ├── styles/              # globals.css (Tailwind + scoped overrides)
│   │   │   ├── utils/               # Helpers (replaceTemplateVariables, findVariable)
│   │   │   └── constant/            # fontFamily mapping, block buttons config
│   │   ├── src_legacy/              # Archived original MUI/ODS codebase (reference only)
│   │   ├── tailwind.config.js
│   │   └── vite.config.ts
│   │
│   ├── email-builder/               # Core rendering engine
│   │   ├── src/
│   │   │   ├── Reader/              # Reader component (renders JSON → React tree)
│   │   │   ├── renderers/           # renderToStaticMarkup (React → HTML string)
│   │   │   └── blocks/              # Reader-specific block renderers (email-safe)
│   │
│   ├── document-core/               # Document model, block schema infrastructure
│   │   └── src/
│   │       ├── builders/            # buildBlockComponent, buildBlockConfigurationSchema
│   │       └── utils/               # Block validation utilities
│   │
│   ├── block-heading/               # Heading block (h1/h2/h3)
│   ├── block-text/                  # Text block
│   ├── block-button/                # Button block (with MSO/Outlook support)
│   ├── block-image/                 # Image block
│   ├── block-avatar/                # Avatar block (circle/square/rounded)
│   ├── block-divider/               # Divider block (horizontal line)
│   ├── block-spacer/                # Spacer block (vertical space)
│   ├── block-html/                  # Raw HTML block (with DOMPurify sanitization)
│   ├── block-columns-container/     # Multi-column layout (2 or 3 columns)
│   ├── block-container/             # Generic container (groups child blocks)
│   ├── block-rte/                   # Rich Text Editor block (Lexical-based)
│   ├── stub-oute-tiny-auth/         # Auth service stub
│   └── stub-oute-image-picker/      # Image picker service stub
│
├── images/                          # Static assets
├── attached_assets/                 # Reference files
├── package.json                     # Root pnpm workspace config
├── pnpm-workspace.yaml              # Workspace package declarations
└── replit.md                        # Project documentation (auto-loaded)
```

### Deployment

- **Development**: Two concurrent processes managed by Replit Workflows:
  1. `Start application`: `pnpm --filter @usewaypoint/editor run vitedev` (port 5000)
  2. `AI Server`: `npx tsx server/index.ts` (port 3001)
- **Production**: Static site deployment — `pnpm --filter @usewaypoint/editor run vitebuild` outputs to `packages/editor/dist`
- **Proxy**: Vite proxies `/api/*` requests from port 5000 → port 3001

### External Services

| Service | Usage | Configuration |
|:---|:---|:---|
| **OpenAI API** | GPT-4.1 for chat/template generation, gpt-image-1 for image generation | `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL` (managed by Replit Integrations) |

### Base URL Structure

| Service | URL |
|:---|:---|
| Frontend (dev) | `http://localhost:5000` |
| Backend (dev) | `http://localhost:3001` |
| API (via proxy) | `http://localhost:5000/api/*` → `http://localhost:3001/api/*` |

---

## SECTION 2: Database Schema

**TinyEmail does not use a traditional database.** The project is entirely stateless on the server side.

- **Templates** are JSON objects (`TEditorConfiguration`) stored client-side in the Zustand store.
- **Chat sessions** are stored in an in-memory `Map<string, Session>` with a 30-minute TTL and a max of 100 sessions.
- **No user accounts, no contacts table, no campaign records** exist in the current implementation.
- Templates can be exported/imported as JSON files via the editor UI.

### In-Memory Session Schema

```typescript
interface Session {
  messages: ChatMessage[];  // Array of {role, content}
  lastAccess: number;       // Unix timestamp (ms)
}

// Max 40 messages per session (oldest trimmed)
// Max 100 total sessions (LRU eviction)
// 30-minute TTL per session
```

### Template Data Schema (JSON — Client-Side)

See **Section 4** for the complete template data model.

---

## SECTION 3: API Endpoints — Complete

All endpoints are served by the Express server on port 3001. The Vite dev server proxies `/api/*` to this backend.

### Health Check

#### `GET /api/health`

| Field | Value |
|:---|:---|
| **Authentication** | None |
| **Request Body** | None |
| **Response** | `{ "status": "ok" }` |

---

### AI Chat (Non-Streaming)

#### `POST /api/chat`

| Field | Value |
|:---|:---|
| **Authentication** | None |
| **Content-Type** | `application/json` |

**Request Body:**

```json
{
  "message": "Create a welcome email for my SaaS product",
  "sessionId": "user-123"
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `message` | `string` | Yes | The user's chat message |
| `sessionId` | `string` | No | Session identifier (default: `"default"`) |

**Response (message only):**

```json
{
  "type": "message",
  "content": "I'd love to help! What's the name of your product and what tone are you going for?"
}
```

**Response (with template):**

```json
{
  "type": "template",
  "content": "Here's your welcome email! Click 'Apply to canvas' to load it.",
  "template": {
    "root": {
      "type": "EmailLayout",
      "data": { ... }
    },
    "block-heading": {
      "type": "Heading",
      "data": { ... }
    }
  }
}
```

**Error Response:**

```json
{
  "error": "Failed to process message",
  "details": "Error message from OpenAI"
}
```

---

### AI Chat (Streaming via SSE)

#### `POST /api/chat/stream`

| Field | Value |
|:---|:---|
| **Authentication** | None |
| **Content-Type (Request)** | `application/json` |
| **Content-Type (Response)** | `text/event-stream` |

**Request Body:** Same as `POST /api/chat`

**SSE Response Stream:**

Each chunk is sent as a `data:` line:

```
data: {"type":"chunk","content":"I'd love to "}

data: {"type":"chunk","content":"help you create "}

data: {"type":"chunk","content":"a welcome email!"}

data: {"type":"done","responseType":"message","content":"I'd love to help you create a welcome email!"}
```

When a template is generated:

```
data: {"type":"done","responseType":"template","content":"Here's your template!","template":{...}}
```

On error (after headers sent):

```
data: {"type":"error","error":"Error message"}
```

---

### Chat Session Reset

#### `POST /api/chat/reset`

| Field | Value |
|:---|:---|
| **Authentication** | None |

**Request Body:**

```json
{
  "sessionId": "user-123"
}
```

**Response:**

```json
{
  "success": true
}
```

---

### AI Image Generation

#### `POST /api/image/generate`

| Field | Value |
|:---|:---|
| **Authentication** | None |
| **Content-Type** | `application/json` |
| **Max Request Size** | 50MB (`express.json({ limit: '50mb' })`) |

**Request Body:**

```json
{
  "prompt": "Professional flat illustration of a team collaborating in a modern office, blue and white color scheme",
  "aspectRatio": "landscape"
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `prompt` | `string` | Yes | Descriptive text for image generation |
| `aspectRatio` | `string` | No | `"square"` (1024x1024), `"landscape"` (1536x1024), `"portrait"` (1024x1536). Default: `"landscape"` |

**Response:**

```json
{
  "url": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Error Response:**

```json
{
  "error": "Failed to generate image"
}
```

> **⚠ Frontend–Backend Contract Mismatch (Image API)**
>
> The backend endpoint (`server/index.ts`) expects `{ prompt, aspectRatio? }` and returns `{ url }`.
> However, the legacy frontend hook (`useGenerateImg.ts`) sends `{ imageDescription, workspaceId }` and expects `{ data: { imageUrl } }`.
> This mismatch exists because the frontend image hook was written for the original platform's API; the current Express server uses a different contract.
> When integrating, use the **backend contract** described above (`prompt` / `url`). The frontend hook is not actively used with the current server.

---

## SECTION 4: Email Template / Design Data Model

### How Templates Are Stored

Templates are stored as **flat JSON objects** (`TEditorConfiguration`). Each key is a unique block ID, and each value is a block configuration. This is a normalized, dictionary-based structure (not a nested tree) for efficient O(1) lookups and updates.

### Template vs Campaign

In the current implementation, there is **no distinction** between templates and campaigns. The system deals exclusively with email templates (design documents). There is no campaign management, scheduling, or sending infrastructure.

### Email Builder / Editor

The editor is a **drag-and-drop visual builder** with the following views:
- **Editor** (interactive WYSIWYG canvas)
- **Preview** (read-only rendered output)
- **JSON** (raw JSON editor)
- **HTML** (final rendered HTML output)

### Document JSON Structure

```typescript
type TEditorConfiguration = {
  root: {
    type: 'EmailLayout';
    data: {
      backdropColor: string;    // Hex color — background behind the email
      borderColor: string;      // Hex color — border around the canvas
      borderRadius: number;     // Border radius on the canvas (pixels)
      canvasColor: string;      // Hex color — email body background
      textColor: string;        // Hex color — default text color
      fontFamily: FontFamily;   // Font family enum
      childrenIds: string[];    // Ordered list of top-level block IDs
    };
  };
  [blockId: string]: {
    type: BlockType;
    data: {
      style?: { ... };   // Visual properties (padding, colors, fonts, etc.)
      props?: { ... };   // Content & configuration (text, URLs, children, etc.)
    };
  };
};
```

### Complete Real Template Example (Welcome Email)

```json
{
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F2F5F7",
      "canvasColor": "#FFFFFF",
      "textColor": "#242424",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-logo",
        "block-greeting",
        "block-body",
        "block-body-2",
        "block-hero-image",
        "block-help-text",
        "block-cta",
        "block-footer-image"
      ]
    }
  },
  "block-logo": {
    "type": "Image",
    "data": {
      "style": {
        "padding": { "top": 24, "bottom": 24, "right": 24, "left": 24 }
      },
      "props": {
        "url": "https://d1iiu589g39o6c.cloudfront.net/live/platforms/platform_A9wwKSL6EV6orh6f/images/wptemplateimage_JTNBBPGrNs2Ph4JL/marketbase.png",
        "alt": "Marketbase",
        "linkHref": "https://marketbase.app",
        "contentAlignment": "middle"
      }
    }
  },
  "block-greeting": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": { "top": 0, "bottom": 16, "right": 24, "left": 24 }
      },
      "props": {
        "text": "Hi Anna 👋,"
      }
    }
  },
  "block-body": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": { "top": 0, "bottom": 16, "right": 24, "left": 24 }
      },
      "props": {
        "text": "Welcome to Marketbase! Marketbase is how teams within fast growing marketplaces effortlessly monitor conversations to prevent disintermediation, identify problematic users, and increase trust & safety within their community."
      }
    }
  },
  "block-body-2": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": { "top": 0, "bottom": 16, "right": 24, "left": 24 }
      },
      "props": {
        "text": "Best of all, you can connect your existing messaging services in minutes:"
      }
    }
  },
  "block-hero-image": {
    "type": "Image",
    "data": {
      "style": {
        "padding": { "top": 16, "bottom": 16, "right": 24, "left": 24 }
      },
      "props": {
        "url": "https://example.com/screenshot.png",
        "alt": "Video thumbnail",
        "linkHref": "https://example.com/video",
        "contentAlignment": "middle"
      }
    }
  },
  "block-help-text": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": { "top": 16, "bottom": 16, "right": 24, "left": 24 }
      },
      "props": {
        "text": "If you ever need help, just reply to this email and one of us will get back to you shortly. We're here to help."
      }
    }
  },
  "block-cta": {
    "type": "Button",
    "data": {
      "style": {
        "fontSize": 14,
        "padding": { "top": 16, "bottom": 24, "right": 24, "left": 24 }
      },
      "props": {
        "buttonBackgroundColor": "#0079cc",
        "buttonStyle": "rectangle",
        "text": "Open dashboard",
        "url": "https://www.example.com"
      }
    }
  },
  "block-footer-image": {
    "type": "Image",
    "data": {
      "style": {
        "padding": { "top": 16, "bottom": 40, "right": 24, "left": 24 }
      },
      "props": {
        "url": "https://example.com/illustration.png",
        "alt": "Illustration",
        "linkHref": null,
        "contentAlignment": "middle"
      }
    }
  }
}
```

### Available Building Blocks (ALL)

#### 1. EmailLayout (Root Block — required, exactly one)

| Property | Type | Description |
|:---|:---|:---|
| `data.backdropColor` | `string` (hex) | Background color behind the email |
| `data.borderColor` | `string` (hex) | Border color around the canvas |
| `data.borderRadius` | `number` | Border radius on the canvas (pixels, must be positive) |
| `data.canvasColor` | `string` (hex) | Email body background color |
| `data.textColor` | `string` (hex) | Default text color |
| `data.fontFamily` | `FontFamily` enum | Global font family |
| `data.childrenIds` | `string[]` | Ordered list of top-level block IDs |

#### 2. Heading

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.text` | `string` | `""` | Heading text content |
| `data.props.level` | `"h1" \| "h2" \| "h3"` | `"h2"` | Heading level (h1=32px, h2=24px, h3=20px) |
| `data.props.url` | `string` (URL) | `null` | Optional link URL |
| `data.style.color` | `string` (hex) | `null` | Text color |
| `data.style.backgroundColor` | `string` (hex) | `null` | Background color |
| `data.style.fontFamily` | `FontFamily` | `null` | Font family override |
| `data.style.fontWeight` | `"bold" \| "normal"` | `"bold"` | Font weight |
| `data.style.textAlign` | `"left" \| "center" \| "right"` | `null` | Text alignment |
| `data.style.padding` | `PaddingObject` | — | `{ top, bottom, left, right }` in pixels |
| `data.style.borderRadius` | `number` | `null` | Border radius in pixels |

#### 3. Text

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.text` | `string` | `""` | Text content |
| `data.props.markdown` | `boolean` | `null` | Enable markdown rendering |
| `data.props.url` | `string` (URL) | `null` | Optional link URL |
| `data.style.color` | `string` (hex) | `null` | Text color |
| `data.style.backgroundColor` | `string` (hex) | `null` | Background color |
| `data.style.fontSize` | `number` | `null` | Font size in pixels |
| `data.style.fontFamily` | `FontFamily` | `null` | Font family |
| `data.style.fontWeight` | `"bold" \| "normal"` | `null` | Font weight |
| `data.style.textAlign` | `"left" \| "center" \| "right"` | `null` | Text alignment |
| `data.style.padding` | `PaddingObject` | — | Padding in pixels |
| `data.style.borderRadius` | `number` | `null` | Border radius |

#### 4. Button

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.text` | `string` | `""` | Button label |
| `data.props.url` | `string` | `""` | Button link URL (supports `{{variable}}` syntax) |
| `data.props.buttonBackgroundColor` | `string` (hex) | `"#999999"` | Button fill color |
| `data.props.buttonTextColor` | `string` (hex) | `"#FFFFFF"` | Button text color |
| `data.props.buttonStyle` | `"rectangle" \| "rounded" \| "pill"` | `"rounded"` | Button shape |
| `data.props.size` | `"x-small" \| "small" \| "medium" \| "large"` | `"medium"` | Button size |
| `data.props.fullWidth` | `boolean` | `false` | Full-width button |
| `data.style.backgroundColor` | `string` (hex) | `null` | Wrapper background |
| `data.style.fontSize` | `number` | `16` | Font size |
| `data.style.fontFamily` | `FontFamily` | `null` | Font family |
| `data.style.fontWeight` | `"bold" \| "normal"` | `"bold"` | Font weight |
| `data.style.textAlign` | `"left" \| "center" \| "right"` | `null` | Button alignment |
| `data.style.padding` | `PaddingObject` | — | Wrapper padding |

Button size → internal padding mapping:
- `x-small`: `4px 8px`
- `small`: `8px 12px`
- `medium`: `12px 20px`
- `large`: `16px 32px`

Button style → border radius mapping:
- `rectangle`: `0`
- `rounded`: `4px`
- `pill`: `64px`

#### 5. Image

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.url` | `string` | `null` | Image source URL |
| `data.props.alt` | `string` | `null` | Alt text (doubles as AI image generation prompt) |
| `data.props.width` | `number` | `null` | Image width |
| `data.props.height` | `number` | `null` | Image height |
| `data.props.linkHref` | `string` (URL) | `null` | Clickable link |
| `data.props.contentAlignment` | `"top" \| "middle" \| "bottom"` | `null` | Vertical alignment |
| `data.style.padding` | `PaddingObject` | — | Padding |
| `data.style.backgroundColor` | `string` (hex) | `null` | Background color |
| `data.style.textAlign` | `"left" \| "center" \| "right"` | `null` | Horizontal alignment |

#### 6. Avatar

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.imageUrl` | `string` | `""` | Avatar image URL |
| `data.props.alt` | `string` | `""` | Alt text |
| `data.props.size` | `number` | `64` | Avatar size in pixels |
| `data.props.shape` | `"circle" \| "square" \| "rounded"` | `"square"` | Avatar shape |
| `data.style.textAlign` | `"left" \| "center" \| "right"` | `null` | Alignment |
| `data.style.padding` | `PaddingObject` | — | Padding |

#### 7. Divider

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.lineColor` | `string` (hex) | `"#333333"` | Line color |
| `data.props.lineHeight` | `number` | `1` | Line thickness in pixels |
| `data.style.backgroundColor` | `string` (hex) | `null` | Background color |
| `data.style.padding` | `PaddingObject` | — | Padding |

#### 8. Spacer

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.height` | `number` | `16` | Spacer height in pixels |

#### 9. Html (Raw HTML)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.contents` | `string` | `null` | Raw HTML content (sanitized with DOMPurify) |
| `data.style.color` | `string` (hex) | `null` | Text color |
| `data.style.backgroundColor` | `string` (hex) | `null` | Background color |
| `data.style.fontFamily` | `FontFamily` | `null` | Font family |
| `data.style.fontSize` | `number` | `null` | Font size |
| `data.style.textAlign` | `"left" \| "center" \| "right"` | `null` | Text alignment |
| `data.style.padding` | `PaddingObject` | — | Padding |

#### 10. Container

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.childrenIds` | `string[]` | `[]` | IDs of child blocks |
| `data.style.backgroundColor` | `string` (hex) | `null` | Background color |
| `data.style.borderColor` | `string` (hex) | `null` | Border color |
| `data.style.borderRadius` | `number` | `null` | Border radius |
| `data.style.padding` | `PaddingObject` | — | Padding |

#### 11. ColumnsContainer

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.columnsCount` | `2 \| 3` | `2` | Number of columns |
| `data.props.columnsGap` | `number` | `0` | Gap between columns in pixels |
| `data.props.contentAlignment` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical content alignment |
| `data.props.fixedWidths` | `[number?, number?, number?]` | `null` | Fixed column widths |
| `data.props.columns` | `Array<{ childrenIds: string[] }>` | — | Array of column definitions |
| `data.style.backgroundColor` | `string` (hex) | `null` | Background color |
| `data.style.padding` | `PaddingObject` | — | Padding |

#### 12. Rich Text (RTE)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `data.props.content` | `any` | `null` | Lexical editor state (JSON) |
| `data.props.html` | `string` | `null` | Rendered HTML output |
| `data.style.padding` | `PaddingObject` | — | Padding |
| `data.style.backgroundColor` | `string` (hex) | `null` | Background color |
| `data.style.borderRadius` | `number` | `null` | Border radius |

### Shared Types

#### FontFamily Enum

```typescript
type FontFamily =
  | 'MODERN_SANS'      // "Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif
  | 'BOOK_SANS'        // Optima, Candara, "Noto Sans", source-sans-pro, sans-serif
  | 'ORGANIC_SANS'     // Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", ...
  | 'GEOMETRIC_SANS'   // Avenir, "Avenir Next LT Pro", Montserrat, Corbel, ...
  | 'HEAVY_SANS'       // Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", ...
  | 'ROUNDED_SANS'     // ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, ...
  | 'MODERN_SERIF'     // Charter, "Bitstream Charter", "Sitka Text", Cambria, serif
  | 'BOOK_SERIF'       // "Iowan Old Style", "Palatino Linotype", "URW Palladio L", ...
  | 'MONOSPACE'        // "Nimbus Mono PS", "Courier New", "Cutive Mono", monospace
  | 'inherit';
```

#### PaddingObject

```typescript
type PaddingObject = {
  top: number;     // pixels
  bottom: number;  // pixels
  left: number;    // pixels
  right: number;   // pixels
};
```

### How Final HTML Is Generated

1. `renderToStaticMarkup()` (in `packages/email-builder/src/renderers/renderToStaticMarkup.tsx`) takes the JSON document.
2. It wraps the `Reader` component in `<html>` and `<body>` tags.
3. The `Reader` uses a `READER_DICTIONARY` to recursively render each block as email-safe React components.
4. `ReactDOMServer.renderToStaticMarkup()` converts the React tree to an HTML string.
5. `<!DOCTYPE html>` is prepended.
6. All styles are **inline** (`style="..."` attributes) — no external CSS. This ensures maximum email client compatibility.
7. Some blocks include MSO (Microsoft Outlook) conditional comments for Outlook compatibility.
8. The `Html` block sanitizes user-provided HTML with **DOMPurify** before rendering.
9. The `EmailLayout` renders a centered `<table>` with `max-width: 600px` (email best practice).

### Pre-Built Template Categories

| Template | Category | File |
|:---|:---|:---|
| Welcome Email | Lifecycle/Engagement | `welcome.ts` |
| One-Time Passcode | Security/Utility | `one-time-passcode.ts` |
| Order E-commerce | Transactional | `order-ecommerce.ts` |
| Post Metrics Report | Reporting | `post-metrics-report.ts` |
| Reservation Reminder | Lifecycle/Engagement | `reservation-reminder.ts` |
| Reset Password | Security/Utility | `reset-password.ts` |
| Respond to Message | Notification | `respond-to-message.ts` |
| Subscription Receipt | Transactional | `subscription-receipt.ts` |
| Empty Email | Starter | `empty-email-message.ts` |

Templates are loaded via `packages/editor/src/getConfiguration/index.tsx` using URL hash routing (e.g., `#sample/welcome`).

### A/B Testing, Thumbnails, Size Limits

- **A/B Testing**: Not implemented.
- **Thumbnails/Previews**: Not auto-generated. The editor has a live "Preview" tab.
- **Max Email Size**: No explicit limit enforced.

---

## SECTION 5: Merge Fields & Dynamic Content

### Syntax

Merge fields use **double curly braces**:

```
{{variable_name}}
```

Examples: `{{first_name}}`, `{{company}}`, `{{order_id}}`, `{{unsubscribe_url}}`

### How Variables Work

1. **Definition**: Users type `{{variable_name}}` directly into any text field of any block (heading text, body text, button URL, etc.).

2. **Discovery**: The `DataPanel` component scans the entire document for `{{...}}` patterns using this regex:

```typescript
/{{(.*?)}}/g
```

3. **Default Values**: Discovered variables appear in the **Data** tab of the inspector, where users can set default/preview values.

4. **Resolution**: The `replaceTemplateVariables` utility replaces placeholders with values:

```typescript
export function replaceTemplateVariables(props: Props, globalVariables: GlobalVariables) {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => {
      if (typeof value !== 'string') return [key, value];
      const updatedValue = value.replace(
        /{{(.*?)}}/g,
        (_, variableName) =>
          globalVariables[variableName]
            ? globalVariables[variableName]
            : `{{${variableName}}}`  // Keep unresolved placeholders
      );
      return [key, updatedValue];
    })
  );
}
```

5. **Storage**: Each block maintains two versions of its properties:
   - `template`: The original with placeholders (e.g., `"Hello {{name}}"`)
   - `props`: The resolved version for rendering (e.g., `"Hello John"`)

6. **Reactivity**: When variables change in `EditorContext`, a `useEffect` in `App.tsx` re-runs `replaceTemplateVariables` on every block's template to update the rendered props.

### Custom Merge Fields

Users can define **any** custom merge field simply by typing `{{anything}}` in their content. There is no predefined list — all variables are dynamically discovered from the document content.

### Conditional Content

Not implemented. There is no conditional content or segmentation logic.

### Fallback Values

If a variable is not found in the current `globalVariables`, the placeholder is **kept as-is** (e.g., `{{first_name}}` remains in the output). The Data tab allows setting default values that serve as fallback previews.

---

## SECTION 6: Contact & List Management

**Not implemented.** TinyEmail is purely an email template builder. There is no:
- Contact database
- Subscriber management
- List/audience/segment system
- Contact import
- Unsubscribe handling
- Contact scoring or tagging
- Segmentation logic

This would need to be provided by the integrating system (e.g., TinyCommand AI).

---

## SECTION 7: Email Sending Pipeline

**Not implemented.** TinyEmail does not send emails. It:
1. Designs email templates (visual editor + AI assistant)
2. Generates final HTML (`renderToStaticMarkup`)
3. Exports the HTML or JSON for use by external sending systems

There is no:
- Email sending provider integration (SES, SendGrid, etc.)
- SPF/DKIM/DMARC configuration
- Queue system
- Batch sending
- Retry logic
- From address management

The generated HTML is standard email-compatible HTML that can be used with any sending provider.

---

## SECTION 8: Email Tracking & Analytics

**Not implemented.** There is no:
- Open tracking (no tracking pixels)
- Click tracking (no URL rewriting)
- Bounce processing
- Unsubscribe processing
- Analytics storage
- Engagement scoring

---

## SECTION 9: Campaign Management

**Not implemented.** There is no:
- Campaign types
- Campaign lifecycle/status
- Scheduling
- Sequences/automations
- Campaign-template associations

The system works with individual templates only.

---

## SECTION 11: Authentication & Authorization

### Server-Side (API)

**No authentication is enforced** on the Express API endpoints. All routes are publicly accessible.

- The server uses environment variables (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`) for OpenAI API access.
- There are stub packages (`stub-oute-tiny-auth`) suggesting authentication was planned/exists in the parent platform, but it is not active in this deployment.
- CORS is fully open (`app.use(cors())`).

### Frontend Authentication (Legacy/Stub)

The frontend includes a vestigial authentication mechanism from the parent platform:

1. **`AuthRoute.tsx`** wraps the editor and performs session initialization:
   - Reads a `q` query parameter containing a base64-encoded JSON with workspace, project, parent, and asset IDs.
   - Falls back to a **hardcoded** `HARDCODED_QUERY_PARAM` and `HARDCODED_ACCESS_TOKEN` if no `q` param is present.
   - Sets `window.accessToken` to the hardcoded JWT globally.

2. **Request interceptor** (`useRequest.ts`): An Axios interceptor attaches `window.accessToken` as a `token` header on all outgoing requests:

   ```typescript
   instance.interceptors.request.use((config) => {
     const headers = {
       ...(config.headers || {}),
       token: config.headers?.token || window.accessToken,
     };
     return { ...config, headers };
   });
   ```

3. **Impact**: The hardcoded token and query parameter are **development artifacts**. The Express AI server does not validate these headers. This mechanism only affects requests made via the `useRequest` hook (legacy platform API calls, not the AI chat endpoints).

> **⚠ Security Note**: The hardcoded JWT in `AuthRoute.tsx` is a credential exposure risk. For production, this should be replaced with a real authentication flow (OAuth, session-based, or API key exchange). The hardcoded token should be removed and rotated.

### For External Integration

An external system (like TinyCommand AI) can call TinyEmail's API directly with no authentication. For production, you would need to:
1. Add API key or JWT authentication middleware to Express routes
2. Implement workspace-level access control
3. Remove the hardcoded token from `AuthRoute.tsx`
4. Configure CORS restrictions

---

## SECTION 12: Embeddable Components (iframe / SDK)

### Current State

There is **no dedicated iframe embedding endpoint** or JavaScript SDK. However, the application is architected in a way that makes embedding feasible:

### How to Embed

1. **iframe Approach**: The editor runs at `http://localhost:5000/dev` (or production URL). It could be loaded in an iframe.

2. **Communication**: Currently, there is no `postMessage` API implemented. To enable host ↔ editor communication, you would need to add:
   - Message listener in the editor for loading templates
   - Message sender for template save events
   - Theme/config injection via URL parameters or postMessage

3. **What Would Need to Change**:
   - Add a `/embed` route that renders the editor without the navbar/navigation
   - Implement `window.postMessage` handlers for:
     - `loadTemplate(json)` — load a template into the editor
     - `getTemplate()` — export the current template
     - `getHtml()` — export the rendered HTML
     - `setTheme(config)` — customize appearance
   - Add URL parameters for initial configuration:
     - `?template=base64encodedJson`
     - `?hideNav=true`
     - `?theme=dark`

### State Management for Embedding

The editor uses Zustand with exported setter functions, making programmatic control straightforward:

```typescript
// These functions are already exported from EditorContext:
setDocument(blocks)           // Load a template
useDocument()                 // Read current template
setSelectedBlockId(id)        // Select a block
setVariables(vars)            // Set merge field values
```

---

## SECTION 13: File & Image Handling

### Image Sources

Images in TinyEmail can come from three sources:

1. **Direct URL**: User pastes an image URL into the Image block's configuration.
2. **AI Generation**: User describes the image → `/api/image/generate` → returns base64 Data URL.
3. **External CDN**: Sample templates reference images from `d1iiu589g39o6c.cloudfront.net`.

### AI Image Generation

- **Model**: OpenAI `gpt-image-1`
- **Quality**: `medium`
- **Supported Sizes**:
  - `square`: 1024x1024
  - `landscape`: 1536x1024
  - `portrait`: 1024x1536
- **Output**: Base64-encoded PNG returned as `data:image/png;base64,...`
- **Alt Text as Prompt**: The AI template builder writes descriptive alt text that doubles as an image generation prompt. Users can click "Generate with AI" on any image block.

### Image Storage

- **No server-side image storage exists**. Images are either:
  - External URLs referenced in the template JSON
  - Base64 Data URLs embedded directly in the template JSON
- **No media library or gallery feature** exists.
- **No image optimization or resizing** is performed.

### File Types & Limits

- The Express server accepts up to **50MB** request bodies (`express.json({ limit: '50mb' })`)
- The Image block accepts any URL string — no file type validation
- In practice, PNG and JPEG are used

---

## SECTION 14: Sequences / Automations / Drip Campaigns

**Not implemented.** There is no:
- Multi-step email sequences
- Trigger types
- Branching/conditional logic
- Delay configuration
- Contact enrollment/exit logic

---

## SECTION 15: Error Handling & Edge Cases

### API Error Format

All API errors follow this pattern:

```json
{
  "error": "Human-readable error description",
  "details": "Technical error message (optional)"
}
```

HTTP status codes used:
- `400` — Invalid request (missing/malformed fields)
- `500` — Server error (OpenAI API failure, etc.)

### Validation Errors

```json
// 400 Bad Request
{ "error": "Message is required" }

// 400 Bad Request
{ "error": "Prompt is required" }
```

### SSE Error Handling

If an error occurs after SSE headers have been sent:

```
data: {"type":"error","error":"Error message"}
```

The connection is then closed.

### Template Parsing Failures

If the AI generates invalid JSON between the template markers, `extractTemplate` catches the `JSON.parse` error and returns the raw text as a message (no template):

```typescript
try {
  const template = JSON.parse(jsonStr);
  return { content, template };
} catch (e) {
  return { content: text, template: null };
}
```

### Merge Field Edge Cases

- Missing variables: Placeholder is kept as-is (`{{unknown}}` remains in output)
- Non-string values: Skipped during replacement (only strings are processed)
- Empty variables object: Props returned unchanged (no processing)

### HTML Sanitization

The Html block uses DOMPurify to sanitize raw HTML content, preventing XSS attacks. Data attributes are explicitly allowed.

---

## SECTION 16: Existing Integrations

### Current Integrations

| Integration | Type | Description |
|:---|:---|:---|
| **OpenAI** | API | GPT-4.1 for conversational template building, gpt-image-1 for image generation. Managed via Replit AI Integrations. |

### No Other Integrations Exist

There are no:
- CRM integrations
- E-commerce integrations
- Form builder integrations
- Zapier/Make integrations
- Published SDKs or client libraries
- Official API documentation URL

### Stub Services

Two stub packages exist suggesting planned integrations:
- `stub-oute-tiny-auth` — Authentication service stub
- `stub-oute-image-picker` — Image picker service stub (displays "Image picker is not available in this environment")

---

## SECTION 17: What Needs to Change for TinyCommand AI Integration

### Existing Endpoints That Can Be Used Directly

| Endpoint | Use Case |
|:---|:---|
| `POST /api/chat` | Generate email templates via AI conversation |
| `POST /api/chat/stream` | Stream AI-generated templates in real-time |
| `POST /api/chat/reset` | Reset conversation context |
| `POST /api/image/generate` | Generate images for email templates |
| `GET /api/health` | Health check |

### New API Endpoints Needed

| Endpoint | Purpose |
|:---|:---|
| `POST /api/templates` | Save a template (requires database) |
| `GET /api/templates/:id` | Load a template by ID |
| `GET /api/templates` | List all templates (with pagination) |
| `PUT /api/templates/:id` | Update a template |
| `DELETE /api/templates/:id` | Delete a template |
| `POST /api/templates/:id/render` | Render a template to HTML with variable substitution |
| `POST /api/templates/validate` | Validate a template JSON structure |
| `GET /api/blocks/schema` | Return the complete block schema (for AI knowledge base) |

### Data Model Changes Needed

1. **Add a database** (PostgreSQL recommended) with tables for:
   - `templates` — id, name, json_data, created_at, updated_at, workspace_id
   - `api_keys` — id, key_hash, workspace_id, scopes, created_at
   - Optional: `template_versions` for version history

2. **Template metadata**: Add fields for name, description, category, thumbnail_url, tags.

### Authentication Changes Needed

1. **API Key authentication**: Middleware that validates `Authorization: Bearer <api_key>` header
2. **Workspace isolation**: Templates scoped to workspaces
3. **CORS restrictions**: Allow only TinyCommand AI's domain

### Embeddable Builder Changes

1. **Add `/embed` route** — Editor without navbar, streamlined for embedding
2. **Implement postMessage API**:

```typescript
// Host → Editor messages
interface LoadTemplateMessage {
  type: 'TINY_EMAIL_LOAD_TEMPLATE';
  template: TEditorConfiguration;
}

interface GetTemplateMessage {
  type: 'TINY_EMAIL_GET_TEMPLATE';
  requestId: string;
}

interface SetVariablesMessage {
  type: 'TINY_EMAIL_SET_VARIABLES';
  variables: Record<string, string>;
}

// Editor → Host messages
interface TemplateChangedMessage {
  type: 'TINY_EMAIL_TEMPLATE_CHANGED';
  template: TEditorConfiguration;
}

interface TemplateResponseMessage {
  type: 'TINY_EMAIL_TEMPLATE_RESPONSE';
  requestId: string;
  template: TEditorConfiguration;
  html: string;
}

interface EditorReadyMessage {
  type: 'TINY_EMAIL_EDITOR_READY';
}
```

3. **URL parameters for configuration**:
   - `?mode=embed` — Hide navigation chrome
   - `?template=<base64>` — Pre-load a template
   - `?theme=<config>` — Custom theming
   - `?readonly=true` — Preview-only mode

### AI Knowledge Base for TinyCommand AI

To build an embedding/knowledge base of TinyEmail capabilities, TinyCommand AI should index:

1. **This entire document** — Provides the complete schema reference
2. **The system prompt** (`server/ai/systemPrompt.ts`) — Contains the exact JSON format the AI should generate
3. **All block schemas** — The Zod schemas from each `block-*` package define valid configurations
4. **Sample templates** — The 9 pre-built templates demonstrate real-world patterns
5. **FontFamily mapping** — `packages/editor/src/constant/fontFamily.ts`

### Key Integration Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│  TinyCommand AI     │     │  TinyEmail           │
│                     │     │                      │
│  ┌───────────────┐  │     │  ┌────────────────┐  │
│  │ AI Agent      │──┼─────┼─►│ POST /api/chat │  │
│  │ (GPT-4o-mini) │  │     │  │ (template gen) │  │
│  └───────────────┘  │     │  └────────────────┘  │
│                     │     │                      │
│  ┌───────────────┐  │     │  ┌────────────────┐  │
│  │ Email Asset   │──┼─────┼─►│ Template CRUD  │  │
│  │ Builder       │  │     │  │ (needs new API)│  │
│  └───────────────┘  │     │  └────────────────┘  │
│                     │     │                      │
│  ┌───────────────┐  │     │  ┌────────────────┐  │
│  │ Workspace     │──┼─────┼─►│ Embedded Editor│  │
│  │ Canvas        │  │     │  │ (needs iframe  │  │
│  │ (GoJS)        │  │     │  │  + postMessage)│  │
│  └───────────────┘  │     │  └────────────────┘  │
│                     │     │                      │
│  ┌───────────────┐  │     │  ┌────────────────┐  │
│  │ Workflow      │──┼─────┼─►│ Render API     │  │
│  │ Engine        │  │     │  │ (HTML output   │  │
│  │               │  │     │  │  + variables)  │  │
│  └───────────────┘  │     │  └────────────────┘  │
└─────────────────────┘     └──────────────────────┘
```

### Summary of Integration Effort

| Area | Difficulty | Exists? | Notes |
|:---|:---|:---|:---|
| Template JSON generation via AI | Low | Yes | Use existing `/api/chat` endpoint |
| Template CRUD API | Medium | No | Need database + new endpoints |
| HTML rendering API | Low | Partially | `renderToStaticMarkup` exists, needs an endpoint |
| Embedded editor (iframe) | Medium | No | Need `/embed` route + postMessage API |
| Authentication | Medium | No | Need API key middleware |
| Sending infrastructure | High | No | Not in scope — use external provider |
| Contact management | High | No | Not in scope — TinyCommand AI provides this |
| Analytics/tracking | High | No | Not in scope — external provider handles this |
