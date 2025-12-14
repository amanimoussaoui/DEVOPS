#!/bin/sh

# Replace API URL in config.json if environment variable is set
if [ -n "$API_URL" ]; then
  echo "Setting API URL to: $API_URL"
  # Replace any existing API URL pattern in config.json
  sed -i "s|\"apiUrl\":[^,]*|\"apiUrl\": \"$API_URL\"|g" /usr/share/nginx/html/assets/config.json
fi

# Start nginx
exec nginx -g "daemon off;"

