(() => {
'use strict';
const $ = id => document.getElementById(id);
const form = $('searchForm'), input = $('searchUser'), button = $('searchButton'), status = $('status'), output = $('profile');
let controller = null, requestId = 0, repositories = [], visibleCount = 8;
const el = (tag, cls = '', text = null) => { const n = document.createElement(tag); if(cls)n.className=cls; if(text!==null)n.textContent=String(text); return n; };
const append = (parent,...children) => { parent.append(...children); return parent; };
const link = (text,url,cls='') => {const n=el('a',cls,text);n.href=url;n.target='_blank';n.rel='noopener noreferrer';return n;};
const valid = s => /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(s) && !s.includes('--');
const say = (message,error=false) => {status.textContent=message;status.classList.toggle('error',error);};
async function api(url,signal){
 const r=await fetch(url,{signal,headers:{Accept:'application/vnd.github+json'}});
 if(!r.ok){if(r.status===404)throw Error('GitHub user not found.');if(r.status===403||r.status===429)throw Error('GitHub API rate limit reached. Try again later.');throw Error('GitHub request failed (HTTP '+r.status+').');}
 return r.json();
}
const daysSince = d => Math.max(0,Math.floor((Date.now()-new Date(d).getTime())/86400000));
const fmt = d => d?new Date(d).toLocaleDateString(undefined,{month:'short',year:'numeric'}):'Unknown';
function signals(r){
 const notes=[];
 if(!r.description || r.description.trim().length<25)notes.push('Add a clear, specific project description.');
 if(!r.homepage)notes.push('Add a live demo link if this project has one.');
 if(daysSince(r.pushed_at)>365)notes.push('Review whether this older project still represents your skills.');
 if(r.fork)notes.push('Clarify your original contributions to this fork.');
 if(!r.language)notes.push('Make the technology and purpose clear in the README.');
 return notes;
}
function summary(repos,user){
 const own=repos.filter(r=>!r.fork&&!r.archived);
 const stale=own.filter(r=>daysSince(r.pushed_at)>365);
 const missing=own.filter(r=>!r.description||r.description.trim().length<25);
 const noDemo=own.filter(r=>!r.homepage);
 const langs=new Map();
 for(const r of own){if(r.language)langs.set(r.language,(langs.get(r.language)||0)+1);}
 const sorted=[...langs].sort((a,b)=>b[1]-a[1]);
 const card=el('section','card');
 card.append(el('p','eyebrow','YOUR PORTFOLIO ASSESSMENT'),el('h2','','Portfolio assessment'));
 const metrics=el('div','analysis-summary');
 for(const [label,value] of [['Repositories reviewed',repos.length],['Active in past year',own.length-stale.length],['Need descriptions',missing.length],['Languages',langs.size]]){
  const box=el('div','metric');append(box,el('span','',label),el('strong','',value));metrics.append(box);
 }
 card.append(metrics);
 const p=el('p','explanation','Based on public GitHub repository metadata, not source-code inspection. Archived repositories and forks are excluded from presentation-gap counts. Recent activity means pushed within 365 days.');card.append(p);
 const insights=el('div','insight-list');
 const ideas=[];
 if(missing.length)ideas.push(missing.length+' original projects need stronger descriptions.');
 if(noDemo.length)ideas.push(noDemo.length+' original projects have no homepage/demo URL listed. Not every project needs a demo.');
 if(stale.length)ideas.push(stale.length+' original projects have not been pushed to in over a year. Review them before archiving; inactivity alone is not a flaw.');
 if(sorted.length)ideas.push('Most represented language: '+sorted[0][0]+' ('+sorted[0][1]+' repositories).');
 if(!ideas.length)ideas.push('No obvious metadata gaps found in the repositories reviewed. Consider adding screenshots, documentation and clear featured projects.');
 for(const idea of ideas)insights.append(el('div','insight',idea));
 card.append(el('h3','','Recommended next steps'),insights);
 const priorities=el('div','priority-panel');
 priorities.append(el('h3','','Where to focus first'));
 const ranked=[...own].map(r=>({r,notes:signals(r)})).filter(x=>x.notes.length).sort((a,b)=>b.notes.length-a.notes.length).slice(0,5);
 if(ranked.length){
  ranked.forEach((item,i)=>{
   const row=el('div','priority-item');
   const heading=el('strong','',String(i+1)+'. '+item.r.name);
   const action=el('p','',item.notes[0]);
   row.append(heading,action,link('Open repository ↗',item.r.html_url));priorities.append(row);
  });
 }else priorities.append(el('p','explanation','No obvious metadata issues in the reviewed original repositories. Consider improving screenshots, READMEs and project storytelling.'));
 card.append(priorities);
 if(user.public_repos>repos.length)card.append(el('p','explanation','GitHub reports '+user.public_repos+' public repositories; this review covers only '+repos.length+'. Findings are incomplete.'));
 return card;
}
function profile(user){
 const card=el('section','card profile-card');
 const avatar=el('img','avatar');avatar.src=user.avatar_url;avatar.alt=user.login+' avatar';avatar.loading='lazy';
 const d=el('div','profile-details');
 append(d,el('h2','',user.name||user.login),el('p','username','@'+user.login));
 if(user.bio)d.append(el('p','bio',user.bio));
 const meta=el('div','meta');for(const s of [user.public_repos+' public repos',user.followers+' followers'])meta.append(el('span','pill',s));
 append(d,meta,link('View GitHub profile ↗',user.html_url,'primary-link'));append(card,avatar,d);return card;
}
function renderRepos(){
 const target=$('repoList');if(!target)return;
 const q=$('repoFilter').value.trim().toLowerCase(),mode=$('repoSort').value;
 const filtered=repositories.filter(r=>(r.name+' '+(r.description||'')).toLowerCase().includes(q));
 filtered.sort((a,b)=>mode==='attention'?signals(b).length-signals(a).length:mode==='stars'?b.stargazers_count-a.stargazers_count:mode==='name'?a.name.localeCompare(b.name):new Date(b.pushed_at||0)-new Date(a.pushed_at||0));
 target.replaceChildren();
 for(const r of filtered.slice(0,visibleCount)){
  const card=el('article','repo');const title=el('h3');title.append(link(r.name,r.html_url));card.append(title);
  card.append(el('span','repo-tag',r.archived?'Archived':r.fork?'Fork':signals(r).length?'Review presentation':'Metadata looks complete'));
  card.append(el('p','',r.description||'No description provided.'));
  const stats=el('div','repo-stats');append(stats,el('span','','★ '+r.stargazers_count),el('span','','⑂ '+r.forks_count),el('span','',r.language||'Language unspecified'),el('span','','Updated '+fmt(r.pushed_at)));card.append(stats);
  const notes=signals(r);card.append(el('p','recommendation',notes.length?notes.slice(0,2).join(' '):'No obvious presentation gaps from available metadata.'));
  target.append(card);
 }
 if(!filtered.length)target.append(el('p','empty','No repositories match this filter.'));
 const more=$('loadMore');more.hidden=filtered.length<=visibleCount;more.textContent='Show more ('+Math.max(0,filtered.length-visibleCount)+' remaining)';
}
function render(user,repos){
 output.replaceChildren();output.hidden=false;repositories=repos;visibleCount=8;
 output.append(summary(repos,user),profile(user));
 const section=el('section','card');const head=el('div','section-heading');head.append(el('h2','','Repository review'));
 const controls=el('div','repo-controls');
 const filter=el('input');filter.id='repoFilter';filter.type='search';filter.placeholder='Filter repositories';filter.setAttribute('aria-label','Filter repositories');
 const sort=el('select');sort.id='repoSort';sort.setAttribute('aria-label','Sort repositories');
 for(const [value,label] of [['attention','Most presentation gaps'],['updated','Recently updated'],['stars','Most starred'],['name','Name A–Z']]){const opt=el('option','',label);opt.value=value;sort.append(opt);}
 controls.append(filter,sort);head.append(controls);
 const list=el('div','repo-list');list.id='repoList';const more=el('button','more','Show more');more.id='loadMore';more.type='button';
 section.append(head,list,more);output.append(section);
 filter.addEventListener('input',()=>{visibleCount=8;renderRepos();});sort.addEventListener('change',renderRepos);more.addEventListener('click',()=>{visibleCount+=8;renderRepos();});
 renderRepos();
}
async function analyze(username){
 if(!valid(username)){say('Enter a valid GitHub username.',true);return;}
 if(controller)controller.abort();controller=new AbortController();const id=++requestId;
 button.disabled=true;output.hidden=true;output.replaceChildren();say('Reviewing @'+username+'…');
 try{
  const user=await api('https://api.github.com/users/'+encodeURIComponent(username),controller.signal);
  // At most 100 repositories: bounded to reduce unauthenticated API requests.
  const repos=await api('https://api.github.com/users/'+encodeURIComponent(user.login)+'/repos?per_page=100&type=public&sort=updated',controller.signal);
  if(id!==requestId)return;
  render(user,repos);say('Assessment complete: reviewed '+repos.length+' public repositories for @'+user.login+'.');
  history.replaceState(null,'','#'+encodeURIComponent(user.login));
 }catch(err){if(err.name==='AbortError'||id!==requestId)return;say(err.message||'Network error. Please retry.',true);}
 finally{if(id===requestId)button.disabled=false;}
}
form.addEventListener('submit',e=>{e.preventDefault();analyze(input.value.trim());});
const initial=decodeURIComponent(location.hash.slice(1)).trim();if(valid(initial)){input.value=initial;analyze(initial);}
})();