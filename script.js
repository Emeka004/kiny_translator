document.getElementById('translate-btn').addEventListener('click', async () => {
  const inputText = document.getElementById('input-text').value.trim();
  const sourceLang = document.getElementById('source-lang').value;
  const targetLang = document.getElementById('target-lang').value;
  const translatedTextElem = document.getElementById('translated-text');

  if (!inputText) {
    translatedTextElem.textContent = 'Please enter text to translate.';
    return;
  }

  // Prevent translating into the same language
  if (sourceLang === targetLang) {
    translatedTextElem.textContent = 'Please choose different source and target languages.';
    return;
  }

  try {
    translatedTextElem.textContent = 'Translating...';

    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: inputText,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    translatedTextElem.textContent = data.translatedText || 'No translation received.';
  } catch (error) {
    console.error(error);
    translatedTextElem.textContent = 'Translation failed. Please try again later.';
  }
});

