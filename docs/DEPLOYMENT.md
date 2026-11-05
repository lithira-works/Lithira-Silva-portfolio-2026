# Deployment

The site builds to static files in `dist/`. Because it uses client-side routing, the host must serve
`index.html` for unknown paths.

## Vercel

1. Import the repository.
2. Framework preset: **Vite**. Build `npm run build`, output `dist`.
3. `vercel.json` in the repo already rewrites app routes to `/index.html` and sets the security headers.
4. In **Settings → Environment Variables**, add `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` and
   `VITE_EMAILJS_PUBLIC_KEY`. These three end up in the public JavaScript by design. Never add a secret with the
   `VITE_` prefix, and never add the EmailJS private key.

### Lock down EmailJS

The browser calls EmailJS directly, so these dashboard settings are the real protection for the form:

1. **Account → Security:** set **Allowed Origins** to the live site's address only, and set a rate limit.
2. **Account → Security:** keep **API access from non-browser applications** off.
3. **Email Templates:** paste the current `docs/email-templates/contact-auto-reply.html` over the old auto-reply.
   The old one repeats form text to any address someone types.
4. Turn the auto-reply off unless CAPTCHA is on. It still emails whatever address the form receives.

### Check after the first deploy

Run `curl -I https://<your-site>/` and confirm the `content-security-policy` and `strict-transport-security`
headers are there, then send one real message through the form.

## Netlify

1. Build `npm run build`, publish `dist`.
2. `public/_redirects` already contains `/* /index.html 200`.

## GitHub Pages

1. In `vite.config.ts` set `base: "/<repo-name>/"`.
2. Build, then publish `dist/` (for example with the `peaceiris/actions-gh-pages` action).
3. Copy `dist/index.html` to `dist/404.html` so deep links work.

## Checklist before going live

- [ ] Replace sample content in `src/data/` (see CONTENT.md)
- [ ] Replace `public/media/work/*` with real project screenshots
- [ ] Add `public/resume.pdf`
- [ ] Set `siteUrl` in `src/data/site.ts` and the `og:` tags in `index.html`
- [ ] Run `npm run build` with no errors
- [ ] Check the site on a phone
