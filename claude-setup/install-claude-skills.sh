#!/usr/bin/env bash
# install-claude-skills.sh
# Richtet globale Claude-Code-Skills unter ~/.claude ein.
# Lokal auf deinem Mac ausführen:  bash install-claude-skills.sh
set -euo pipefail

SK="$HOME/.claude/skills"
SRC="$HOME/.claude/skill-sources"
mkdir -p "$SK" "$SRC"

echo "==> Klone Skill-Bibliotheken nach $SRC"
clone() { # repo-url  zielordner
  if [ -d "$SRC/$2/.git" ]; then (cd "$SRC/$2" && git pull --ff-only) ; else
    git clone --depth 1 "$1" "$SRC/$2"; fi
}
clone https://github.com/anthropics/skills.git                             anthropics-skills
clone https://github.com/ComposioHQ/awesome-claude-skills.git              awesome-claude-skills
clone https://github.com/alirezarezvani/claude-skills.git                  alirezarezvani-claude-skills
clone https://github.com/michalparkola/tapestry-skills-for-claude-code.git tapestry-skills
clone https://github.com/AgriciDaniel/claude-seo.git                       claude-seo

echo "==> Aktiviere Video-Skill (Transkript via yt-dlp)"
cp -r "$SRC/tapestry-skills/youtube-transcript" "$SK/youtube-transcript"
cp -r "$SRC/awesome-claude-skills/video-downloader" "$SK/video-downloader"

echo "==> Aktiviere claude-seo (25 SEO/AEO/GEO-Sub-Skills, 18 Agents) via eigenen Installer"
if [ -f "$SRC/claude-seo/install.sh" ]; then
  (cd "$SRC/claude-seo" && bash install.sh) || echo "    !! claude-seo install.sh fehlgeschlagen – manuell: cd $SRC/claude-seo && bash install.sh"
fi

echo "==> Aktiviere offizielle Anthropic-Skills"
for d in "$SRC/anthropics-skills/skills"/*/; do
  name=$(basename "$d")
  [ -f "$d/SKILL.md" ] && cp -r "$d" "$SK/$name"
done

echo "==> yt-dlp für den Video-Skill sicherstellen"
command -v yt-dlp >/dev/null 2>&1 || brew install yt-dlp || pip3 install yt-dlp

echo "==> Fertig. Aktive Skills:"
ls -1 "$SK"
echo
echo "Weitere ~700 Community-Skills liegen als Referenz unter:"
echo "  $SRC/alirezarezvani-claude-skills   (358 Skills, MIT)"
echo "  $SRC/awesome-claude-skills          (kuratierte 1000+ Liste)"
echo "Aktivieren = Ordner mit SKILL.md nach $SK/ kopieren."
