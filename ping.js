name: Keep Render Service Awake
on:
  schedule:
    - cron: '*/8 * * * *'  # Every 8 minutes (extra safe)
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping multiple endpoints
        run: |
          RENDER_URL="https://godscent-fragrances.onrender.com"
          TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
          
          echo "🔔 Ping started at $TIMESTAMP"
          
          # Try multiple endpoints for reliability
          ENDPOINTS=("/health" "/api/perfumes" "/")
          
          for endpoint in "${ENDPOINTS[@]}"; do
            echo "Pinging: $endpoint"
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$RENDER_URL$endpoint")
            echo "Response: $STATUS"
            
            if [ "$STATUS" = "200" ]; then
              echo "✅ $endpoint: Success"
            else
              echo "⚠️ $endpoint: Failed (Status: $STATUS)"
            fi
            echo "---"
          done
          
          echo "🎯 Ping cycle completed"