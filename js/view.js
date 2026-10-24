// View state: caption, size readout, preview rendering, date stepping.

const aspV=()=>+$('#asp').dataset.v,wz=(lat,z)=>156543.03*Math.cos(lat*Math.PI/180)/2**z*1400;
function snap(){return{lat:S.lat,lng:S.lng,widthM:S.widthM,asp:aspV(),mode,cb:[0,1,2].map(i=>$('#b'+i).value),G:{...G},date:$('#date').value,win:+$('#win').value,cc:ccSkip===$('#date').value?100:+$('#cc').value,mask:+$('#mask').dataset.v}}
function sync(){$('#lat').value=S.lat.toFixed(5);$('#lng').value=S.lng.toFixed(5);$('#wkm').value=(S.widthM/1000).toFixed(2);$('#ccv').textContent=$('#cc').value;
 document.documentElement.style.setProperty('--a',aspV());badge();
 const ns=S.lat>=0?'N':'S',ew=S.lng>=0?'E':'W',d=$('#date').value?new Date($('#date').value+'T12:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'';
 $('#cap').innerHTML=`<b>${Math.abs(S.lat).toFixed(3)}° ${ns}, ${Math.abs(S.lng).toFixed(3)}° ${ew}</b>${d}, ${M.find(x=>x.id===mode).n.toLowerCase()}, ${(S.widthM/1000).toFixed(0)} km across`;info()}
function dims(){const v=$('#wid').value,W=v==='0'?Math.round(S.widthM/10):+v;return{W,H:Math.round(W/aspV())}}
function info(){const{W,H}=dims(),r=S.widthM/W,ok=W<=16000&&H<=16000&&W*H<=2e8,f=b=>b>=1e9?(b/1e9).toFixed(1)+' GB':Math.max(1,Math.round(b/1e6))+' MB';
 $('#info').innerHTML=`<b>${W} × ${H} px</b>, ${(W*H/1e6).toFixed(0)} MP, ${r.toFixed(1)} m per pixel`+(r<10?`, enlarged ${(10/r).toFixed(1)}×`:'')+`<br>Roughly ${f(W*H*2.3)} as PNG or ${f(W*H*.5)} as JPEG. Prints ${(W/300*2.54).toFixed(0)} × ${(H/300*2.54).toFixed(0)} cm at 300 dpi.`+(ok?'':'<br><b style="color:#ff8f86">Too large for a browser canvas. Pick a smaller width or area.</b>');$('#dl').disabled=!ok}

function drawT(){cv.style.transform=T.k==1&&!T.x&&!T.y?'':`translate(${T.x}px,${T.y}px) scale(${T.k})`}
function resetT(){T={x:0,y:0,k:1};drawT()}
function commit(){const m=L.widthM/st.clientWidth,c=Math.cos(L.lat*Math.PI/180);S.lat=L.lat+T.y/T.k*m/111320;S.lng=L.lng-T.x/T.k*m/(111320*c);S.widthM=L.widthM/T.k;sync();preview(0)}
function badge(){const d=$('#date').value,c=AV[d],el=$('#dc');el.textContent=ccSkip===d?'Cloud limit ignored for this day':c==null?'':Math.round(c)+'% cloud';el.className=ccSkip===d||(c!=null&&c>+$('#cc').value)?'w':''}

function setDate(d){$('#date').value=d;sync();preview(0)}
async function step(dir,clear){try{msg('Looking up available days…');await loadAv();const d=$('#date').value,cc=+$('#cc').value;let c=Object.keys(AV).sort().filter(x=>dir>0?x>d:x<d);if(clear)c=c.filter(x=>AV[x]<=cc);const n=dir>0?c[0]:c[c.length-1];if(!n)return msg('No more '+(clear?'clear ':'')+'days in that direction.');setDate(n)}catch(e){msg(e.message,1)}}
async function best(){try{msg('Looking for the clearest day…');await loadAv();const d=new Date($('#date').value+'T12:00'),c=Object.keys(AV).filter(x=>Math.abs(new Date(x+'T12:00')-d)<=60*864e5).sort((a,b)=>AV[a]-AV[b]||Math.abs(new Date(a)-d)-Math.abs(new Date(b)-d))[0];if(!c)return msg('No scenes found within 60 days.');setDate(c)}catch(e){msg(e.message,1)}}
function preview(delay=300,pw){clearTimeout(tmr);tmr=setTimeout(async()=>{ctl&&ctl.abort();const c=ctl=new AbortController(),s=snap(),w=pw||cfg.q,h=Math.round(w/s.asp);$('#ld').hidden=false;
 try{const b=await fetchImg(s,bbox(s),w,h,c.signal,'jpeg');cv.width=w;cv.height=h;cx.drawImage(b,0,0);b.close();raw=cx.getImageData(0,0,w,h);paint();L={lat:s.lat,lng:s.lng,widthM:s.widthM};resetT();
  let ok=0;for(let i=0;i<raw.data.length;i+=4)if(raw.data[i]+raw.data[i+1]+raw.data[i+2]>12){ok=1;break}
  if(ok){ov('');msg('Drag to move, scroll to zoom. The preview is lower quality, you can change that in settings. A black view means no scene passed your cloud limit.');loadAv().then(badge,()=>{})}
  else{await loadAv().catch(()=>{});badge();const d=s.date,cc=AV[d],ign=ccSkip===d;
   ov(`<div class="nd"><b>Nothing to show for ${d}</b><p>${ign?'Sentinel-2 has no data for this spot on this day.':(cc!=null?`That day is ${Math.round(cc)}% cloudy, above your ${$('#cc').value}% limit.`:`No scene passes your ${$('#cc').value}% cloud limit, or no pass covered this spot that day.`)}</p>${ign?'':'<button class="pri" id="skip">Show this day anyway</button>'}</div>`);msg('')}}
 catch(e){if(e.name!=='AbortError'){ov(esc(e.message));msg(e.message,1)}}finally{if(!c.signal.aborted)$('#ld').hidden=true}},delay)}
