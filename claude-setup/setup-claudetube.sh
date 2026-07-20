#!/usr/bin/env bash
# setup-claudetube.sh — claudetube in JEDEM Repo einrichten.
# Ebene 1 (global, einmal): claudetube + ffmpeg installieren, falls noch nicht da.
# Ebene 2 (pro Repo): claudetube als MCP mit Projekt-Scope registrieren -> schreibt .mcp.json.
#
# Nutzung:  cd <dein-repo> && bash setup-claudetube.sh
set -euo pipefail

echo "==> [1/3] claudetube global sicherstellen"
if ! python3 -c "import claudetube" 2>/dev/null; then
  pip install "claudetube[mcp]"
else
  echo "    claudetube schon installiert – ok"
fi

echo "==> [2/3] ffmpeg sicherstellen"
if ! command -v ffmpeg >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then brew install ffmpeg
  elif command -v apt >/dev/null 2>&1; then sudo apt update && sudo apt install -y ffmpeg
  else echo "    !! ffmpeg fehlt und weder brew noch apt gefunden – bitte manuell installieren"; fi
else
  echo "    ffmpeg schon da – ok"
fi

echo "==> [3/3] claudetube in DIESEM Repo registrieren (Projekt-Scope -> .mcp.json)"
if [ ! -d .git ]; then
  echo "    !! Kein Git-Repo hier ($(pwd)). Trotzdem fortfahren? (schreibt .mcp.json ins aktuelle Verzeichnis)"
fi
if command -v claude >/dev/null 2>&1; then
  claude mcp add claudetube -s project -- claudetube-mcp || \
    echo "    (evtl. schon registriert – prüfe mit: claude mcp list)"
else
  echo "    'claude' CLI nicht gefunden – schreibe .mcp.json direkt"
  cat > .mcp.json <<'JSON'
{
  "mcpServers": {
    "claudetube": { "command": "claudetube-mcp", "args": [] }
  }
}
JSON
fi

echo
echo "FERTIG. In diesem Repo kannst du Claude Code jetzt sagen:"
echo '  "Fasse https://youtu.be/<ID> zusammen – alle Kernaussagen."'
echo "Vergiss nicht .mcp.json zu committen, damit das Repo es dauerhaft hat."
