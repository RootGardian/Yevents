#!/bin/bash
set -e

echo "=== Installing backend dependencies ==="
cd ynov_events
npm install

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building frontend ==="
cd ../yevents
npm install
npm run build

echo "=== Copying frontend to backend ==="
cp -r dist ../ynov_events/public

echo "=== Build complete ==="
ls -la ../ynov_events/public/
