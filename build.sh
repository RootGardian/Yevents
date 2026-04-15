#!/bin/bash
# Exit on error
set -e

echo "--- BUILDING BACKEND ---"
cd ynov_events
npm install
npx prisma generate
cd ..

echo "--- BUILDING FRONTEND ---"
cd yevents
npm install
npm run build
cd ..

echo "--- PREPARING PRODUCTION ASSETS ---"
# Create public dir if not exists
mkdir -p ynov_events/public
# Copy frontend dist to backend public
cp -rv yevents/dist/* ynov_events/public/

echo "--- BUILD COMPLETE ---"
ls -la ynov_events/public/
