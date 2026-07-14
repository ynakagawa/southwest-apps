// AEM Edge Delivery Services block.
// Place this at blocks/flight-search/flight-search.js in your EDS project.
// Authoring: a block named "Flight Search" (any content) renders this widget in its place.

const WIDGET_SCRIPT_URL = 'https://YOUR_CDN_OR_HOST/flight-search-widget.js';

let widgetLoadPromise;

function loadWidgetScript() {
  if (!widgetLoadPromise) {
    widgetLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = WIDGET_SCRIPT_URL;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return widgetLoadPromise;
}

export default async function decorate(block) {
  block.textContent = '';
  await loadWidgetScript();
  const el = document.createElement('sw-flight-search');
  block.appendChild(el);
}
