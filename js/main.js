(() => {
'use strict';
const $ = id => document.getElementById(id);
const form = $('searchForm'), input = $('searchUser'), button = $('searchButton'), status = $('status'), output = $('profile');
let activeController, searchSequence = 0, repositories = [], visibleCount = 6, currentUser = '';
const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('error', error); };
const node = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined && text !== null) el.textContent = String(text); return el; };
const add = (parent, ...children) => { parent.append(...children); return parent; };
const link = (text, url, className = '') => { const a = node('a', className, text); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; };
const validUsername = value => /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(value) && !value.includes('--');
async function getJson(url, signal) {
  const response = await fetch(url, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) {
    if (response.status === 404) throw new Error('No GitHub user found with that username.');
    if (response.status === 403 || response.status === 429) throw new Error('GitHub API rate limit reached. Please wait a while and try again.');
    throw new Error('GitHub request failed (HTTP ' + response.status + ').');
  }
  return response.json();
}
function pill(label) { return node('span', 'pill', label); }
function renderProfile(user) {
  const card = node('article', 'card profile-card');
  const avatar = node('img', 'avatar'); avatar.src = user.avatar_url; avatar.alt = (user.name || user.login) + ' avatar'; avatar.loading = 'lazy'; avatar.referrerPolicy = 'no-referrer'; card.append(avatar);
  const details = node('div', 'profile-details');
  add(details, node('h2', '', user.name || user.login), node('p', 'username', '@' + user.login));
  if (user.bio) details.append(node('p', 'bio', user.bio));
  const metrics = node('div', 'meta');
  add(metrics, pill(user.public_repos + ' public repos'), pill(user.followers + ' followers'), pill(user.following + ' following'));
  details.append(metrics);
  const facts = node('div', 'details');
  if (user.location) facts.append(node('span', '', '⌖ ' + user.location));
  if (user.company) facts.append(node('span', '', '◈ ' + user.company));
  if (user.created_at) facts.append(node('span', '', 'Joined ' + new Date(user.created_at).toLocaleDateString(undefined, {year:'numeric',month:'short'})));
  if (user.blog) { try { const url = new URL(user.blog.startsWith('http') ? user.blog : 'https://' + user.blog); if (['http:', 'https:'].includes(url.protocol)) facts.append(link(url.hostname, url.href)); } catch {} }
  details.append(facts, link('View GitHub profile ↗', user.html_url, 'primary-link'));
  card.append(details); return card;
}
function renderRepos() {
  const list = $('repoList'); if (!list) return;
  const query = $('repoFilter').value.trim().toLowerCase();
  const sort = $('repoSort').value;
  const filtered = repositories.filter(repo => (repo.name + ' ' + (repo.description || '')).toLowerCase().includes(query));
  filtered.sort((a,b) => sort === 'stars' ? b.stargazers_count - a.stargazers_count : sort === 'updated' ? new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0) : a.name.localeCompare(b.name));
  list.replaceChildren();
  for (const repo of filtered.slice(0, visibleCount)) {
    const card = node('article', 'repo');
    const title = node('h3'); title.append(link(repo.name, repo.html_url));
    add(card, title, node('p', '', repo.description || 'No description provided.'));
    const stats = node('div', 'repo-stats');
    add(stats, node('span', '', '★ ' + repo.stargazers_count), node('span', '', '⑂ ' + repo.forks_count));
    if (repo.language) stats.append(node('span', '', '● ' + repo.language));
    if (repo.fork) stats.append(node('span', '', 'Fork'));
    card.append(stats); list.append(card);
  }
  if (!filtered.length) list.append(node('p', 'empty', 'No matching public repositories.'));
  const more = $('loadMore'); more.hidden = filtered.length <= visibleCount;
  more.textContent = 'Show more (' + Math.max(0, filtered.length - visibleCount) + ' remaining)';
}
function render(user, repos) {
  output.replaceChildren(); output.hidden = false; output.append(renderProfile(user));
  const section = node('section', 'card');
  const heading = node('div', 'section-heading'); heading.append(node('h2', '', 'Public repositories'));
  const controls = node('div', 'repo-controls');
  const filter = node('input'); filter.id = 'repoFilter'; filter.type = 'search'; filter.placeholder = 'Filter repositories'; filter.setAttribute('aria-label', 'Filter repositories');
  const sort = node('select'); sort.id = 'repoSort'; sort.setAttribute('aria-label', 'Sort repositories');
  [['updated','Recently updated'],['stars','Most starred'],['name','Name A–Z']].forEach(([value,label]) => { const option = node('option','',label); option.value = value; sort.append(option); });
  controls.append(filter,sort); heading.append(controls);
  const list = node('div','repo-list'); list.id = 'repoList';
  const more = node('button','more','Show more'); more.id = 'loadMore'; more.type = 'button';
  section.append(heading,list,more); output.append(section);
  filter.addEventListener('input', () => { visibleCount = 6; renderRepos(); });
  sort.addEventListener('change', renderRepos);
  more.addEventListener('click', () => { visibleCount += 6; renderRepos(); });
  renderRepos();
}
async function search(username) {
  if (!validUsername(username)) { setStatus('Enter a valid GitHub username (letters, numbers, or single hyphens).',true); return; }
  if (activeController) activeController.abort();
  const controller = new AbortController(); activeController = controller; const sequence = ++searchSequence;
  button.disabled = true; output.hidden = true; output.replaceChildren(); setStatus('Looking up @' + username + '…');
  try {
    const user = await getJson('https://api.github.com/users/' + encodeURIComponent(username), controller.signal);
    // GitHub caps unauthenticated pagination; fetch up to 100 public repos in one request.
    const repos = await getJson('https://api.github.com/users/' + encodeURIComponent(user.login) + '/repos?per_page=100&sort=updated&type=owner', controller.signal);
    if (sequence !== searchSequence) return;
    repositories = repos; visibleCount = 6; currentUser = user.login;
    render(user,repos); setStatus('Showing @' + currentUser + ' · ' + repos.length + (user.public_repos > repos.length ? ' of ' + user.public_repos : '') + ' public repositories.');
    history.replaceState(null,'','#' + encodeURIComponent(user.login));
  } catch (error) {
    if (error.name === 'AbortError' || sequence !== searchSequence) return;
    setStatus(error.message || 'Unable to reach GitHub. Check your connection and try again.',true);
  } finally { if (sequence === searchSequence) button.disabled = false; }
}
form.addEventListener('submit', event => { event.preventDefault(); search(input.value.trim()); });
const initial = decodeURIComponent(location.hash.slice(1)).trim();
if (validUsername(initial)) { input.value = initial; search(initial); }
})();