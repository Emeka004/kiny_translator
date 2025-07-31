# Use official nginx image to serve static content
FROM nginx:alpine

# Copy custom HTML/CSS/JS into the nginx public directory
COPY ./app /usr/share/nginx/html

# Expose the default nginx port
EXPOSE 80


