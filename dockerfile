# Use the official Nginx Alpine image for lightweight production deployment
FROM nginx:alpine

# Set maintainer information
LABEL maintainer="your-email@example.com"
LABEL description="Kinyarwanda-English Translator Web Application"
LABEL version="1.0"

# Create app directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy application files to the Nginx html directory
COPY index.html .
COPY style.css .
COPY script.js .

# Create custom Nginx configuration for security headers and SPA support
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Root directory
    root /usr/share/nginx/html;
    index index.html;
    
    # Handle static files with caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }
    
    # Main application route
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # CORS headers for API calls
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range" always;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Disable access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Set proper permissions
RUN chmod 644 /usr/share/nginx/html/*
RUN chmod 644 /etc/nginx/conf.d/default.conf

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G appgroup appuser

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Use non-root user (Note: Nginx still needs to run as root to bind to port 80)
# USER appuser

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]

