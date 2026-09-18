#!/bin/bash
# ============================================================
# sync.sh
# Copies all client-facing files into www/ (the folder Capacitor
# wraps into the native Android/iOS app), then runs `cap sync`
# to push those changes into the native project.
#
# Run this every time you update any of your site's files and
# want that change to show up when you hit Run in Android Studio.
#
# Usage: ./sync.sh
# ============================================================

set -e  # stop immediately if any command fails, instead of continuing with a half-finished sync

echo "Copying HTML files..."
cp *.html www/

echo "Copying css/, js/, and icons/..."
cp -r css www/
cp -r js www/
cp -r icons www/

echo "Copying manifest.json and sw.js..."
cp manifest.json www/
cp sw.js www/

echo "Running cap sync..."
npx cap sync

echo ""
echo "✅ Synced! Now go click the green Run button in Android Studio."