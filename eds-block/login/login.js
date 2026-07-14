// AEM Edge Delivery Services block.
// Place this at blocks/login/login.js in your EDS project.
// Authoring: a block named "Login" (any content) renders the Log in
// button + popover in its place.

const WIDGET_SCRIPT_URL = 'https://YOUR_CDN_OR_HOST/login-widget.js';

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
  const el = document.createElement('sw-login');
  block.appendChild(el);
}
