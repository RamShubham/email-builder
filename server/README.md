## Backend server (`server/`)

This folder contains the standalone backend for the email builder.

### Installation

From the `server/` directory:

- `npm install`

### Running in development

From the `server/` directory:

- `npm run dev`

This starts the Express server using `tsx` to run `index.ts` directly.

### Building and running in production

From the `server/` directory:

- `npm run build`
- `npm start`

This compiles the TypeScript sources into `dist/` and runs `dist/index.js`.

### Environment variables

The backend expects its environment variables to be available via a `.env` file in the `server/` directory (loaded through `dotenv/config`), including for example:

- `DATABASE_URL`
- `AI_INTEGRATIONS_OPENAI_API_KEY`
- `AI_INTEGRATIONS_OPENAI_BASE_URL`
- `TINYEMAIL_API_KEYS`

Create `server/.env` with the appropriate values for your environment.

