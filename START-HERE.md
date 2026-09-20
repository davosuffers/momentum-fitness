# Momentum — run it on your computer

This is the complete editable website project, including its images and working
lead form. It runs on Windows, macOS, and Linux.

## 1. Before you start

Install Node.js **22.13 or newer**, which includes npm. If Node.js is already
installed, check it with `node --version`. Internet access is needed for the
first dependency installation. No OpenAI key, paid API, or Cloudflare account
is needed to run the site locally.

Extract the entire ZIP. Open the `momentum-fitness` folder in VS Code, then
choose **Terminal → New Terminal**. The terminal should be inside the folder
that contains `package.json`. Do not open the source files by double-clicking
them in your browser.

## 2. Install and start

Run these commands one at a time:

```sh
npx pnpm@11.25.0 install --frozen-lockfile
npm run setup:local
npm run dev
```

If npx asks to install the pinned package manager, accept. The first command
installs the exact dependencies in the supplied lockfile. The setup command
builds the website and creates your local Leads table. It records completed
migrations, so running it again does not erase existing leads.

Open **http://localhost:5173** in your browser. If the terminal reports a
different port because 5173 is occupied, use the address it prints. Keep the
terminal running while using the website. Press **Ctrl+C** to stop it.

On Windows, if PowerShell blocks npm/npx scripts, select **Command Prompt** as
the VS Code terminal profile and run the same commands. You do not need to
change your computer's execution policy.

## 3. Start it again later

Open the same project folder and run:

```sh
npm run dev
```

You do not need to reinstall dependencies or rerun setup each time.

## 4. Form submissions

The form saves submissions to a **Leads** table in a local SQLite database.
Your local database is separate from the hosted website's database. The ZIP
contains no client submissions, account credentials, or API keys.

To see local submissions, open another terminal in the project folder and run:

```sh
npm run leads:local
```

Local database files live inside `.wrangler/state`. Keep that folder to retain
your submissions; back it up while the website is stopped. Do not publish or
share a copy containing real leads.

The form requests a call. It does not send email or reserve a calendar slot.
Follow up with the submitted email address to arrange the call.

## 5. Edit the website

| What to change | File or folder |
| --- | --- |
| Headline, agency name, sections, FAQ, form | `app/page.tsx` |
| Colors, typography, spacing, responsive layouts | `app/globals.css` |
| Browser title and description | `app/layout.tsx` |
| Fitness images | `public/images/` |
| Logo in browser tab | `public/favicon.svg` |
| Form validation and budget options | `lib/leads.ts` |
| Lead form endpoint | `app/api/leads/route.ts` |
| Leads table schema | `db/schema.ts` |

Save a file while `npm run dev` is running and the page updates. Photo paths
in `app/page.tsx` start with `/images/`, which maps to `public/images/`.

## 6. Check a production build locally

```sh
npm run build
npm start
```

Use the local address printed by the command. This does not publish anything
to the internet. Hosting this project on another service requires support for
Cloudflare Workers and D1, or a deliberate backend adaptation. Uploading only
the image files or opening an HTML file will not run the lead-saving endpoint.

## Technology

React, TypeScript, Vinext/Vite, Tailwind CSS, Radix UI, and a Cloudflare D1-compatible
SQLite database. The original package versions and pnpm lockfile are included.
The website source and assets can be edited without a ChatGPT subscription.
