const outputDiv = document.getElementById("output");
const spinner = document.getElementById("loadingSpinner");
const speakBtn = document.getElementById("speakBtn");

async function translateText() {
  const input = document.getElementById("inputText").value.trim();
  const direction = document.getElementById("direction").value;

  if (!input) {
    outputDiv.innerText = "Please enter text to translate.";
    return;
  }

  const [source, target] = direction.split("-");
  spinner.style.display = "inline";

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: input,
        source,
        target,
        format: "text"
      })
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    outputDiv.innerText = data.translatedText;
  } catch (error) {
    outputDiv.innerText = "Translation failed. Try again later.";
    console.error(error);
  } finally {
    spinner.style.display = "none";
  }
}

function speakText() {
  const msg = new SpeechSynthesisUtterance(outputDiv.innerText);
  msg.lang = document.getElementById("direction").value.endsWith("en") ? "en-US" : "rw";
  speechSynthesis.speak(msg);
}

// Theme toggle
const toggleBtn = document.getElementById("toggle-theme");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
