document.getElementById("translate-btn").addEventListener("click", async () => {
  const inputText = document.getElementById("input-text").value.trim();
  const sourceLang = document.getElementById("source-lang").value;
  const targetLang = document.getElementById("target-lang").value;
  const outputDiv = document.getElementById("output-text");

  if (!inputText) {
    outputDiv.textContent = "Please enter some text to translate.";
    return;
  }

  if (sourceLang === targetLang) {
    outputDiv.textContent = "Please choose different source and target languages.";
    return;
  }

  outputDiv.textContent = "Translating...";

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: inputText,
        source: sourceLang,
        target: targetLang,
        format: "text"
      }),
    });

    const data = await response.json();
    outputDiv.textContent = data.translatedText || "Translation failed.";
  } catch (error) {
    console.error(error);
    outputDiv.textContent = "Translation error. Please try again.";
  }
});

// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});





