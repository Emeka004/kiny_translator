const targetSelect = document.getElementById('target-lang');
const translateBtn = document.getElementById('translate-btn');
const inputText = document.getElementById('input-text');
const translatedText = document.getElementById('translated-text');
const copyBtn = document.getElementById('copy-btn');
const swapBtn = document.getElementById('swap-btn');
const toggleBtn = document.getElementById('toggle-theme');

// Populate language options dynamically
const languages = {
  auto: 'Auto‑Detect',
  en: 'English',
  rw: 'Kinyarwanda',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  // ... you can fetch full list if self‑hosting LibreTranslate
};
for (const [code, name] of Object.entries(languages)) {
  if (code !== 'auto') {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = name;
    targetSelect.appendChild(opt);
  }
}
targetSelect.value = 'en';

// Translation function
translateBtn.addEventListener('click', async () => {
  const text = inputText.value.trim();
  if (!text) {
    translatedText.textContent = 'Please enter text.';
    return;
  }

  translatedText.textContent = 'Detecting & Translating…';

  try {
    const resp = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetSelect.value,
        format: 'text'
      })
    });
    if (!resp.ok) throw new Error(`Error ${resp.status}`);
    const data = await resp.json();
    translatedText.textContent = data.translatedText || '—';
  } catch (err) {
    console.error(err);
    translatedText.textContent = 'Translation failed.';
  }
});

// Clipboard copy
copyBtn.addEventListener('click', () => {
  const txt = translatedText.textContent;
  if (txt && txt !== '—') {
    navigator.clipboard.writeText(txt);
    copyBtn.textContent = '📋 Copied!';
    setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i>', 1200);
  }
});

// Swap target language to auto-detect into original?
swapBtn.addEventListener('click', () => {
  const current = targetSelect.value;
  const newTarget = prompt('Enter target language code (e.g. en, rw, fr…):', current);
  if (newTarget && languages[newTarget]) {
    targetSelect.value = newTarget;
  }
});

// Theme toggle logic
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleBtn.textContent = isDark ? '☀ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = '☀ Light Mode';
  } else {
    toggleBtn.textContent = '🌙 Dark Mode';
  }
});


