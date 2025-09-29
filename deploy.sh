#!/bin/bash
# Deployment script for Netlify

echo "Building project for production..."
npm run build

echo "Build completed! Files are in dist/public/"
echo "Ready for Netlify deployment!"
echo ""
echo "Deployment steps:"
echo "1. Push your code to GitHub/GitLab"
echo "2. Connect repository to Netlify"
echo "3. Set build command: npm run build"
echo "4. Set publish directory: dist/public"
echo "5. Deploy!"
