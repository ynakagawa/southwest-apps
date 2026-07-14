// AEM Edge Delivery Services block.
// Place this at blocks/ribbon/ribbon.js in your EDS project.
//
// Authoring: a "Ribbon" block with one row of two cells —
//   cell 1: an image (e.g. a credit card icon)
//   cell 2: rich text, e.g. "Earn 50,000 points + first checked bag is
//           free. [Learn more](https://...)"

export default function decorate(block) {
  const [row] = block.children;
  if (!row) return;

  const [iconCell, textCell] = row.children;

  const inner = document.createElement('div');
  inner.className = 'ribbon-inner';

  const icon = iconCell?.querySelector('img');
  if (icon) {
    icon.className = 'ribbon-icon';
    inner.append(icon);
  }

  if (textCell) {
    const text = document.createElement('div');
    text.className = 'ribbon-text';
    text.append(...textCell.childNodes);
    inner.append(text);
  }

  block.textContent = '';
  block.append(inner);
}
