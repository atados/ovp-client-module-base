# Get root dir
ROOT=$(node -e "process.stdout.write(require('path').resolve())")

# Generate pages if they don't exist
if [ ! -d "$ROOT/pages" ]; then
  yarn sync:pages
fi

# Generate css if it doesn't exist
if [ ! -d "$ROOT/public/generated/static" ]; then
  yarn sync:static
fi

# Generate css if it doesn't exist
if [ ! -d "$ROOT/public/generated/css" ]; then
  yarn css
fi

yarn next dev
