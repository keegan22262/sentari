# Sentari Psychology — Website

A static site for Sentari Psychology (Dr. Amara Njoki), built as plain HTML/CSS/JS
pages plus one Vercel serverless function for the Emotion Check-In tool.

## Structure

```
sentari-psychology/
├── index.html              Homepage
├── about.html               About Dr. Amara
├── services.html             Services & fees
├── articles.html              Articles library
├── emotion-check-in.html        Free emotion reflection tool (text + 5-Q quiz)
├── contact.html                 Booking form + FAQ + crisis resources
├── api/
│   └── analyze-emotion.js         Serverless proxy to the Anthropic API
├── vercel.json                      Clean URL config (/about instead of /about.html)
├── package.json
└── .gitignore
```

## Local preview

No build step needed. From the project folder, run any static server, e.g.:

```bash
npx serve .
```

Then open the printed local URL in your browser.

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts (link to a new project). It will give you a `*.vercel.app` preview URL.

### Option B — Vercel dashboard (recommended for ongoing updates)
1. Push this repo to GitHub (see below).
2. Go to vercel.com → **Add New... → Project** → import the GitHub repo.
3. Framework Preset: leave as **Other** (no build command needed).
4. Click **Deploy**.
5. Every future `git push` to `main` auto-deploys.

## Required: set your Anthropic API key

The Emotion Check-In page calls `/api/analyze-emotion`, a serverless function that
talks to the Anthropic API on the server side — your key is never exposed in the browser.

In the Vercel dashboard:
**Project → Settings → Environment Variables**
Add:
```
ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxx
```
(Get a key from https://console.anthropic.com — keep it secret, never commit it to git.)

Redeploy after adding the variable for it to take effect.

If the key isn't set, the tool still works using a graceful fallback reflection message,
so the site won't break — it just won't get real AI analysis until the key is added.

## Before buying the domain

1. Deploy to Vercel and get your `*.vercel.app` URL.
2. Click through every page and link on that live URL to confirm everything works.
3. Test the Emotion Check-In tool (both tabs) and the Contact form.
4. Once happy, buy the domain, then in Vercel: **Project → Settings → Domains** → add it
   and follow the DNS instructions given there.

## Contact form note

The contact form currently shows a local "thank you" message but does not send an email yet.
To receive real submissions, wire it up to a service like Formspree, or add another
serverless function (e.g. `/api/book-session.js`) that sends via an email API like Resend.

## Crisis resources

Crisis contact info (Befrienders Kenya: +254 722 178 177) appears in the footer disclaimer
on every page and prominently on the Contact and Emotion Check-In pages. Please verify this
number is correct and current before going live.
