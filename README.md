# Flight Search MFE

A standalone React app that builds down to a single `<sw-flight-search>` Web
Component, so it can be dropped into an Adobe Edge Delivery Services (EDS)
site as a micro-frontend with no build-time coupling to the host page.

## Layout

- `flight-search-mfe/` — the React app. Builds to `dist/flight-search-widget.js`,
  a self-contained IIFE that defines the `<sw-flight-search>` custom element
  (React, ReactDOM, and CSS are all bundled in).
- `eds-block/` — example EDS blocks:
  - `flight-search.js` / `flight-search.css` — loads the built
    `flight-search-widget.js` script and mounts the `<sw-flight-search>`
    element. Copy into your EDS project at `blocks/flight-search/`.
  - `ribbon/ribbon.js` / `ribbon/ribbon.css` — a plain (non-React) block for
    a promo banner beneath the site header, e.g. "Earn 50,000 points + first
    checked bag is free. Learn more". Copy into `blocks/ribbon/`.

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

## Ribbon block

Unlike flight-search, the ribbon banner is static content (an icon, a
message, a link) with no interactivity, so it's a plain EDS block — no
React/Vite build needed.

Authors add a "Ribbon" block with one row of two cells: an image (e.g. a
credit card icon), and rich text containing the message with a link, e.g.
"Earn 50,000 points + first checked bag is free. \[Learn more\](https://...)".
`ribbon.js` moves that content into a `.ribbon-inner` wrapper for styling;
`ribbon.css` lays it out as a centered, full-width bar meant to sit directly
beneath the page header.
