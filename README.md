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
- `feedback-mfe/` — the feedback tab + panel. Builds to
  `dist/feedback-widget.js`, defining the `<sw-feedback>` custom element
  the same way.
- `eds-block/` — example EDS blocks that load each built script and mount
  the corresponding element:
  - `flight-search.js` / `flight-search.css` → copy into `blocks/flight-search/`.
  - `login/login.js` / `login/login.css` → copy into `blocks/login/`.
  - `feedback/feedback.js` / `feedback/feedback.css` → copy into `blocks/feedback/`.

All three apps share the same shape: `npm install && npm run build` in the
app's folder, `npm run dev` for local iteration, a `public/examples/embed-demo.html`
that loads the built script the way an EDS block would, a `public/index.html`
landing page for standalone deploys, and a `vercel.json` pinning the build
config for Vercel.

## Combined example (all three MFEs together)

`examples/combined-demo.html` loads all three built bundles and arranges
them like the real southwest.com page — `<sw-login>` in the header (flush
right), `<sw-flight-search>` below, `<sw-feedback>` fixed to the left edge
— so you can see all three MFEs working side by side on one page. Build
all three apps first, then serve the repo root:

```bash
(cd flight-search-mfe && npm install && npm run build)
(cd login-mfe && npm install && npm run build)
(cd feedback-mfe && npm install && npm run build)
python3 -m http.server 8000   # from the repo root
# open http://localhost:8000/examples/combined-demo.html
```

`examples/combined-demo.html` itself references each app's `dist/` output
by relative path (`../login-mfe/dist/login-widget.js`, etc.), which is
fine for the local `python3 -m http.server` workflow above but doesn't
deploy as-is — those sibling folders aren't part of `examples/`'s own
build output.

To deploy the combined demo as its own Vercel project, `examples/` has its
own `package.json` + `build.mjs`: `npm run build` there builds all three
MFEs, copies their bundles into `examples/dist/`, and rewrites the HTML's
script paths to be flat (`./login-widget.js` etc.) so the result is a
fully self-contained static site:

```bash
cd examples
npm install   # no real deps, just enables `npm run build`
npm run build
npm run preview   # if you add a "preview" script, or just serve dist/ directly
```

For Vercel: **Root Directory** `examples`, **Framework Preset** Vite (or
Other) — `examples/vercel.json` pins `buildCommand`/`outputDirectory` and
sets `"framework": null`, same as the other three projects. Because
`build.mjs` runs `npm install && npm run build` inside
`../flight-search-mfe`, `../login-mfe`, and `../feedback-mfe` relative to
`examples/`, this only works when the whole repo is checked out (true for
a normal Vercel Git-connected project) — it won't work if `examples/` is
ever split into its own repo.

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

---

# Feedback MFE

## Building the widget

```bash
cd feedback-mfe
npm install
npm run build
```

Upload the resulting `dist/feedback-widget.js` somewhere the EDS site can
fetch it, then update `WIDGET_SCRIPT_URL` in `eds-block/feedback/feedback.js`
to point at it.

## Local dev

```bash
cd feedback-mfe
npm install
npm run dev
```

This serves `index.html`, which mounts `<sw-feedback>` directly. The tab is
`position: fixed` to the left edge of the viewport, so scroll/resize the
page to confirm it stays put.

## Example / embed demo page

`public/examples/embed-demo.html` loads the built `feedback-widget.js` the
same way an EDS block would and mounts `<sw-feedback>` on a bare page.
After `npm run build`, it's copied to `dist/examples/embed-demo.html`:

```bash
npm run build
npm run preview   # serves dist/ — open /examples/embed-demo.html
```

## How it works

- `src/Feedback.tsx` renders a vertical "Feedback" tab fixed to the left
  edge of the viewport. Clicking it opens a dimmed backdrop and a panel
  (Southwest header with a heart logo and close button, a goal dropdown,
  a Yes/No "accomplished your goal?" radio group, a comments textarea with
  a submission-policy link, a "Contact Us" link, and a "Send Feedback"
  button), matching the southwest.com feedback widget.
- `src/webcomponent.tsx` wraps it in a `<sw-feedback>` custom element with
  an attached shadow root, same isolation approach as the other two
  widgets. Because the tab and panel are `position: fixed` *inside* the
  shadow root, one `<sw-feedback>` instance anywhere on the page positions
  itself correctly regardless of where the EDS block sits in the page flow.
- Unlike flight-search/login, there's no southwest.com URL a feedback
  submission could sensibly redirect to — feedback text needs a real
  endpoint. Submitting logs the form payload to the console and shows a
  "Thanks for your feedback!" confirmation state; wire the optional
  `onSubmit` prop (or replace the `console.log` in `Feedback.tsx`) up to a
  real endpoint when you have one.

## Deploying the demo (e.g. Vercel)

Same pattern as the other two apps:

- **Root Directory**: `feedback-mfe`
- **Framework Preset**: Vite (or Other) — `feedback-mfe/vercel.json` pins
  the build command/output dir and sets `"framework": null`.

## Using it in an EDS document

Authors add a block named "Feedback" in a Google Doc / Word doc; EDS turns
that into a `<div class="feedback block">` and `decorate()` in
`feedback.js` replaces its contents with the widget. Since the tab/panel
are fixed-position inside the widget's own shadow root, `feedback.css` sets
`display: contents` on the block — its placement in the page doesn't
matter, and one instance anywhere is enough.
