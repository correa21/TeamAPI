#!/bin/bash

# Exit on error
set -e

echo "🐳 Testing Docker build and startup..."

# Build the image
echo "🔨 Building Docker image..."
docker build -t rugby-team-api-test .

# Run the container in detached mode
echo "🚀 Starting container..."
CONTAINER_ID=$(docker run -d -p 3001:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e SUPABASE_URL="https://example.supabase.co" \
  -e SUPABASE_ANON_KEY="dummy-key" \
  rugby-team-api-test)

# Wait for startup
echo "⏳ Waiting for application to start (10s)..."
sleep 10

# Check if container is running
if [ "$(docker ps -q -f id=$CONTAINER_ID)" ]; then
    echo "✅ Container is running!"
    
    # Optional: Check logs for errors
    docker logs $CONTAINER_ID
    
    # Cleanup
    echo "🧹 Cleaning up..."
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    echo "✨ Docker smoke test passed!"
    exit 0
else
    echo "❌ Container failed to start!"
    docker logs $CONTAINER_ID
    docker rm $CONTAINER_ID
    exit 1
fi
