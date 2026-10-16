#!/usr/bin/env bash
# Sobe o site com um túnel público temporário (Cloudflare quick tunnel).
# Uso: ./tunnel.sh [up|url|down|logs]
set -euo pipefail
cd "$(dirname "$0")"

url() {
  for _ in $(seq 1 30); do
    u=$(docker compose logs tunnel 2>/dev/null | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | tail -1 || true)
    if [ -n "$u" ]; then echo "$u"; return 0; fi
    sleep 1
  done
  echo "URL ainda não disponível; veja: ./tunnel.sh logs" >&2
  return 1
}

case "${1:-up}" in
  up)
    docker compose up -d
    echo "Local:   http://localhost:${PORT:-8088}"
    echo -n "Público: "; url
    ;;
  url)  url ;;
  logs) docker compose logs -f tunnel ;;
  down) docker compose down ;;
  *) echo "Uso: $0 [up|url|down|logs]"; exit 1 ;;
esac
