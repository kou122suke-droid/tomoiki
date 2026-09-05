#!/usr/bin/env sh
# Build a Netlify drag-and-drop ZIP from ./site
# Usage: ./make-zip.sh  ->  dist/tomoiki-site.zip
set -eu
root=$(cd "$(dirname "$0")" && pwd)
out="$root/dist/tomoiki-site.zip"
mkdir -p "$root/dist"
rm -f "$out"
cd "$root/site"
zip -r -q -X "$out" . -x '.DS_Store' -x '__MACOSX/*'
echo "created: $out"
