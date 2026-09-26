#!/usr/bin/env bash
# Push the current HEAD (or a SHA) to GitHub main for mallareddy9032-cmd/nayisamakhya.
# Reads GITHUB_TOKEN from the environment or from gitignored .env.local — never commit the token.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

load_dotenv_local() {
  local f="$ROOT/.env.local"
  [[ -f "$f" ]] || return 0
  # Export only GITHUB_TOKEN / GH_TOKEN lines (do not source arbitrary shell).
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line//[[:space:]]/}" ]] && continue
    if [[ "$line" =~ ^(GITHUB_TOKEN|GH_TOKEN)=(.*)$ ]]; then
      key="${BASH_REMATCH[1]}"
      val="${BASH_REMATCH[2]}"
      val="${val%\"}"
      val="${val#\"}"
      val="${val%\'}"
      val="${val#\'}"
      export "$key=$val"
    fi
  done < "$f"
}

load_dotenv_local

TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
if [[ -z "$TOKEN" ]]; then
  echo "Missing GITHUB_TOKEN."
  echo "Add it as a Cloud Agent secret named GITHUB_TOKEN, or put it in .env.local (gitignored):"
  echo "  GITHUB_TOKEN=github_pat_..."
  echo "Fine-grained PAT needs Contents: Read and write on mallareddy9032-cmd/nayisamakhya."
  exit 1
fi

REF="${1:-HEAD}"
SHA="$(git rev-parse "$REF")"
SHORT="$(git rev-parse --short "$SHA")"

if ! git remote get-url github >/dev/null 2>&1; then
  git remote add github https://github.com/mallareddy9032-cmd/nayisamakhya.git
fi

ASKPASS="$(mktemp)"
trap 'rm -f "$ASKPASS"' EXIT
cat > "$ASKPASS" <<'EOF'
#!/bin/sh
case "$1" in
  *Username*) echo "x-access-token" ;;
  *Password*) echo "$GITHUB_TOKEN" ;;
  *) echo "" ;;
esac
EOF
chmod 700 "$ASKPASS"

export GITHUB_TOKEN="$TOKEN"
export GIT_ASKPASS="$ASKPASS"
export GIT_ASKPASS_REQUIRE=force
export GIT_TERMINAL_PROMPT=0

echo "Pushing $SHORT ($SHA) -> github main..."
git -c credential.helper= push github "$SHA:main"
echo "Done. Verify: https://github.com/mallareddy9032-cmd/nayisamakhya/commits/main"
