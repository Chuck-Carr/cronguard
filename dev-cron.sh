#!/bin/bash

echo "🔄 Starting local cron simulator..."
echo "Checking monitors every 60 seconds"
echo "Press Ctrl+C to stop"
echo ""

while true; do
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Checking monitors..."
  curl -s -H "Authorization: Bearer replace-with-random-secret" \
    http://localhost:3000/api/cron/check-monitors | jq '.'
  echo ""
  sleep 60
done
