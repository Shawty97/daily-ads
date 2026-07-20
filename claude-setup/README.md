# 📦 Claude Code Setup — Skills, Plugins & MCP (ZUM LOKALEN DOWNLOAD)

> **Zweck:** Dieses Verzeichnis ist Roberts versioniertes Claude-Code-Setup.
> Cloud-Sessions sind flüchtig (Container wird gelöscht) — **alles, was dauerhaft sein soll, liegt HIER im Repo.**
> Lokal einrichten = die Skripte unten einmal ausführen. Gleiches Muster für jedes weitere Repo (ADS, SEO, Hermes, JobPilot …).

---

## 🚀 Quick Start (lokal auf dem Mac)

```bash
# 1) EINMAL global: Skill-Bibliotheken + aktive Skills nach ~/.claude
bash claude-setup/install-claude-skills.sh

# 2) EINMAL global: claudetube (YouTube → Transkript + Zusammenfassung)
pip install "claudetube[mcp]"
brew install ffmpeg

# 3) PRO REPO: claudetube registrieren (schreibt .mcp.json)
cd <repo> && bash claude-setup/setup-claudetube.sh
```

Danach in Claude Code einfach:
> „Fasse https://youtu.be/… zusammen — Transkript + alle Kernaussagen."

---

## 📁 Was liegt wo

| Pfad | Was | Status |
|------|-----|--------|
| `.mcp.json` (Repo-Root) | claudetube MCP-Server, Projekt-Scope | ✅ versioniert |
| `.claude/skills/youtube-transcript/` | YouTube-Transkript-Skill (yt-dlp → VTT → Klartext) | ✅ versioniert |
| `.claude/skills/video-downloader/` | YouTube-Download-Skill (mp4/mp3, Qualität wählbar) | ✅ versioniert |
| `claude-setup/install-claude-skills.sh` | Klont die 4 Skill-Bibliotheken + aktiviert Skills global | ✅ versioniert |
| `claude-setup/setup-claudetube.sh` | claudetube pro Repo einrichten | ✅ versioniert |
| `~/.claude/skill-sources/` | Die 4 Bibliotheken (54+21+15 MB) | ⬇️ wird vom Skript geklont, NICHT im Repo |

**Warum die Bibliotheken nicht im Repo liegen:** ~90 MB Fremdcode gehören nicht in ein Business-Repo. Das Skript klont sie reproduzierbar von GitHub — gleiches Ergebnis, kein Ballast.

---

> 📥 **Link-Sammlung zum Verarbeiten:** siehe [`MEDIA-QUEUE.md`](./MEDIA-QUEUE.md) — alle YouTube/IG/LinkedIn-Links + Notizen, versioniert, mit lokalem Batch-Befehl.

## 📚 Die 5 Skill-Bibliotheken (Quellen)

