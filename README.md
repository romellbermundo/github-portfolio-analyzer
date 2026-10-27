# GitHub Portfolio Analyzer

**Live website (GitHub Pages):** https://romellbermundo.github.io/jquery-github-finder/

A lightweight, mobile-friendly review tool for a developer's public GitHub portfolio. Enter a username to see repository metadata, spot presentation gaps, and prioritize improvements.

## Features
- Profile summary, public repository inventory, and primary languages
- Counts of projects with weak descriptions and projects inactive for more than one year
- Per-repository suggestions for descriptions, demos, age, and forks
- Filter by repository name or description; sort by presentation gaps, activity, stars, or name
- Share a username-specific link using `#username`
- No jQuery, login, API token, or build step required

## Limitations and interpretation
**This is not a code-quality or employability score.** It does not inspect source code, README files, test coverage, screenshots, or deployed sites. It cannot determine whether a repository is safe to delete. An older project, a missing demo, or low stars are not necessarily weaknesses.

Uses the unauthenticated GitHub REST API and analyzes **up to 100 public repositories** per username. Private repositories are never visible. GitHub rate limits apply. Results may be incomplete for larger accounts. A listed homepage is treated as a potential demo, but not verified.

## Run locally
Serve this directory using a static server or open `index.html` in a browser. Internet access is required for GitHub API calls.

## Version history
### v3.1.0 — Visible assessment and priorities
- Made Portfolio assessment the first results panel, ahead of the profile.
- Added an explicit top-five repository improvement priority list with direct links.
- Clarified assessment-complete status and renamed the header to Portfolio Analyzer.

### v3.0.0 — Portfolio Analyzer (October 2026)
- Repurposed the original GitHub Finder into a public portfolio presentation analyzer.
- Added repository inventory, metadata-based insights, prioritized review, and honest limitations.
- Preserved the dependency-free, mobile-first design.

### v2.0.0 — Modern Finder
- Replaced jQuery with native JavaScript, added responsive search and safe DOM rendering.

### v1.0.0 — Original jQuery Finder
- Initial GitHub username and repository lookup.
