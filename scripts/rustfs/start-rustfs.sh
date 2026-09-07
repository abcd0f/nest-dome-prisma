#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/scripts/rustfs/docker-compose.yml"
ENVIRONMENT="${NODE_ENV:-development}"

usage() {
  cat <<'EOF'
Usage: start-rustfs.sh [options] [docker compose arguments]

Options:
  -e, --environment NAME  Read .env.NAME from the repository root
  -h, --help              Show this help

Examples:
  ./start-rustfs.sh up -d
  ./start-rustfs.sh --environment production up -d
  NODE_ENV=development ./start-rustfs.sh logs -f rustfs
EOF
}

COMPOSE_ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    -e|--environment)
      if [[ $# -lt 2 ]]; then
        echo "Missing environment name after $1" >&2
        usage >&2
        exit 2
      fi
      ENVIRONMENT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      COMPOSE_ARGS+=("$1")
      shift
      ;;
  esac
done

ENV_FILE="$ROOT_DIR/.env.$ENVIRONMENT"

if [[ ! -f "$ENV_FILE" ]]; then
  ENV_FILE="$ROOT_DIR/.env"
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Root environment file not found: $ENV_FILE" >&2
  exit 1
fi

if [[ ${#COMPOSE_ARGS[@]} -eq 0 ]]; then
  COMPOSE_ARGS=(up -d)
fi

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "${COMPOSE_ARGS[@]}"
