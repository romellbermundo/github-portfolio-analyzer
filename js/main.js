(() => {
'use strict';
const $ = id => document.getElementById(id);
const form = $('searchForm'), input = $('searchUser'), button = $('searchButton'), status = $('status'), output = $('profile');
let controller = null, requestId = 0, repositories = [], visibleCount = 3, motionObserver = null;
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
// Count and fill only when the section enters the viewport. Respect reduced motion.
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animatedNumber = value => {
 const node=el('strong','count-up',reducedMotion()?Number(value).toLocaleString():'0');
 node.dataset.target=String(Number(value)||0);
 return node;
};
function startDashboardMotion(){
 if(motionObserver){motionObserver.disconnect();motionObserver=null;}
 const groups=output.querySelectorAll('.analysis-summary, .skill-bars');
 const run=group=>{
  const nums=[...group.querySelectorAll('.count-up,[data-count-target]')];
  const bars=[...group.querySelectorAll('.skill-fill[data-final-width]')];
  if(reducedMotion()){
   nums.forEach(n=>{const target=Number(n.dataset.target??n.dataset.countTarget)||0;n.textContent=target.toLocaleString()+(n.dataset.countUnit?' '+(target===1?'repository':'repositories'):'');});
   bars.forEach(b=>b.style.width=b.dataset.finalWidth);
   return;
  }
  nums.forEach(n=>{n.textContent='0'+(n.dataset.countUnit?' repositories':'');});
  bars.forEach(b=>b.style.width='0%');
  const duration=2000;
  let start=null;
  const tick=now=>{
   if(!group.isConnected)return;
   if(start===null)start=now;
   const t=Math.min(1,(now-start)/duration);
   const eased=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
   nums.forEach(n=>{const target=Number(n.dataset.target??n.dataset.countTarget)||0;const current=Math.round(target*eased);n.textContent=current.toLocaleString()+(n.dataset.countUnit?' '+(current===1?'repository':'repositories'):'');});
   bars.forEach(b=>b.style.width=(parseFloat(b.dataset.finalWidth)*eased)+'%');
   if(t<1)requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
 };
 if(!('IntersectionObserver' in window)){groups.forEach(run);return;}
 motionObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   motionObserver?.unobserve(entry.target);
   run(entry.target);
  });
 },{threshold:0.3});
 groups.forEach(group=>motionObserver.observe(group));
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
 const card=el('section','card assessment-panel');
 card.append(el('p','eyebrow','YOUR PORTFOLIO ASSESSMENT'),el('h2','','Portfolio assessment'));
 const metrics=el('div','analysis-summary');
 for(const [label,value] of [['Repos reviewed',repos.length],['Active past year',own.length-stale.length],['Need descriptions',missing.length],['Languages',langs.size]]){
  const box=el('div','metric');append(box,el('span','',label),animatedNumber(value));metrics.append(box);
 }
 card.append(metrics);
 const p=el('p','explanation','Based on public repo metadata, not source-code review. Forks and archived repos excluded from gap counts; recent means pushed within a year.');card.append(p);
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
function publicProfileDetails(user){
 const card=el('section','card public-details-panel');
 card.append(el('h2','','Public profile details'));
 const facts=el('div','profile-facts');
 const social=Array.isArray(user.social_accounts)?user.social_accounts:[];
 const linkedin=social.find(s=>s.provider==='linkedin'&&/^https:\/\/(www\.)?linkedin\.com\//i.test(s.url||''));
 const entries=[
  ['GitHub member since',user.created_at?fmt(user.created_at):null],
  ['Account age',user.created_at?Math.floor(daysSince(user.created_at)/365.25)+' years':null],
  ['Location',user.location],
  ['Company',user.company],
  ['Public name',user.name],
  ['LinkedIn profile',linkedin?.url||null]
 ];
 for(const [label,value] of entries){
  if(!value)continue;
  const row=el('div','profile-fact');row.append(el('span','',label));
  if(label==='LinkedIn profile')row.append(link('View LinkedIn ↗',value));
  else row.append(el('strong','',value));
  facts.append(row);
 }
 if(!facts.children.length)facts.append(el('p','explanation','No additional public profile details provided.'));
 card.append(facts);
 return card;
}
function followersPanel(user){
 const panel=el('section','card followers-panel');
 const heading=el('div','followers-heading');
 heading.append(el('h2','','Followers'),link('View all on GitHub ↗',user.html_url+'?tab=followers'));
 panel.append(heading);
 const description=el('p','explanation','Select a follower to analyze their public GitHub portfolio here.');
 const list=el('div','follower-grid');
 panel.append(description,list);
 const load=el('button','more','Show followers');
 load.type='button';load.style.margin='12px 0 0';
 panel.append(load);
 let page=0,loading=false;
 async function next(){
  if(loading)return;
  loading=true;load.disabled=true;load.textContent='Loading…';
  try{
   const data=await api('https://api.github.com/users/'+encodeURIComponent(user.login)+'/followers?per_page=30&page='+(page+1),controller?.signal);
   if(!Array.isArray(data))throw Error('Unexpected response.');
   page++;
   for(const follower of data){
    const item=el('a','follower-item');item.href='#'+encodeURIComponent(follower.login);item.setAttribute('aria-label','Analyze @'+follower.login+' portfolio');item.addEventListener('click',event=>{event.preventDefault();input.value=follower.login;analyze(follower.login);window.scrollTo({top:0,behavior:'smooth'});});
    const avatar=el('img','follower-avatar');avatar.src=follower.avatar_url;avatar.alt='';avatar.loading='lazy';
    item.append(avatar,el('span','', '@'+follower.login));
    list.append(item);
   }
   if(page===1&&!data.length)list.append(el('p','explanation','No public followers.'));
   load.hidden=data.length<30 || page*30>=user.followers;
   load.textContent='Load more followers';
  }catch(e){
   if(e.name!=='AbortError'){description.textContent='Could not load followers: '+e.message;load.textContent='Retry loading followers';}
  }finally{loading=false;load.disabled=false;}
 }
 load.addEventListener('click',next);
 if(user.followers>0)next();else{load.hidden=true;description.textContent='No public followers.';}
 return panel;
}
function intelligence(user,repos){
 const card=el('section','card intelligence dashboard-panel');
 card.append(el('p','eyebrow','PUBLIC DEVELOPER INTELLIGENCE'),el('h2','','Developer at a glance'));
 const own=repos.filter(r=>!r.fork);
 const stars=own.reduce((n,r)=>n+(r.stargazers_count||0),0);
 const forks=own.reduce((n,r)=>n+(r.forks_count||0),0);
 const metrics=el('div','analysis-summary');
 for(const [label,value] of [['Public repositories',user.public_repos],['Followers',user.followers],['Stars on original repos',stars],['Forks of original repos',forks],['Following',user.following],['Public gists',user.public_gists],['GitHub account age (years)',user.created_at?Math.floor(daysSince(user.created_at)/365.25):0],['Forked repositories',repos.filter(r=>r.fork).length],['Archived repositories',repos.filter(r=>r.archived).length],['Original repos reviewed',own.length],['Recent push (90 days)',own.filter(r=>daysSince(r.pushed_at)<=90).length]]){
  const box=el('div','metric');append(box,el('span','',label),animatedNumber(value));metrics.append(box);
 }
 card.append(metrics);
 card.append(el('h3','','Languages and technology signals'));
 const counts=new Map();
 for(const r of own){if(r.language)counts.set(r.language,(counts.get(r.language)||0)+1);}
 const ranked=[...counts].sort((a,b)=>b[1]-a[1]);
 const bars=el('div','skill-bars');
 for(const [language,count] of ranked.slice(0,12)){
  const row=el('div','skill-row'),head=el('div','skill-label');
  const countLabel=el('span','',reducedMotion()?count+' '+(count===1?'repository':'repositories'):'0 repositories');
  countLabel.dataset.countTarget=String(count);countLabel.dataset.countUnit=count===1?'repository':'repositories';
  append(head,el('strong','',language),countLabel);
  const track=el('div','skill-track'),fill=el('div','skill-fill');
  fill.dataset.finalWidth=(100*count/Math.max(1,own.length))+'%';
  fill.style.width=reducedMotion()?fill.dataset.finalWidth:'0%';
  track.append(fill);row.append(head,track);bars.append(row);
 }
 if(!ranked.length)bars.append(el('p','explanation','No primary programming languages reported for these repositories.'));
 card.append(bars,el('p','explanation','Languages reflect each original repo’s primary language, not every language used. Counts are not skill ratings; forks excluded.'));
 const popular=[...own].sort((a,b)=>b.stargazers_count-a.stargazers_count).slice(0,6);
 card.append(el('h3','','Most starred original projects'));
 const list=el('div','popular-list');
 for(const r of popular){const row=el('div','popular-item');append(row,link(r.name,r.html_url),el('strong','','★ '+r.stargazers_count));list.append(row);}
 if(!popular.length)list.append(el('p','explanation','No original public repositories found.'));
 card.append(list);
 if(user.public_repos>repos.length)card.append(el('p','explanation','Partial inventory: the GitHub API reports '+user.public_repos+' public repositories, but only '+repos.length+' were retrieved. Stars, forks and language totals reflect the retrieved sample.'));
 return card;
}
function profile(user){
 const card=el('section','card profile-card');
 const avatar=el('img','avatar');avatar.src=user.avatar_url;avatar.alt=user.login+' avatar';avatar.loading='lazy';
 const d=el('div','profile-details');
 append(d,el('h2','',user.name||user.login),el('p','username','@'+user.login));
 if(user.bio)d.append(el('p','bio',user.bio));
 const meta=el('div','meta');for(const s of [user.public_repos+' public repos',user.followers+' followers'])meta.append(el('span','pill',s));
 append(d,meta,link('Original GitHub profile ↗',user.html_url,'primary-link'));append(card,avatar,d);return card;
}
function renderRepos(){
 const target=$('repoList');if(!target)return;
 const q=$('repoFilter').value.trim().toLowerCase(),mode=$('repoSort').value;
 const filtered=repositories.filter(r=>(r.name+' '+(r.description||'')).toLowerCase().includes(q));
 filtered.sort((a,b)=>mode==='attention'?signals(b).length-signals(a).length:mode==='stars'?b.stargazers_count-a.stargazers_count:mode==='name'?a.name.localeCompare(b.name):new Date(b.pushed_at||0)-new Date(a.pushed_at||0));
 target.replaceChildren();
 for(const r of filtered.slice(0,visibleCount)){
  const card=el('article','repo');const title=el('h3');title.append(link(r.name,r.html_url));card.append(title);
  card.append(el('span','repo-tag',r.archived?'Archived':r.fork?'Fork':!r.description||r.description.trim().length<25?'Needs description':!r.homepage?'No demo link':'Project'));
  card.append(el('p','',r.description||'No description provided.'));
  const stats=el('div','repo-stats');append(stats,el('span','','★ '+r.stargazers_count),el('span','','⑂ '+r.forks_count),el('span','',r.language||'Language unspecified'),el('span','','Updated '+fmt(r.pushed_at)));card.append(stats);
  const notes=signals(r);card.append(el('p','recommendation',notes.length?notes.slice(0,2).join(' '):'No obvious presentation gaps from available metadata.'));
  target.append(card);
 }
 if(!filtered.length)target.append(el('p','empty','No repositories match this filter.'));
 const more=$('loadMore');more.hidden=filtered.length<=visibleCount;more.textContent='Show more ('+Math.max(0,filtered.length-visibleCount)+' remaining)';
}
function render(user,repos){
 output.replaceChildren();output.hidden=false;repositories=repos;visibleCount=3;
 output.append(profile(user),intelligence(user,repos),followersPanel(user),publicProfileDetails(user),summary(repos,user));
 const section=el('section','card repository-panel');const head=el('div','section-heading');head.append(el('h2','','Repository review'));
 const controls=el('div','repo-controls');
 const filter=el('input');filter.id='repoFilter';filter.type='search';filter.placeholder='Filter repositories';filter.setAttribute('aria-label','Filter repositories');
 const sort=el('select');sort.id='repoSort';sort.setAttribute('aria-label','Sort repositories');
 for(const [value,label] of [['attention','Most presentation gaps'],['updated','Recently updated'],['stars','Most starred'],['name','Name A–Z']]){const opt=el('option','',label);opt.value=value;sort.append(opt);}
 controls.append(filter,sort);head.append(controls);
 const list=el('div','repo-list');list.id='repoList';const more=el('button','more','Show more');more.id='loadMore';more.type='button';
 section.append(head,list,more);output.append(section);
 filter.addEventListener('input',()=>{visibleCount=3;renderRepos();});sort.addEventListener('change',renderRepos);more.addEventListener('click',()=>{visibleCount+=3;renderRepos();});
 renderRepos();
 startDashboardMotion();
}
async function analyze(username){
 if(!valid(username)){say('Enter a valid GitHub username.',true);return;}
 if(motionObserver){motionObserver.disconnect();motionObserver=null;}
 if(controller)controller.abort();controller=new AbortController();const id=++requestId;
 button.disabled=true;output.hidden=true;output.replaceChildren();say('Reviewing @'+username+'…');
 try{
  const user=await api('https://api.github.com/users/'+encodeURIComponent(username),controller.signal);
  // At most 100 repositories: bounded to reduce unauthenticated API requests.
  const repos=await api('https://api.github.com/users/'+encodeURIComponent(user.login)+'/repos?per_page=100&type=public&sort=updated',controller.signal);
  try{user.social_accounts=await api('https://api.github.com/users/'+encodeURIComponent(user.login)+'/social_accounts',controller.signal);}catch(e){if(e.name==='AbortError')throw e;user.social_accounts=[];}
  if(id!==requestId)return;
  render(user,repos);say('Assessment complete · '+repos.length+' public repos reviewed');
  history.replaceState(null,'','#'+encodeURIComponent(user.login));
 }catch(err){if(err.name==='AbortError'||id!==requestId)return;say(err.message||'Network error. Please retry.',true);}
 finally{if(id===requestId)button.disabled=false;}
}
const shareDialog=$('shareDialog'),shareButton=$('openShare'),shareQr=$('shareQr');
if(shareDialog&&shareButton&&shareQr){
 shareButton.addEventListener('click',()=>{
  if(!shareQr.getAttribute('src')){
   const url='https://romellbermundo.github.io/jquery-github-finder/';
   shareQr.src='https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=24&data='+encodeURIComponent(url);
  }
  shareDialog.showModal();
 });
 shareDialog.addEventListener('click',event=>{if(event.target===shareDialog)shareDialog.close();});
}
form.addEventListener('submit',e=>{e.preventDefault();analyze(input.value.trim());});
let initial='';try{initial=decodeURIComponent(location.hash.slice(1)).trim();}catch(_){initial='';}if(valid(initial)){input.value=initial;analyze(initial);}
})();