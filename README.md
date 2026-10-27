# GitHub Portfolio Analyzer

**[Open the live app](https://romellbermundo.github.io/jquery-github-finder/)** · [Try an analysis of @romellbermundo](https://romellbermundo.github.io/jquery-github-finder/#romellbermundo)

A lightweight, mobile-first dashboard for exploring a developer's **public GitHub footprint** and finding practical ways to present their projects better. Enter any public GitHub username to see developer statistics, language signals, popular projects, and actionable portfolio recommendations.

> **Deployment note:** The GitHub Pages URL is the intended published address. If the website is unavailable or shows an older version, check [Settings → Pages](https://github.com/romellbermundo/jquery-github-finder/settings/pages) and select **Deploy from a branch → main → /(root)**. The live deployment has not been independently verified.

## What you'll see

### Developer at a glance
- Public repository count, followers and following
- Total stars and forks on original public repositories **included in the review**
- Archived repository count and original repositories reviewed
- Original repositories pushed to in the last 90 days

### Languages and technology signals
- Visual breakdown of **primary languages** across original public repositories, such as JavaScript, HTML, CSS, Python, and TypeScript when present
- Repository counts per language, not self-reported skills or proficiency ratings
- Top five most-starred original repositories

### Portfolio assessment
- Repositories with missing or short descriptions
- Projects without a listed homepage or demo URL
- Older projects that may deserve review
- Up to five projects prioritized by visible presentation gaps, each linking directly to GitHub
- Filter and sort repositories by presentation gaps, recent activity, stars, or name

## How to use

1. [Open the app](https://romellbermundo.github.io/jquery-github-finder/).
2. Enter a GitHub username, for example `romellbermundo`.
3. Select **Analyze portfolio**.
4. Read **Developer at a glance**, **Portfolio assessment**, and **Repository review**.
5. Open suggested repositories to decide what to document, showcase, maintain, or archive.

You can share a specific assessment using `#username` at the end of the app URL.

## What the analyzer can and cannot measure

| Available from public GitHub data | Not available or not assessed |
| --- | --- |
| Followers, following, public repository counts | How many people viewed someone else's GitHub profile |
| Stars and forks on reviewed public repositories | Private repositories and private activity |
| Primary language of each reviewed repository | Verified proficiency in a programming language |
| Last push date and archived/fork status | Code quality, tests, security, or actual README completeness |
| Listed project homepage URL | Whether a deployed demo works |

**Important:** This is a metadata-based portfolio review, **not** a developer ranking, code-quality score, or hiring recommendation. A repository's age, stars, or missing demo do not by themselves determine its value. Repository traffic statistics require appropriate authorization and are not exposed for arbitrary public profiles.

The app uses the unauthenticated GitHub REST API, requests up to **100 public repositories** per username, and is subject to GitHub's public API rate limits. For accounts with more than 100 repositories, aggregate stars, forks, and language counts are **partial**. The language chart counts only GitHub's *primary language* for each original repository, not every language used in its code.

## Technology

- HTML5, CSS3, vanilla JavaScript
- GitHub REST API
- Static deployment with GitHub Pages
- No jQuery, Bootstrap, API keys, authentication, or build tools required

## Run locally

Clone this repository and serve its root directory with any static web server, or open `index.html` in a browser. An internet connection is required to load public GitHub data.

## Version history

### v3.2.1 — README refresh (October 2026)
- Documented the Developer Intelligence dashboard, assessment sections, and usage steps.
- Added a clear feature/limitation table and deployment troubleshooting.
- Kept the live site link prominent.

### v3.2.0 — Developer intelligence
- Added public followers, following, repository counts, stars, forks, archived projects, and recent activity.
- Added a primary-language breakdown and most-starred original projects.
- Clarified that public profile visitor counts are unavailable.

### v3.1.0 — Visible assessment and priorities
- Added an explicit portfolio assessment and top-five repository improvement list.

### v3.0.0 — Portfolio Analyzer
- Repurposed GitHub Finder into a public portfolio presentation analyzer.

### v2.0.0 — Modern Finder
- Replaced jQuery with vanilla JavaScript and improved mobile responsiveness.

### v1.0.0 — Original jQuery Finder
- Initial GitHub profile and repository lookup.
