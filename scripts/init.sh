#!/bin/bash

set -e

GITHUB_USERNAME="Rentsendorj21b1num1021"
TEMPLATE_REPO="fastify-boilerplate"
PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "Хэрэглэх: ./scripts/init.sh <project-name>"
  exit 1
fi

echo "🚀 $PROJECT_NAME үүсгэж байна..."

# Template-с clone хийх
git clone https://github.com/$GITHUB_USERNAME/$TEMPLATE_REPO.git $PROJECT_NAME
cd $PROJECT_NAME

# Git түүхийг цэвэрлэх
rm -rf .git
git init
git branch -M main

# Package нэр солих
sed -i '' "s/fastify-mongo-boilerplate/$PROJECT_NAME/g" package.json

# .env үүсгэх
cp .env.example .env

# Dependency суулгах
npm install

echo ""
echo "✅ $PROJECT_NAME бэлэн боллоо!"
echo ""
echo "Дараагийн алхам:"
echo "  1. .env файлыг өөрийн утгаар бөглө"
echo "  2. cd $PROJECT_NAME"
echo "  3. npm run dev"
