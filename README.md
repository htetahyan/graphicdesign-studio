# Graphic Design Studio

An AI graphic design studio for creating and revising marketing designs in a chat session. Designers keep a brand kit, browse finished work in a gallery, and preview short video and ad reveals.

Live demo: [https://graphicdesign-app.vercel.app](https://graphicdesign-app.vercel.app)

## Stack

- Next.js and TypeScript
- Drizzle ORM for the database
- Supabase for storage
- Gemini and Vertex for generation
- Capacitor for Android and iOS wrappers

## Setup

Install dependencies:

```bash
npm install
```

Copy the environment variables into a local env file. `.env*` files are gitignored. Never commit secrets, passwords, keys, tokens, or connection strings.

The app expects these classes of variables, by name only:

- `DATABASE_URL` for the database
- `ADMIN_SECRET` for admin login (required; login fails closed when it is missing)
- `GEMINI_API_KEY`, or Vertex settings via `GOOGLE_CLOUD_PROJECT` / `VERTEX_PROJECT_ID` and `GOOGLE_CLOUD_LOCATION` / `VERTEX_LOCATION`
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for Supabase
- `SUPABASE_SERVICE_ROLE_KEY` for server-side storage access
- `SESSION_SECRET` for signed sessions

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Database helpers live in `package.json` under `db:generate`, `db:migrate`, and `db:push`. Capacitor helpers use the `cap:*` scripts. Do not commit `local.properties` or any other machine-local SDK config.
