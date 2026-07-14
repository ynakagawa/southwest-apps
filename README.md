# Southwest MFEs

Standalone React apps that each build down to a single custom element (Web
Component), so they can be dropped into an Adobe Edge Delivery Services
(EDS) site as micro-frontends with no build-time coupling to the host page.

## Layout

- `flight-search-mfe/` — the flight search form. Builds to
  `dist/flight-search-widget.js`, a self-contained IIFE that defines the
  `<sw-flight-search>` custom element (React, ReactDOM, and CSS are all
  bundled in).
- `login-mfe/` — the "Log in" button + popover. Builds to
  `dist/login-widget.js`, defining the `<sw-login>` custom element the same
  way.
- `eds-block/` — example EDS blocks that load each built script and mount
  the corresponding element:
  - `flight-search.js` / `flight-search.css` → copy into `blocks/flight-search/`.
  - `login/login.js` / `login/login.css` → copy into `blocks/login/`.

Both apps share the same shape: `npm install && npm run build` in the
app's folder, `npm run dev` for local iteration, a `public/examples/embed-demo.html`
that loads the built script the way an EDS block would, a `public/index.html`
landing page for standalone deploys, and a `vercel.json` pinning the build
config for Vercel.

---

# Flight Search MFE

## Building the widget

```bash
cd flight-search-mfe
npm install
npm run build
```

Upload the resulting `dist/flight-search-widget.js` somewhere the EDS site
can fetch it (your EDS repo's own static assets, a CDN, etc.), then update
`WIDGET_SCRIPT_URL` in `eds-block/flight-search.js` to point at it.

## Local dev

```bash
cd flight-search-mfe
npm install
npm run dev
```

This serves `index.html`, which mounts `<sw-flight-search>` directly, so you
can iterate on the form without an EDS page.

## Example / embed demo page

`public/examples/embed-demo.html` loads the built `flight-search-widget.js`
the same way an EDS block would (a plain `<script>` tag) and mounts
`<sw-flight-search>` on a bare page — useful for sanity-checking the built
bundle in isolation. After `npm run build`, it's copied to
`dist/examples/embed-demo.html`:

```bash
npm run build
npm run preview   # serves dist/ — open /examples/embed-demo.html
```

## How it works

- `src/FlightSearch.tsx` is the form itself: trip type, depart/arrive,
  dates, passengers, promo code, fare display, and the low-fare-calendar
  checkbox — matching the southwest.com search module.
- `src/webcomponent.tsx` wraps it in a custom element with an attached
  shadow root, so the widget's styles can't leak into (or be broken by) the
  host EDS page, and vice versa.
- On submit, the widget builds a best-effort `southwest.com/air/booking/select.html`
  query string from the form fields and opens it in a new tab. Southwest has
  no public booking API, so this is a client-side redirect, not a live
  search — double check the query params against southwest.com if exact
  parity matters.

## Deploying the demo (e.g. Vercel)

The site is a plain static build, so any static host works. For Vercel,
since the app lives in the `flight-search-mfe/` subfolder of this repo:

- **Root Directory** (Project Settings → General): `flight-search-mfe` —
  required, since `vercel.json` and `package.json` live there, not at the
  repo root.
- **Framework Preset**: Vite (or Other). `flight-search-mfe/vercel.json`
  pins `buildCommand`/`outputDirectory` and sets `"framework": null` so
  Vercel won't auto-detect the wrong framework (e.g. Create React App,
  which would try to run `react-scripts build` and fail — this project has
  no CRA dependency at all).

`public/index.html` becomes the deployed root (`/`) with a description and a
link to `/examples/embed-demo.html`; `public/examples/embed-demo.html`
becomes the live demo; `flight-search-widget.js` is the bundle itself,
reachable at `/flight-search-widget.js` once deployed.

## Using it in an EDS document

Authors add a block named "Flight Search" (any single cell of content, e.g.
just the text "Flight Search") in a Google Doc / Word doc; EDS turns that
into a `<div class="flight-search block">` and `decorate()` in
`flight-search.js` replaces its contents with the widget.

---

# Login MFE

## Building the widget

```bash
cd login-mfe
npm install
npm run build
```

Upload the resulting `dist/login-widget.js` somewhere the EDS site can
fetch it, then update `WIDGET_SCRIPT_URL` in `eds-block/login/login.js` to
point at it.

## Local dev

```bash
cd login-mfe
npm install
npm run dev
```

This serves `index.html`, which mounts `<sw-login>` directly (flush right,
like it would sit in a page header), so you can iterate on the button and
popover without an EDS page.

## Example / embed demo page

`public/examples/embed-demo.html` loads the built `login-widget.js` the
same way an EDS block would and mounts `<sw-login>` on a bare page. After
`npm run build`, it's copied to `dist/examples/embed-demo.html`:

```bash
npm run build
npm run preview   # serves dist/ — open /examples/embed-demo.html
```

## How it works

- `src/Login.tsx` renders a yellow "Log in" trigger button. Clicking it
  toggles a popover panel (account/username, password, remember me, plus
  "First time logging in?", "Forgot login?", "Forgot password?", and
  "Enroll Now" links) anchored below the button with a pointer arrow,
  matching the southwest.com header.
- The component owns its own open/close state: it closes on outside click
  (via a `pointerdown` listener) or Escape, so the host page doesn't need
  to manage visibility.
- `src/webcomponent.tsx` wraps it in a `<sw-login>` custom element with an
  attached shadow root, same isolation approach as `<sw-flight-search>`.
- On submit, it navigates to `https://www.southwest.com/login` (Southwest
  has no public auth API, so — like flight search — this is a redirect, not
  a live login). The "First time logging in?", "Forgot login?", "Forgot
  password?", and "Enroll Now" links point at best-effort southwest.com
  URLs; double check these against the real site before shipping.

## Deploying the demo (e.g. Vercel)

Same pattern as flight-search-mfe:

- **Root Directory**: `login-mfe`
- **Framework Preset**: Vite (or Other) — `login-mfe/vercel.json` pins the
  build command/output dir and sets `"framework": null`.

## Using it in an EDS document

Authors add a block named "Login" in a Google Doc / Word doc; EDS turns
that into a `<div class="login block">` and `decorate()` in `login.js`
replaces its contents with the widget. `login.css` right-aligns the block,
matching where "Log in" sits in the southwest.com header.
