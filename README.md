# Kinyarwanda-English Translator 🇷🇼⇄🇺🇸

A professional web application for translating between Kinyarwanda and English, built with modern web technologies and containerized for scalable deployment.

## 🌟 Features

- **Bidirectional Translation**: Seamless translation between Kinyarwanda and English
- **Real-time API Integration**: Uses MyMemory Translation API with custom improvements
- **Responsive Design**: Mobile-first design optimized for all devices
- **Cultural Context**: Enhanced with Rwanda-specific phrases and expressions
- **Interactive Samples**: Click-to-try common Kinyarwanda phrases
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Character Limits**: Smart input validation and character counting
- **Professional UI**: Clean, modern interface with Rwanda-themed colors

## 🏗️ Architecture

### Frontend Stack
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **Vanilla JavaScript**: ES6+ with async/await and class-based architecture
- **API Integration**: RESTful API calls with error handling

### Project Structure
```
kiny_translator/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── script.js           # JavaScript logic and API integration
├── Dockerfile          # Container configuration
├── README.md           # This documentation
└── .gitignore          # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Docker (for containerization)
- Internet connection (for API calls)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kinyarwanda-translator
   ```

2. **Run locally with Python server**
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```

3. **Or use Node.js http-server**
   ```bash
   npx http-server -p 8080
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 🐳 Docker Deployment

### Building the Image

```bash
# Build the Docker image
docker build -t Emeka004/kiny_translator:v1 .

# Test locally
docker run -p 8080:80 Emeka004/kiny_translator:v1

# Verify it works
curl http://localhost:8080
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push the image
docker push Emeka004/kiny_translator:v1

# Tag as latest
docker tag Emeka004/kiny_translator:v1 Emeka004/kiny_translator:latest
docker push Emeka004/kiny_translator:latest
```

### Docker Hub Repository
- **Image Name**: `Emeka004/kiny_translator`
- **Available Tags**: `v1`, `latest`
- **Base Image**: `nginx:alpine` (lightweight, production-ready)
- **Exposed Port**: `80`

## 🔧 Multi-Server Deployment

### Deploy on Web Servers

**On Web01 and Web02:**
```bash
# SSH into each server
ssh user@web-01
ssh user@web-02

# Pull and run the image
docker pull Emeka004/kiny_translator:v1
docker run -d --name kinyarwanda-app --restart unless-stopped \
  -p 8080:80 Emeka004/kiny_translator:v1

# Verify each instance
curl http://localhost:8080
```

### Load Balancer Configuration

**HAProxy Configuration (`/etc/haproxy/haproxy.cfg`):**
```haproxy
global
    daemon

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend translator_frontend
    bind *:80
    default_backend translator_backend

backend translator_backend
    balance roundrobin
    option httpchk GET /
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

**Reload HAProxy:**
```bash
# Reload HAProxy configuration
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'

# Alternative: restart HAProxy container
docker restart lb-01
```

### Testing Load Balancing

```bash
# Test multiple requests to verify round-robin
for i in {1..10}; do
  curl -s http://localhost | grep -o "Web[0-9][0-9]" || echo "Request $i completed"
  sleep 1
done

# Check HAProxy stats (if enabled)
curl http://localhost:8404/stats
```

## 🔒 Security Considerations

### API Key Management
- **Current**: Uses free MyMemory API (no key required)
- **Production**: For Google Translate API, use environment variables:
  ```bash
  # Set environment variable
  export GOOGLE_TRANSLATE_API_KEY="your-api-key-here"
  
  # Run container with environment variable
  docker run -d --name translator-app \
    -e GOOGLE_TRANSLATE_API_KEY="your-api-key-here" \
    -p 8080:80 your-image:v1
  ```

### Security Headers
The Nginx configuration includes security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

## 📊 API Integration

### Primary API: MyMemory Translation
- **Endpoint**: `https://api.mymemory.translated.net/get`
- **Method**: GET
- **Rate Limit**: 1000 requests/day (free tier)
- **Languages**: Supports `rw` (Kinyarwanda) and `en` (English)

### Fallback Dictionary
Built-in dictionary for common phrases:
- Greetings: Muraho, Mwaramutse, Mwiriwe
- Courtesy: Murakoze, Nyabuneka, Mbabarira
- Basic conversations: Mumeze mute?, Ndabona neza

### Error Handling
- Network failures gracefully handled
- API rate limit protection
- Fallback to local dictionary
- User-friendly error messages

## 🧪 Testing

### Manual Testing Steps

1. **Basic Translation**
   - Enter "Muraho" → Should translate to "Hello"
   - Enter "Thank you" → Should translate to "Murakoze"

2. **Language Swapping**
   - Click swap button → Languages should switch
   - Previous translation should move to input

3. **Sample Phrases**
   - Click any sample phrase → Should auto-translate
   - Test both directions (RW→EN and EN→RW)

4. **Character Limits**
   - Enter 2000+ characters → Should show error
   - Character counter should update in real-time

5. **Load Balancer Testing**
   ```bash
   # Test from outside the network
   for i in {1..20}; do
     curl -s http://your-load-balancer-ip/ > /dev/null
     echo "Request $i completed"
   done
   ```

### Expected Results
- ✅ Translation works for common phrases
- ✅ UI responds correctly to all interactions
- ✅ Load balancer distributes traffic evenly
- ✅ Containers restart automatically if they crash
- ✅ Mobile interface works on phones/tablets

## 🛠️ Development

### Code Style
- **HTML**: Semantic markup, proper indentation
- **CSS**: BEM methodology, mobile-first approach
- **JavaScript**: ES6+, async/await, error handling

### Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Performance Optimizations
- Lightweight Alpine-based Docker image (~20MB)
- Minified CSS and optimized assets
- Efficient API call handling with debouncing
- Responsive images and fonts

## 🌍 Localization

### Supported Languages
- **Kinyarwanda** (`rw`): Native language of Rwanda
- **English** (`en`): International communication

### Cultural Considerations
- Respectful representation of Rwandan culture
- Proper context for cultural greetings
- Business and casual communication support

## 📈 Deployment Evidence

### Container Verification
```bash
# Verify containers are running
docker ps | grep kinyarwanda

# Check container logs
docker logs kinyarwanda-app

# Verify internal connectivity
docker exec -it web-01 curl http://localhost:8080
docker exec -it web-02 curl http://localhost:8080
```

### Load Balancer Verification
```bash
# Check HAProxy stats
echo "show stat" | socat stdio /var/run/haproxy/admin.sock

# Monitor traffic distribution
tail -f /var/log/haproxy.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MyMemory Translation API** for providing free translation services
- **Rwanda Development Board** for cultural consultation
- **Kinyarwanda language community** for phrase validation
- **Docker** and **Nginx** for reliable containerization



---

**Built with ❤️ for the Rwandan community and language learners worldwide.**





👨💻 Author

Built by Emeka Onugha

GitHub: github.com/Emeka004
