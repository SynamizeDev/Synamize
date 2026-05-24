export function splitIntoLines(el: HTMLElement, className = 'line') {
  const label = el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  el.setAttribute('aria-label', label);

  if (el.querySelector('br')) {
    const parts: string[] = [];
    el.childNodes.forEach((node) => {
      if (node.nodeName === 'BR') return;
      const t = node.textContent?.trim();
      if (t) parts.push(t);
    });
    el.textContent = '';
    parts.forEach((lineText) => appendLine(el, lineText, className));
    return;
  }

  el.textContent = '';
  const lines = label.split(/\n/).filter((l) => l.trim());

  if (lines.length <= 1) {
    const words = label.split(/\s+/);
    // Prefer natural phrase breaks for long headlines
    const breakAfter = Math.min(3, Math.max(2, Math.floor(words.length / 3)));
    const line1 = words.slice(0, breakAfter).join(' ');
    const line2 = words.slice(breakAfter, breakAfter + 3).join(' ');
    const line3 = words.slice(breakAfter + 3).join(' ');
    [line1, line2, line3].filter(Boolean).forEach((lineText) => appendLine(el, lineText, className));
    return;
  }

  lines.forEach((lineText) => appendLine(el, lineText, className));
}

function appendLine(el: HTMLElement, lineText: string, className: string) {
  const wrap = document.createElement('span');
  wrap.className = className;
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.display = 'block';
  wrap.style.overflow = 'hidden';

  const inner = document.createElement('span');
  inner.className = `${className}-inner`;
  inner.style.display = 'block';
  inner.textContent = lineText;
  wrap.appendChild(inner);
  el.appendChild(wrap);
}

export function splitIntoChars(el: HTMLElement, className = 'char') {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const frag = document.createDocumentFragment();

  [...text].forEach((char) => {
    const wrap = document.createElement('span');
    wrap.className = `${className}-wrap`;
    wrap.style.display = 'inline-block';
    wrap.style.overflow = 'hidden';
    wrap.setAttribute('aria-hidden', 'true');

    const span = document.createElement('span');
    span.className = className;
    span.style.display = 'inline-block';
    span.textContent = char === ' ' ? '\u00A0' : char;
    wrap.appendChild(span);
    frag.appendChild(wrap);
  });

  el.appendChild(frag);
}

export function splitIntoWords(el: HTMLElement, className = 'word') {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = text.split(/\s+/).filter(Boolean);
  const frag = document.createDocumentFragment();

  words.forEach((word, i) => {
    const wrap = document.createElement('span');
    wrap.className = className;
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.display = 'inline-block';
    wrap.style.overflow = 'hidden';
    wrap.style.verticalAlign = 'top';

    const inner = document.createElement('span');
    inner.className = `${className}-inner`;
    inner.style.display = 'inline-block';
    inner.textContent = word;
    wrap.appendChild(inner);
    frag.appendChild(wrap);

    if (i < words.length - 1) {
      const space = document.createElement('span');
      space.textContent = '\u00A0';
      space.setAttribute('aria-hidden', 'true');
      frag.appendChild(space);
    }
  });

  el.appendChild(frag);
}
