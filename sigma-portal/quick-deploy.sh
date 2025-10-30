#!/bin/bash

echo "🚀 Quick Deploying Sigma Portal..."

# Verify Firebase configuration
echo "🔧 Checking Firebase configuration..."
if grep -q "sigma-ebooks" dashboard-premium-fixed.html; then
    echo "✅ Firebase project matches: sigma-ebooks"
else
    echo "❌ Firebase project mismatch. Please update config."
    exit 1
fi

# Deploy to current dashboard
echo "📦 Updating dashboard..."
cp dashboard-premium-fixed.html dashboard.html

# Git deployment
echo "🔧 Deploying to GitHub..."
git add dashboard.html
git commit -m "FIX: Edit functionality + Firebase integration"
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your site: https://sigmamale738.github.io/sigma-portal/"
echo "🔥 Firebase: https://console.firebase.google.com/project/sigma-ebooks/overview"