| Repo | Inhalt | Vertrauen |
|------|--------|-----------|
| [anthropics/skills](https://github.com/anthropics/skills) | Offizielle Anthropic-Skills (docx, pptx, xlsx, pdf, design, mcp-builder …) | 🟢 offiziell |
| [michalparkola/tapestry-skills-for-claude-code](https://github.com/michalparkola/tapestry-skills-for-claude-code) | `youtube-transcript` u.a. | 🟡 Community |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Kuratierte Liste 1000+ Skills, `video-downloader` | 🟡 Community |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 358 Skills, 30+ Agents, 70+ Commands (MIT) | 🟡 Community — gezielt aktivieren, nicht blind alles |
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | **SEO+AEO+GEO-Suite:** 25 Sub-Skills (`seo`, `seo-audit`, `seo-geo`, `seo-schema`, `seo-local`, `seo-technical` …), 18 parallele Spezialisten-Agents, eigener Installer (MIT) | 🟡 Community — Roberts Kernstück für Landingpages/Blogs/Affiliates |

⚠️ **Sicherheitsregel:** Community-Skills sind ausführbare Fremd-Anweisungen. Nur gezielt aktivieren (Ordner nach `~/.claude/skills/` kopieren), nie hunderte blind scharf schalten.

---

## 🎬 Video-Pipeline („nie wieder Videos schauen")

| Tool | Was es macht | Wo |
|------|--------------|-----|
| **claudetube** (MCP) | Video laden → Whisper-Transkript → Frames on demand → Zusammenfassung. 1500+ Seiten (YouTube, TikTok, Vimeo …), Cache unter `~/.claudetube/` | `.mcp.json`, global via pip |
| **youtube-transcript** (Skill) | yt-dlp zieht Untertitel (manuell → auto → Whisper-Fallback), dedupliziert zu Klartext | `.claude/skills/` |
| **video-downloader** (Skill) | Video/Audio-Download (mp4/webm/mkv/mp3, Qualität wählbar) | `.claude/skills/` |

**Wichtig:** In Cloud-Sessions (claude.ai/code) ist YouTube durch die Netz-Allowlist geblockt → Video-Tools funktionieren nur **lokal**. In der Cloud: Transkript reinpasten, Claude fasst zusammen.

---

## 🗂️ Skill-Katalog

### A) In diesem Repo versioniert + über `install-claude-skills.sh` global aktiviert

**Video (2):** `youtube-transcript` · `video-downloader`

**Offizielle Anthropic-Skills (17):**

| Kategorie | Skills | Können |
|-----------|--------|--------|
| Dokumente | `docx` `pptx` `xlsx` `pdf` | Word/PowerPoint/Excel/PDF erstellen, lesen, editieren, mergen, Formulare, OCR |
| Schreiben | `doc-coauthoring` `internal-comms` | Specs/Proposals im Dialog; Status-Reports, Newsletter, FAQs |
| Design | `canvas-design` `algorithmic-art` `frontend-design` `theme-factory` `brand-guidelines` `slack-gif-creator` | Poster/PNG/PDF-Art, p5.js, UI-Design, 10 Artefakt-Themes, Branding, Slack-GIFs |
| Dev | `mcp-builder` `web-artifacts-builder` `webapp-testing` `claude-api` `skill-creator` | MCP-Server bauen, React/Tailwind-Artefakte, Playwright-Tests + Screenshots, API-Referenz, eigene Skills bauen |

### B) Bereits lokal auf Roberts Maschine (NICHT in diesem Repo — Quelle: lokales `~/.claude`)

> Katalog zur Orientierung. Diese Skills existieren lokal/in anderen Repos und müssen von dort gesichert werden, falls sie versioniert werden sollen.

| Kategorie | Skills |
|-----------|--------|
| 📈 SEO/AEO/GEO | `seo` `seo-2026` `seo-geo` `seo-audit` + Sub-Skills: `seo-ahrefs` `seo-bing` `seo-google` `seo-seranking` `seo-profound` `seo-dataforseo` `seo-firecrawl` `seo-cluster` `seo-content-brief` `seo-technical` `seo-schema` `seo-local` `seo-maps` `seo-sitemap` `seo-images` `seo-image-gen` `seo-drift` `seo-ecommerce` `seo-flow` `seo-sxo` `seo-unlighthouse` |
| 🎬 Content | `Media` (Diagrams, Mermaid, Remotion, Infografiken) · `video` (Veo, Runway, Kling, HeyGen, Synthesia, Pika) · `ContentAnalysis` (Transkripte/Knowledge aus YouTube & Podcasts) |
| 🎯 Outreach/Sales | `cold-email` `email-sequence` · 5-Stufen-System: `skill-1-prospector` `skill-2-outreach-writer` `skill-3-closer` `skill-4-reactivator` `skill-5-deal-tracker` · `linkedin-social` `sales-enablement` `ad-creative` `paid-ads` `revops` `referral-program` `churn-prevention` |
| 🧠 Agentic/Governance | `Agents` · GitNexus: `gitnexus-cli` `-debugging` `-exploring` `-impact-analysis` `-refactoring` · gstack: `gstack` `browse` `qa` `ship` `investigate` `health` `cso` `guard` `freeze` `autoplan` `plan-ceo-review` `plan-eng-review` `plan-design-review` `plan-devex-review` |

**Verwandte eigene Projekte/Repos:** JobPilot (`ai-job-search/`, `ai-jobsearch-company/`) · Hermes-Familie (`hermes-webui/`, `hermes-enterprise/`, `hermes-llm-router/`, `hermes-full/`, `hermes-minimal/`, `hermes-phase2-lean/`, `hermes-phase3-ultra-lean-staging/`, `hermes-backup/`) · ADS-Repo · SEO-Repo.

---

## 🔁 Neues Repo ausstatten (Copy-Paste-Rezept)

```bash
cd <neues-repo>
mkdir -p claude-setup
cp <pfad-zu>/realrise-academy/claude-setup/*.sh claude-setup/
bash claude-setup/setup-claudetube.sh     # schreibt .mcp.json
git add claude-setup .mcp.json && git commit -m "chore: add Claude Code setup (claudetube + skills)"
```

*Stand: 2026-07-20 — angelegt in Claude-Code-Cloud-Session, Branch `claude/claude-code-skills-repos-dsn5dw`.*
