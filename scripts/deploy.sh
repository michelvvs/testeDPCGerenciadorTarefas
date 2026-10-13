#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

main() {
  cd "$APP_DIR"

  [ -f .env ] || { echo "ERRO: arquivo .env ausente em $APP_DIR"; exit 1; }

  local compose=(docker compose -f docker-compose.prod.yml)
  local mode
  if grep -qE '^EDGE_NETWORK=.+' .env; then
    compose+=(-f docker-compose.edge.yml)
    mode="proxy compartilhado"
  else
    compose+=(--profile standalone-proxy)
    mode="proxy próprio"
  fi

  echo "==> versão: $(git rev-parse --short HEAD) | modo: $mode"

  echo "==> validando a configuração"
  "${compose[@]}" config -q

  echo "==> construindo e atualizando os serviços"
  "${compose[@]}" up -d --build

  echo "==> verificando a API"
  local api_id before after status
  api_id="$("${compose[@]}" ps -q api)"
  [ -n "$api_id" ] || { echo "ERRO: contêiner da API não encontrado"; exit 1; }

  sleep 6
  before="$(docker inspect -f '{{.State.StartedAt}}' "$api_id")"
  sleep 6
  after="$(docker inspect -f '{{.State.StartedAt}}' "$api_id")"
  status="$(docker inspect -f '{{.State.Status}}' "$api_id")"

  if [ "$status" != "running" ] || [ "$before" != "$after" ]; then
    echo "ERRO: a API não ficou estável (estado: $status). Últimas linhas do log:"
    docker logs --tail 40 "$api_id" 2>&1 || true
    exit 1
  fi

  docker image prune -f >/dev/null 2>&1 || true
  echo "==> deploy concluído: $(git rev-parse --short HEAD)"
}

main "$@"
exit $?
