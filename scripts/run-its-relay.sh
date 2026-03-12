#!/bin/zsh
set -euo pipefail

REPO_DIR="/Users/hwi2/Desktop/PPP/JejuEye/web"
LOG_PREFIX="[mountaineyes-its-relay]"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

cd "$REPO_DIR"

if [ -f ".env" ]; then
  set -a
  . "./.env"
  set +a
fi

: "${ITS_RELAY_TARGET:=https://mountaineyes-proxy.onrender.com}"
: "${ITS_RELAY_INTERVAL:=30000}"

if [ -z "${ITS_RELAY_TOKEN:-}" ]; then
  echo "$LOG_PREFIX ITS_RELAY_TOKEN is missing in $REPO_DIR/.env" >&2
  exit 0
fi

export ITS_RELAY_TARGET
export ITS_RELAY_INTERVAL

exec /opt/homebrew/bin/npm run its-relay
