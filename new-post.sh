#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./new-post.sh <slug>"
  echo "Example: ./new-post.sh so101-imitation-learning"
  exit 1
fi

SLUG="$1"
DATE=$(date +%Y-%m-%d)
OUT="content/blog/${SLUG}.mdx"

if [ -f "$OUT" ]; then
  echo "Error: $OUT already exists"
  exit 1
fi

sed "s/YYYY-MM-DD/$DATE/g" content/blog/_template.mdx > "$OUT"

echo "Created: $OUT"
echo ""
echo "Next steps:"
echo "  1. Edit $OUT — fill in title, summary, tags, body"
echo "  2. Drop images in public/figures/"
echo "  3. Run: npm run dev  (preview at http://localhost:3000/blog/${SLUG})"
echo ""
echo "To add a project card, edit lib/projects.ts and add an entry with:"
echo "  blogSlug: '${SLUG}'"
