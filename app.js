'use strict';
const root=document.documentElement;
const reducedQuery=matchMedia('(prefers-reduced-motion: reduce)');
let motionOverride=null;
try{const value=localStorage.getItem('jobs-reduced');if(value!==null)motionOverride=value==='true'}catch(e){}
let reduced=motionOverride??reducedQuery.matches;
const pad=n=>String(n).padStart(3,'0');
const collection=document.getElementById('collection');
const indexList=document.getElementById('index-list');
const fragment=document.createDocumentFragment();
window.QUOTES.forEach((text,i)=>{
  const n=i+1;
  const scene=document.createElement('section');
  scene.className='quote-scene';scene.id='q-'+n;scene.setAttribute('aria-label','Myšlenka '+n+' ze 100');
  const stage=document.createElement('div');stage.className='quote-stage';
  const meta=document.createElement('div');meta.className='quote-meta';meta.textContent='MYŠLENKA '+pad(n)+' / 100';
  const quote=document.createElement('p');quote.className='quote-text';quote.setAttribute('aria-label',text);
  text.split(' ').forEach((word,j)=>{const span=document.createElement('span');span.className='word';span.textContent=word;span.setAttribute('aria-hidden','true');quote.append(span);if(j<text.split(' ').length-1)quote.append(' ')});
  const caption=document.createElement('div');caption.className='quote-caption';caption.textContent='STEVE JOBS · VOLNĚ ČESKY';
  const number=document.createElement('span');number.className='scene-number';number.textContent=pad(n);number.setAttribute('aria-hidden','true');
  stage.append(meta,quote,caption,number);scene.append(stage);fragment.append(scene);
  const link=document.createElement('a');link.href='#q-'+n;
  const label=document.createElement('span');label.textContent=pad(n);
  const wording=document.createElement('span');wording.textContent=text;
  const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(label,wording,arrow);indexList.append(link);
});
collection.append(fragment);
const chapters=document.getElementById('chapters');
for(let i=0;i<10;i++){const a=document.createElement('a');a.href='#q-'+(i*10+1);a.textContent=String(i+1).padStart(2,'0');a.setAttribute('aria-label','Myšlenky '+(i*10+1)+' až '+(i*10+10));chapters.append(a)}
const themeButtons=[...document.querySelectorAll('[data-set-theme]')];
function theme(value){root.dataset.theme=value;themeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.setTheme===value)));document.querySelector('meta[name=theme-color]').content=value==='dark'?'#080808':'#f5f5f2';try{localStorage.setItem('jobs-theme',value)}catch(e){}}
theme(root.dataset.theme);
themeButtons.forEach(b=>b.addEventListener('click',()=>theme(b.dataset.setTheme)));
const motionButton=document.getElementById('motion-toggle');
function applyMotion(){root.classList.toggle('reduced',reduced);motionButton.setAttribute('aria-pressed',String(reduced));motionButton.textContent=reduced?'Zapnout animace':'Omezit animace';schedule()}
motionButton.addEventListener('click',()=>{reduced=!reduced;motionOverride=reduced;try{localStorage.setItem('jobs-reduced',String(reduced))}catch(e){}applyMotion()});
reducedQuery.addEventListener('change',e=>{if(motionOverride===null){reduced=e.matches;applyMotion()}});
const dialog=document.getElementById('index-dialog');
document.getElementById('open-index').addEventListener('click',()=>{dialog.showModal();document.body.style.overflow='hidden'});
function closeIndex(){dialog.close()}
document.getElementById('close-index').addEventListener('click',closeIndex);
dialog.addEventListener('close',()=>{document.body.style.overflow=''});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeIndex()}});
indexList.addEventListener('click',e=>{if(e.target.closest('a'))closeIndex()});
const scenes=[...collection.children];
const words=scenes.map(s=>[...s.querySelectorAll('.word')]);
const visible=new Set();
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)visible.add(scenes.indexOf(e.target));else visible.delete(scenes.indexOf(e.target))});schedule()},{rootMargin:'60% 0px'});
scenes.forEach(s=>observer.observe(s));
const progress=document.getElementById('progress');
const currentNumber=document.getElementById('current-number');
const chapterLinks=[...chapters.children];
let pending=false,current=-1;
const clamp=(x,min=0,max=1)=>Math.max(min,Math.min(max,x));
function render(){
  pending=false;const vh=innerHeight;const y=scrollY;
  const start=collection.offsetTop,end=start+collection.offsetHeight;
  document.body.classList.toggle('reading',y+vh*.5>start&&y+vh*.5<end);
  progress.style.transform='scaleX('+clamp(y/Math.max(1,document.documentElement.scrollHeight-vh))+')';
  let nearest=-1,best=Infinity;
  visible.forEach(i=>{
    const rect=scenes[i].getBoundingClientRect();
    const distance=Math.abs(rect.top);
    if(distance<best){best=distance;nearest=i}
    if(reduced)return;
    // Reveal is tied to scroll position, so slow scrolling means slow animation.
    const p=clamp((vh*.82-rect.top)/(vh*.95));
    const leave=clamp((rect.top+rect.height-vh*.26)/(vh*.5));
    const count=words[i].length;
    words[i].forEach((word,j)=>{
      const t=clamp((p-(j/count)*.48)/.48);
      const eased=t*t*(3-2*t);
      word.style.opacity=String((.13+.87*eased)*(.12+.88*leave));
      word.style.transform='translateY('+((1-eased)*17)+'px)';
      word.style.filter='blur('+((1-eased)*3)+'px)';
    });
  });
  if(nearest!==-1&&current!==nearest){current=nearest;currentNumber.textContent=pad(current+1);chapterLinks.forEach((a,i)=>{const active=i===Math.floor(current/10);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(render)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
addEventListener('keydown',e=>{if(dialog.open||!document.body.classList.contains('reading')||e.altKey||e.metaKey||e.ctrlKey)return;if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();const n=clamp(current+(e.key==='ArrowRight'?1:-1),0,99);scenes[n].scrollIntoView({behavior:reduced?'instant':'smooth'})}});
applyMotion();
if(location.hash.startsWith('#q-')){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}))}
