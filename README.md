# GitHub Finder

**Live site:** [GitHub Pages](https://romellbermundo.github.io/jquery-github-finder/) *(works when GitHub Pages is enabled for the repository)*

A clean, responsive tool to discover GitHub users and explore their public repositories.

## Features
- Search by exact GitHub username, with profile avatar, biography, location, followers and public-repository counts.
- Browse public repositories with stars, forks, primary language, sorting, filtering, and incremental display.
- Handles missing users, GitHub API rate limits, network errors, and overlapping searches.
- Shareable profile links using `#username`.
- Mobile-first dark design, accessible labels, and safe DOM rendering without HTML injection.
- No jQuery, Bootstrap, build step, authentication, or embedded credentials.

## Run locally
Open `index.html` in a browser or serve the folder with any static HTTP server.

## How it works
Uses the public [GitHub REST API](https://docs.github.com/en/rest/users/users#get-a-user) and [repository endpoint](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user). Requests are unauthenticated and therefore subject to GitHub's public API rate limits. It fetches **up to 100** owned public repositories per user; this is not a complete list for accounts with more than 100 repositories. GitHub API and avatar images require an internet connection.

## Privacy
No passwords, GitHub tokens, or client secrets are requested or stored. Only publicly available GitHub information is displayed.

## Version history
### v2.0.0 — Modern rebuild (October 2026)
- Replaced the legacy jQuery/Ajax implementation with dependency-free JavaScript.
- Rebuilt responsive UI, profile rendering, repo discovery and filtering.
- Removed unsafe placeholder credentials and HTML interpolation of untrusted API fields.
- Added error handling, request cancellation, and shareable profile URLs.

### v1.0.0 — Original
- Basic jQuery GitHub user search and repository display.
