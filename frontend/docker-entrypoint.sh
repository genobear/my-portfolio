#!/bin/sh
set -e

# Default API URL if not provided
API_URL="${API_URL:-http://localhost:8000}"

# Generate config.json with runtime values
cat > /usr/share/nginx/html/assets/config.json << EOF
{"apiUrl": "${API_URL}"}
EOF

echo "Generated config.json with API_URL: ${API_URL}"

# Execute the main command (nginx)
exec "$@"
