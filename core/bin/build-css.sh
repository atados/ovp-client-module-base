#!/bin/bash

# Indicate to postcss.config.js that it should use tailwindcss plugin
export TAILWIND=true

# Get root dir
ROOT=$(node -e "process.stdout.write(require('path').resolve())")

# Generate a random name for the bundled css
FILENAME=$(date +%s).css


echo "> Removing last generated css"
yarn rimraf $ROOT/public/generated/css

echo "> Exporting app configuration to channel/generated/app.json"
yarn export:config

echo "> Building css bundle"
if [ -e $ROOT/channel/styles.css ]; then
  yarn postcss $ROOT/channel/styles.css -o $ROOT/public/generated/css/${FILENAME}
else
  yarn postcss $ROOT/base/styles.css -o $ROOT/public/generated/css/${FILENAME}
fi

echo "\"${FILENAME}\"" > $ROOT/public/generated/css/filename.json
echo "> Finished successfully"
