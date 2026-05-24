#!/bin/sh
set -eu

ZIP_FILE="dist/incognito-lite-firefox-1.0.0.zip"

mkdir -p dist
rm -f "$ZIP_FILE"

zip -r "$ZIP_FILE" manifest.json src icons README.md PRIVACY.md amo-listing.md

echo "$ZIP_FILE"
