# Deep Research: mvanhorn/last30days-skill

> Research Date: 2026-04-14
> Depth: Exhaustive | Strategy: Planning | Sources: 15+

---

## Executive Summary

**last30days-skill** is an AI agent skill that researches any topic across Reddit, X, YouTube, Hacker News, Polymarket, Bluesky, TikTok, Instagram, and the web, then synthesizes a grounded summary scored by real engagement metrics (upvotes, likes, prediction market odds). Created by **Matt Van Horn** (Lyft co-founder, June Oven co-founder/CEO), it has rapidly become one of the most popular Claude Code skills with **21,600+ GitHub stars** and **#1 GitHub Trending** status.

| Key Fact           | Value                       |
| ------------------ | --------------------------- |
| GitHub Stars       | 21,643                      |
| Current Version    | v3.0.0 (Apr 11, 2026)       |
| License            | MIT                         |
| Language           | Python 3.12+                |
| Runtime Dependency | `requests>=2.32` (only one) |
| Test Suite         | 1,012 tests across 64 files |
| Source Coverage    | 13+ platforms               |

---

## 1. What Problem It Solves

LLMs have a "recency gap" -- training data is months old, but many use cases require what people are saying **right now**. No single AI has access to all social platforms simultaneously:

- Google Search misses Reddit comments and X posts
- ChatGPT has Reddit but not X
- Gemini has YouTube but not Reddit

**last30days bridges these walled gardens** by letting users bring their own API keys and browser sessions, enabling an AI agent to search all platforms in parallel, score results by real engagement metrics, and synthesize a grounded narrative.

---

## 2. Source Coverage

### Zero-Config (No API Keys Required)

| Source                 | API         |
| ---------------------- | ----------- |
| Reddit (with comments) | Public JSON |
| Hacker News            | Algolia API |
| Polymarket             | Gamma API   |
| GitHub                 | `gh` CLI    |

### Key-Required Sources

| Source                                | Requirement            | Cost                     |
| ------------------------------------- | ---------------------- | ------------------------ |
| X / Twitter                           | Browser cookies        | Free                     |
| YouTube                               | `brew install yt-dlp`  | Free                     |
| Bluesky                               | App password           | Free                     |
| TikTok, Instagram, Threads, Pinterest | ScrapeCreators API key | 10,000 free calls        |
| Perplexity Sonar                      | OpenRouter API key     | Pay as you go            |
| Web search                            | Brave Search API key   | 2,000 free queries/month |

---

## 3. Technical Architecture

### v3 Pipeline (8 Stages)

```
1. Plan     -- LLM-first intent classification, subquery generation
2. Retrieve -- Parallel ThreadPoolExecutor across all (subquery, source) pairs
3. Normalize -- Convert raw responses to canonical SourceItem dataclass
4. Dedupe   -- Near-duplicate detection via text similarity + URL normalization
5. Snippet  -- Extract most informative excerpts
6. Fuse     -- Weighted Reciprocal Rank Fusion (RRF, k=60), per-author cap of 3
7. Rerank   -- Single LLM pass (Gemini -> OpenAI -> xAI -> deterministic fallback)
8. Cluster  -- Entity-based cross-source story merging -> Markdown/JSON output
```

### Scoring Formula

```
relevance 45% + recency 25% + engagement 30% (log1p dampening)
```

### Key Design Decisions

- **Single runtime dependency** (`requests>=2.32`) -- everything else is stdlib or vendored
- **Provider fallback chain**: Gemini -> OpenAI -> xAI -> local deterministic
- **Parallel execution**: `ThreadPoolExecutor` + `concurrent.futures.as_completed`
- **Data models**: Pure Python `dataclass` hierarchy (frozen immutables for value objects)
- **Fun judge**: Second parallel LLM judge scores humor/virality alongside relevance

### v3 Killer Feature: Intelligent Pre-Research

The `resolve.py` module performs entity resolution BEFORE the main search:

- Discovers relevant subreddits via web search
- Resolves X handles (person -> @handle, product -> @founder)
- Identifies YouTube channels and TikTok hashtags
- Bidirectional: person to company, product to founder, name to GitHub profile
- Example: "OpenClaw" -> resolves @steipete, r/openclaw, r/ClaudeCode

---

## 4. Installation Methods

