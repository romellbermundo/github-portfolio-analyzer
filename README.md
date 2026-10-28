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

### v4.8.0 — Immediate five-second sweep
- Aurora Sweep now starts immediately and completes a full downward pass every five seconds.
- Removed staggered negative delays and idle portions of the animation so the first pass is predictable.
- Retained background-only animation, responsive layout and reduced-motion support.


### v4.7.0 — Original Aurora Sweep
- Removed the calculator-inspired animation entirely and introduced an original, gentle pale-white aurora sweep on information-card backgrounds.
- Animates only CSS background position: no overlays, pseudo-elements, clipping, content transforms, or stacking changes that caused previous mobile layout bugs.
- Preserves responsive layout, staggered timing and reduced-motion support.


### v4.6.0 — Emergency layout stability fix
- Removed the card animation layers after a mobile screenshot showed oversized empty areas and clipped content.
- Restored normal card positioning, overflow, and content stacking without changing the underlying dashboard layout or JavaScript.
- Animation is intentionally disabled pending a tested replacement.


### v4.5.0 — Nexus Calculator screen animation
- Replaced the prior buggy card scan with the actual `screen-breathe` and `screen-scan` animation patterns from `react-calculator/src/App.css`, adapted to the analyzer's cards.
- Fine horizontal monitor lines gently pulse while a low-contrast cyan-white light band descends every nine seconds.
- All statistics, text and charts stay still; responsive grids and reduced-motion support remain intact.


### v4.4.0 — Animation rebuilt from scratch
- Removed all prior experimental animation rules and conflicting overrides.
- Replaced them with one subtle, downward, white monitor-style scan on each outer information-card surface.
- Used transform-based animation rather than animating top position, to reduce layout work and visual glitches.
- Left all card contents and nested statistics static; respected reduced-motion preferences.
- Preserved existing responsive layout and follower directory.


### v4.3.0 — Monitor scan on information-card backgrounds
- Added a visible, slow, pale-white scan band that moves downward across each main card background.
- Kept all text, statistics, charts, and inner repository tiles static; the scan is behind card content.
- Staggered scans across cards and preserved reduced-motion accessibility.


### v4.2.0 — Living card surfaces
- Added slow, low-contrast teal/blue ambient gradients to the backgrounds of the main information cards.
- Kept all text, metrics, charts, and inner repository tiles static; no scanning streaks or number animations.
- Preserved the existing outer dashboard background and reduced-motion support.


### v4.1.0 — Calm information cards
- Removed scanning highlights and animations from statistics and information cards.
- Disabled card lifting and motion effects while preserving readable hover feedback on follower links.
- Retained the ambient animated background behind the dashboard.


### v4.0.0 — Animated dashboard canvas
- Added slow-moving teal and blue ambient lighting to the background behind the dashboard cards.
- Added a faint drifting light sweep through the results canvas, including behind Portfolio assessment.
- Kept card content stable and readable with translucent dark panel surfaces.
- Supports reduced-motion preferences and requires no new dependencies.


### v3.9.0 — Ambient intelligence visual refresh
- Added a slow luminous title gradient, subtle moving header signal and soft ambient lighting near the hero.
- Added low-intensity scanning highlights on metric cards, subtle hover lift and glow accents.
- Preserved the compact dashboard, typography, contrast, and mobile layout.
- Respects reduced-motion preferences and avoids distracting continuous motion in content.


### v3.8.0 — Compact follower directory
- Fixed missing follower-specific CSS that allowed profile photos to render oversized.
- Enforced two equal-width follower columns with small, circular, fixed-size avatars.
- Kept follower names readable and clickable for in-app portfolio assessments.
- Updated asset versions to help bypass stale caches.


### v3.7.0 — Navigate between follower assessments
- Clicking a follower now opens their assessment in the same dashboard instead of their external GitHub page.
- Each assessment prominently links to the subject's original GitHub profile.
- The followers panel still links to the complete GitHub followers directory.
- Added updated asset version identifiers to help bypass stale browser caches.


### v3.5.0 — Deployment diagnostics and legacy cleanup
- Added an on-page version indicator so the deployed release can be identified immediately.
- Added cache-busting version parameters to the active CSS and JavaScript links.
- Removed obsolete OAuth placeholder and unused legacy font files.
- GitHub Pages must publish from main / (root); repository commits alone do not confirm deployment.


### v3.4.0 — Compact dashboard layout
- Reduced oversized hero, search, card padding, and metric typography while keeping readable spacing.
- Added a responsive two-column dashboard layout and denser language/popular-project grids.
- Improved mobile density, repository cards, and above-the-fold information without removing metrics.


### v3.3.0 — Public professional profile and reach
- Added GitHub account age, public gists, forked repository count, location, company, public email, and website when supplied.
- Added LinkedIn links only when explicitly listed in GitHub public social accounts.
- Removed the profile visitors section.
- Kept followers, following, stars, forks, languages, and portfolio recommendations.
- No automated LinkedIn scraping or identity matching.


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
