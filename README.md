# 🌍 Kinyarwanda ↔ English Translator App

A clean, responsive, and easy-to-use web application that translates between **Kinyarwanda** and **English**, powered by the [LibreTranslate API](https://libretranslate.com/). Built with modern HTML, CSS, and JavaScript and deployable via Docker containers behind an HAProxy load balancer.

---

## 🚀 Live Demo

> Once deployed, the app will be accessible at:

http://localhost:8080


---

## 🎯 Features

✅ Translate between Kinyarwanda and English  
✅ Text-to-Speech output for translated text  
✅ Beautiful glassmorphic UI with Dark/Light mode toggle  
✅ Responsive and mobile-friendly design  
✅ Dockerized and HAProxy-ready  
✅ No API key required (LibreTranslate public instance)  

---

## 📸 Screenshots

![Main UI Light Mode](screenshots/light-mode.png)  
![Main UI Dark Mode](screenshots/dark-mode.png)

---

## 🔧 Tech Stack

- HTML5 / CSS3 (Responsive UI)
- JavaScript (DOM, Fetch API, TTS)
- Docker (Nginx-based static site deployment)
- HAProxy (Round-robin load balancer)
- LibreTranslate API

---

## 🌐 API Used

**LibreTranslate**
- URL: `https://libretranslate.de/translate`
- Method: `POST`
- Request Example:
  ```json
  {
    "q": "Ndi kubona amazi",
    "source": "rw",
    "target": "en",
    "format": "text"
  }


🙏 Credits
LibreTranslate API

Nginx

Docker

HAProxy

Icons by Twemoji/Unicode Consortium

📜 License
This project is open source under the MIT License.

👨💻 Author
Built by Emeka Onugha
GitHub: github.com/Emeka004