| Method                 | Command                                                       |
| ---------------------- | ------------------------------------------------------------- |
| **Claude Code Plugin** | `/plugin marketplace add mvanhorn/last30days-skill`           |
| **OpenClaw**           | `clawhub install last30days-official`                         |
| **Gemini CLI**         | Clone locally, `gemini extensions install ./last30days-skill` |
| **Codex CLI**          | Auto-detection via `.agents/skills/last30days/SKILL.md`       |
| **skills.sh**          | `npx skills add mvanhorn/last30days-skill`                    |
| **Manual**             | `git clone` to `~/.claude/skills/last30days`                  |

---

## 5. Usage Examples

```bash
# Basic research
/last30days <topic>

# Quick mode (fewer sources, faster)
python3 scripts/last30days.py <topic> --quick

# Deep mode (maximum recall)
python3 scripts/last30days.py <topic> --deep

# Specific sources only
python3 scripts/last30days.py <topic> --search=reddit,x,grounding

# JSON output
python3 scripts/last30days.py <topic> --emit=json

# Diagnose setup
python3 scripts/last30days.py --diagnose
```

### Use Cases

| Use Case                 | Example                                       |
| ------------------------ | --------------------------------------------- |
| Pre-meeting intelligence | `/last30days Peter Steinberger`               |
| Current events           | `/last30days Kanye West`                      |
| Tool comparison          | `/last30days OpenClaw vs Hermes vs Paperclip` |
| Trend research           | `/last30days AI prompting techniques`         |
| Competitive intelligence | `/last30days [competitor name]`               |
| Prediction markets       | `/last30days Iran vs USA`                     |
| Sales prep               | `/last30days [target company]`                |

---

## 6. Community & Adoption

### GitHub Metrics

| Metric             | Value               |
| ------------------ | ------------------- |
| Stars              | 21,643              |
| Forks              | 1,766               |
| Open Issues        | 89                  |
| Contributors       | 20+                 |
| Releases           | 5 (v2.1.0 - v3.0.0) |
| skills.sh installs | 2,600+              |

### Notable Mentions

- **#1 Repository of the Day** on GitHub Trending
- "1,300 stars per day" growth rate at peak (Clauday)
- Featured in multiple "best skills" roundups (Firecrawl, Indie Hackers, Medium)
- Shared by Microsoft employee (Alvin Ashcraft) on LinkedIn
- Listed on 5+ skill registries (skills.sh, Shyft, SkillsIndex, CultOfClaude, MCPMarket)

### Media Coverage

| Source                   | Title                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------- |
| Medium (Francisco Perez) | "How 'Last 30 Days' Turns Claude Code Into a Research Superpower"                     |
| HowDoIUseAI              | "How to supercharge Claude Code with the Last 30 Days skill"                          |
| Firecrawl Blog           | "Best Claude Code Skills to Try in 2026" (featured)                                   |
| Medium (unicodeveloper)  | "10 Must-Have Skills for Claude (and Any Coding Agent) in 2026"                       |
| Indie Hackers            | "I tested 200 Claude Code skills... here are the 20 that actually changed how I work" |

### User Testimonials

> "I found a Claude Code skill that researches any topic across Reddit, X, YouTube, and HN from the last 30 days. Then writes the prompts for you. This eliminates it." -- @itsjasonai

> "This one skill replaced my entire research workflow." -- @itswilsoncharles

---

## 7. Author: Matt Van Horn

| Detail           | Information                                      |
| ---------------- | ------------------------------------------------ |
| Location         | Seattle, WA                                      |
| Education        | University of Arizona, Eller College (2002-2006) |
| GitHub followers | 953                                              |
| Public repos     | 511                                              |

### Career

1. **Zimride / Lyft** (co-founder) -- Co-founded with Logan Green. Became Lyft ($15B+ company)
2. **Digg** -- Partnerships
3. **Path** -- VP of Business
4. **June Oven** (co-founder & CEO) -- "Self-driving oven" using camera-based food ID. Raised $29.5M. Acquired by Weber
5. **last30days-skill** -- Current project. Built with AI assistance (Claude Opus 4.5/4.6 co-authored)

---

## 8. Comparison with Alternatives

