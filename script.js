const targetSelect = document.getElementById('target-lang');
const translateBtn = document.getElementById('translate-btn');
const inputText = document.getElementById('input-text');
const translatedText = document.getElementById('translated-text');
const copyBtn = document.getElementById('copy-btn');
const toggleBtn = document.getElementById('toggle-theme');

async function fetchLanguages() {
  try {
    const response = await fetch('https://libretranslate.de/languages');
    if (!response.ok) throw new Error('Failed to fetch languages');
    const languages = await response.json();

    // Clear and add options to dropdown
    targetSelect.innerHTML = '';
    languages.forEach(lang => {
      // lang has { code: 'en', name: 'English' }
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.name;
      targetSelect.appendChild(option);
    });

    // Default target language
    targetSelect.value = 'en';
  } catch (err) {
    console.error(err);
    // Fallback static list if API fails
    const fallback = [
      { code: 'en', name: 'English' },
      { code: 'rw', name: 'Kinyarwanda' },
      { code: 'fr', name: 'French' },
      { code: 'es', name: 'Spanish' },
    ];
    fallback.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.name;
      targetSelect.appendChild(option);
    });
    targetSelect.value = 'en';
  }
}

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetSelect.value,
        format: 'text'
      }),
    });

    if (!resp.ok) throw new Error(`Error ${resp.status}`);

    const data = await resp.json();
    translatedText.textContent = data.translatedText || '—';
  } catch (err) {
    console.error(err);
    translatedText.textContent = 'Translation failed.';
  }
});

copyBtn.addEventListener('click', () => {
  const txt = translatedText.textContent;
  if (txt && txt !== '—') {
    navigator.clipboard.writeText(txt);
    copyBtn.textContent = '📋 Copied!';
    setTimeout(() => (copyBtn.innerHTML = '<i class="fas fa-copy"></i>'), 1200);
  }
});

// Dark/light mode toggle (same as before)
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

  // Fetch languages on load
  fetchLanguages();
});
function speakText(text, lang = 'en-US') {
  if (!window.speechSynthesis) {
    alert('Speech synthesis not supported');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}



