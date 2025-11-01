#!/bin/bash

# Blog Deployment Script
# Simple script to update files on GitHub

echo "================================"
echo "  Blog GitHub Deployment"
echo "================================"
echo ""

# Ask for commit message
read -p "What changes did you make? " commit_message

# Check if user provided a message
if [ -z "$commit_message" ]; then
    echo "❌ Error: Commit message cannot be empty!"
    exit 1
fi

echo ""
echo "📝 Commit message: $commit_message"
echo ""

# Stage all changes
echo "📦 Adding files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "$commit_message"

# Check if commit was successful
if [ $? -ne 0 ]; then
    echo "❌ Nothing to commit. No changes detected."
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

# Check if push was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your changes are being deployed."
    echo "📡 GitHub is rebuilding your blog..."
    echo "⏱️  This usually takes 1-2 minutes."
    echo ""
    echo "Your blog will be updated automatically!"
else
    echo "❌ Error: Failed to push to GitHub"
    exit 1
fi
