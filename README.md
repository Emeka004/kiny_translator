# Kinyarwanda ↔ English Translator App

A simple web app that uses the LibreTranslate API to translate between Kinyarwanda and English.

## 🌐 Live Demo (via HAProxy Load Balancer)

Accessible at `http://<lb01-ip>:8080`

---

## 🔧 API Used

- LibreTranslate: https://libretranslate.com/docs/
- No API key required for public endpoint

---

## 🛠 How to Run Locally

### Build Docker Image
```bash
docker build -t your-dockerhub-username/kiny-translator:v1 .