| Tool           | Source Coverage      | Strength                                  | Weakness vs last30days    |
| -------------- | -------------------- | ----------------------------------------- | ------------------------- |
| **last30days** | 13+ social platforms | Widest source coverage, engagement-scored | API key sprawl            |
| **Perplexity** | Web + academic       | Broader web search                        | No social media depth     |
| **Tavily**     | Web + extraction     | Better for academic deep dives            | No social platform access |
| **Exa**        | Web, code, companies | Stronger semantic matching                | Weaker social coverage    |
| **Firecrawl**  | Any URL              | Raw scraping power                        | Not social-media-focused  |

### Unique Differentiators

1. No other tool searches 13+ social platforms simultaneously
2. Engagement-scored synthesis (upvotes, likes, prediction market odds)
3. Entity-aware pre-research (auto-resolves handles, subreddits, hashtags)
4. Cross-source cluster merging (same story on Reddit + X + YouTube = one cluster)
5. Prediction market integration (Polymarket odds backed by real money)

---

## 9. Strengths & Weaknesses

### Strengths

1. **Unmatched source breadth** -- 13+ platforms, more than any single tool
2. **Production-quality engineering** -- 1,012 tests, modular architecture, graceful fallbacks
3. **Pedigree** -- Lyft co-founder, not a weekend project
4. **Massive traction** -- 21K+ stars, #1 GitHub Trending
5. **Cross-agent compatibility** -- Claude Code, OpenClaw, Gemini CLI, Codex CLI
6. **Free tier is useful** -- Reddit, HN, Polymarket, GitHub require zero config
7. **MIT licensed, privacy-respecting** -- No tracking, research stays local

### Weaknesses

1. **API key sprawl** -- Full coverage requires multiple keys + browser cookies
2. **Installation fragility** -- Active issues with Claude Code plugin loading (#239, #240)
3. **Python 3.12+ only** -- Excludes users on older Python versions
4. **Third-party dependency risk** -- ScrapeCreators is a paid service (4+ sources depend on it)
5. **X search fragility** -- Cookie-based auth is inherently brittle
6. **Security score 3/5** -- Executes code, extracts browser cookies, many external API calls
7. **89 open issues** -- Maintenance struggling to keep up with growth
8. **Gemini CLI broken** -- Upstream bug (#11452) requires manual clone

---

## 10. Version History

| Version | Date         | Highlights                                                    |
| ------- | ------------ | ------------------------------------------------------------- |
| v3.0.0  | Apr 11, 2026 | Intelligent pre-research, fun judge, 13+ sources, 1,012 tests |
| v2.9.0  | Mar 6, 2026  | ScrapeCreators Reddit, smart subreddit discovery              |
| v2.8.0  | Mar 4, 2026  | Instagram Reels, ScrapeCreators integration                   |
| v2.6.0  | Mar 3, 2026  | Hacker News, Polymarket, X handle resolution                  |
| v2.1.0  | Feb 17, 2026 | Watchlists (SQLite), YouTube transcripts, Codex CLI           |
| v1.0    | Jan 23, 2026 | Initial: Reddit + X, 87 tests                                 |

---

## 11. Verdict

### SkillsIndex.dev Score: 79/100 (Good)

| Category    | Score |
| ----------- | ----- |
| Security    | 3/5   |
| Utility     | 4/5   |
| Maintenance | 5/5   |
| Uniqueness  | 4/5   |

### Should You Install It?

**Yes, if** you regularly need to research current topics, people, or products and want multi-platform synthesis without manual tab-switching.

**Wait, if** you're concerned about API key management complexity, Python 3.12+ requirement, or the security implications of cookie extraction.

**Skip, if** you only need web search (Perplexity/Tavily are simpler) or your research is purely academic/historical (not recency-focused).

---

## Sources

- https://github.com/mvanhorn/last30days-skill
- https://skills.sh/mvanhorn/last30days-skill
- https://skillsindex.dev/tools/mvanhorn-last30days-skill/
- https://shyft.ai/skills/last30days-skill
- https://cultofclaude.com/skills/last30days-skill/
- https://mcpmarket.com/tools/skills/recent-topic-research-sentiment
- https://clauday.com/article/afe47239-69d2-4e54-8ee9-d2a1d9075d14
- https://en.wikipedia.org/wiki/Matt_Van_Horn
- https://medium.com/@francofuji/how-last-30-days-turns-claude-code-into-a-research-superpower-de2b8806170f
- https://howdoiuseai.com/blog/2026-02-06-how-to-supercharge-claude-code-with-the-last-30-da
- https://www.firecrawl.dev/blog/best-claude-code-skills
