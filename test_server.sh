#!/bin/bash
pkill -f "node dist/server.cjs" || true
pkill -f "tsx server.ts" || true
sleep 3
node dist/server.cjs > server.log 2>&1 &
PID=$!
sleep 5
curl -s http://localhost:3000/api/health
cat server.log
kill $PID || true
