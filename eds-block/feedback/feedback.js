// AEM Edge Delivery Services block.
// Place this at blocks/feedback/feedback.js in your EDS project.
// Authoring: a block named "Feedback" (any content) renders the fixed
// feedback tab + panel. Since the tab is position: fixed inside the
// widget's own shadow root, this block's placement in the page doesn't
// matter — one instance anywhere on the page is enough.

const WIDGET_SCRIPT_URL = 'https://YOUR_CDN_OR_HOST/feedback-widget.js';

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
  const el = document.createElement('sw-feedback');
  block.appendChild(el);
}
