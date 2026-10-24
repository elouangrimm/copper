// Pan, zoom and keyboard shortcuts.

const st=$('#stage');let dr=null,wt;
const touch=()=>{ctl&&ctl.abort();clearTimeout(tmr);clearTimeout(wt)};
function zoomAt(f0,ox,oy){touch();const k=Math.min(Math.max(T.k*f0,L.widthM/4e5),L.widthM/500),f=k/T.k;T.x=ox-(ox-T.x)*f;T.y=oy-(oy-T.y)*f;T.k=k;drawT();wt=setTimeout(commit,200)}
function nudge(dx,dy){touch();T.x+=dx;T.y+=dy;drawT();wt=setTimeout(commit,200)}
st.onpointerdown=e=>{if(document.fullscreenElement||e.target.closest('button'))return;touch();dr={x:e.clientX-T.x,y:e.clientY-T.y};st.setPointerCapture(e.pointerId);st.style.cursor='grabbing'};
st.onpointermove=e=>{if(dr){T.x=e.clientX-dr.x;T.y=e.clientY-dr.y;drawT()}};
st.onpointerup=st.onpointercancel=()=>{if(!dr)return;dr=null;st.style.cursor='grab';commit()};
st.addEventListener('wheel',e=>{e.preventDefault();if(document.fullscreenElement)return;const r=st.getBoundingClientRect();zoomAt(Math.min(Math.max(Math.exp(-e.deltaY*(e.deltaMode?.05:.0015)*cfg.zs),.5),2),e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)},{passive:false});
$('#ov').onclick=e=>{if(e.target.closest('#skip')){ccSkip=$('#date').value;sync();preview(0)}};
$('#zin').onclick=()=>zoomAt(1.4,0,0);$('#zout').onclick=()=>zoomAt(1/1.4,0,0);$('#dp').onclick=()=>step(-1);$('#dn').onclick=()=>step(1);$('#best').onclick=best;

const setMode=k=>{mode=k;modeUI();preview()};
addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select')||e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||document.fullscreenElement)return;const k=e.key,s=st.clientWidth*(e.shiftKey?.25:.08);
 if(k=='[')step(-1);else if(k==']')step(1);else if(k=='{')step(-1,1);else if(k=='}')step(1,1);
 else if(k=='ArrowLeft')nudge(s,0);else if(k=='ArrowRight')nudge(-s,0);else if(k=='ArrowUp')nudge(0,s);else if(k=='ArrowDown')nudge(0,-s);
 else if(k=='+'||k=='=')zoomAt(1.25,0,0);else if(k=='-')zoomAt(.8,0,0);
 else if(k=='g'){cfg.g=+!cfg.g;$('#sg').checked=!!cfg.g;applyCfg()}else if(k=='c')$('#xt').click();
 else if(k=='t')setMode('true');else if(k=='f')setMode('false');else if(k=='e')$('#dl').click();else if(k=='b')$('#addq').click();else if(k=='p')toggleFs();else if(k==','||k=='?')$('#sd').showModal();else return;e.preventDefault()});

// Full screen preview: hides guides and crosshair, shows the graded image at screen size.
function toggleFs(){document.fullscreenElement?document.exitFullscreen():st.requestFullscreen().catch(e=>msg('Full screen is not available here: '+e.message,1))}
$('#fs').onclick=toggleFs;
st.addEventListener('click',e=>{if(document.fullscreenElement&&!e.target.closest('button'))document.exitFullscreen()});
document.addEventListener('fullscreenchange',()=>{const on=!!document.fullscreenElement;
  preview(0,on?Math.min(2500,Math.round(Math.min(screen.width,screen.height*aspV())*devicePixelRatio)):undefined)});
