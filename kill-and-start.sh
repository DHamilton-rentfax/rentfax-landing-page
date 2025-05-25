#!/bin/bash

# Kill anything on ports 3000–3010
echo "🔪 Killing ports 3000–3010..."
for PORT in {3000..3010}
do
  PID=$(lsof -t -i:$PORT)
  if [ "$PID" ]; then
    kill -9 $PID
    echo "✅ Killed process on port $PORT"
  fi
done

# Start dev server in background
echo "🚀 Starting Next.js server..."
npm run dev &

# Wait a second then open browser
sleep 2
open http://localhost:3000
