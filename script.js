// Translation logic
document.getElementById('translate-btn').addEventListener('click', async () => {
  const inputText = document.getElementById('input-text').value.trim();
  const sourceLang = document.getElementById('source-lang').value;
  const targetLang = document.getElementById('target-lang').value;
  const translatedTextElem = document.getElementById('translated-text');

  if (!inputText) {
    translatedTextElem.textContent = 'Please enter text to translate.';
    return;
  }

  if (sourceLang === targetLang) {
    translatedTextElem.textContent = 'Please choose different source and target languages.';
    return;
  }

  try {
    translatedTextElem.textContent = 'Translating...';

    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: inputText,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    translatedTextElem.textContent = data.translatedText || 'Translation unavailable.';
  } catch (error) {
    console.error(error);
    translatedTextElem.textContent = 'Translation failed. Try again later.';
  }
});

// Theme toggle logic
const toggleButton = document.getElementById('toggle-theme');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  const isDark = document.body.classList.contains('dark-mode');
  toggleButton.textContent = isDark ? '☀ Light Mode' : '🌙 Dark Mode';

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load theme preference
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleButton.textContent = '☀ Light Mode';
  } else {
    toggleButton.textContent = '🌙 Dark Mode';
  }
});




