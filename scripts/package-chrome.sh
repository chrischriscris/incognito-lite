#!/bin/sh
set -eu

PACKAGE_DIR="dist/chrome/incognito-lite"
ZIP_FILE="dist/incognito-lite-chrome-1.0.0.zip"

rm -rf "$PACKAGE_DIR" "$ZIP_FILE"
mkdir -p "$PACKAGE_DIR"

cp manifest.chrome.json "$PACKAGE_DIR/manifest.json"
cp -R src icons README.md PRIVACY.md "$PACKAGE_DIR/"

(cd "$PACKAGE_DIR" && zip -r "../../../incognito-lite-chrome-1.0.0.zip" .)
mkdir -p dist
mv "incognito-lite-chrome-1.0.0.zip" "$ZIP_FILE"

echo "$ZIP_FILE"
