// Builds the controls, wires them up and starts the app. Loaded last.

for(let i=0;i<3;i++)$('#b'+i).innerHTML=BANDS.map(b=>`<option>${b}</option>`).join('');
['B08','B04','B03'].forEach((b,i)=>$('#b'+i).value=b);
chips('asp',ASP,'1.5',()=>{resetT();sync();preview()});
chips('modes',M.map(m=>[m.id,m.id=='true'?'<b>True color</b><small>As the eye sees it</small>':m.id=='false'?'<b>False color</b><small>Vegetation glows red</small>':m.n]),'false',k=>{mode=k;modeUI();preview()});
chips('gp',Object.keys(GP).map(k=>[k,k]),'',k=>{GR.forEach((g,i)=>G[g[0]]=GP[k][i]);slUI();repaint()});
$('#wid').onchange=$('#fmt').onchange=info;
chips('mask',[['0','Off'],['1','Standard'],['2','Strict']],'1',()=>preview());
$('#sls').innerHTML=GR.map(([k,n,a,b])=>`<div class="sl"><span>${n}</span><input type="range" id="g_${k}" min="${a}" max="${b}" value="${G[k]}" aria-label="${n}"><output></output></div>`).join('');
GR.forEach(([k])=>$('#g_'+k).oninput=e=>{G[k]=+e.target.value;slUI();pick('gp','');repaint()});
function slUI(){GR.forEach(([k])=>{const e=$('#g_'+k);e.value=G[k];e.nextElementSibling.textContent=G[k]})}
function modeUI(){const m=M.find(x=>x.id===mode);$('#md').textContent=m.d+(m.in.length?' Uses '+m.in.join(', ')+'.':'');$('#cust').hidden=mode!=='custom';pick('modes',mode)}
$('#scenes').append(...SC.map((s,i)=>Object.assign(document.createElement('button'),{textContent:s[0],type:'button',onclick:()=>{apply({lat:s[1],lng:s[2],widthM:wz(s[1],s[3]),date:s[4],pre:s[5]});$('#win').value=3;preview()}})));

function apply(o){resetT();S.lat=o.lat;S.lng=o.lng;S.widthM=o.widthM;if(o.pre){mode=o.pre;modeUI()}if(o.date)$('#date').value=o.date;sync()}

$('#lf').onsubmit=e=>{e.preventDefault();try{const l=links($('#link').value)[0];if(!l)throw Error('No Copernicus Browser link found in that text.');apply(parse(l));preview()}catch(e){msg(e.message,1)}};
$('#addl').onclick=()=>{try{const ls=links($('#bl').value);if(!ls.length)throw Error('No Copernicus Browser links found.');ls.forEach(l=>{const o=parse(l),s=snap();Object.assign(s,{lat:o.lat,lng:o.lng,widthM:o.widthM});if(o.date)s.date=o.date;if(o.pre)s.mode=o.pre;addQ(s)});$('#bl').value=''}catch(e){msg(e.message,1)}};
$('#addq').onclick=()=>addQ(snap());$('#clrq').onclick=()=>{Q.length=0;drawQ()};$('#ql').onclick=e=>{if(e.target.dataset.i){Q.splice(+e.target.dataset.i,1);drawQ()}};
$('#dl').onclick=async()=>{try{const[W,f]=out(),s=snap();await render(s,W,f,'Export',s.G)}catch(e){msg(e.message,1)}};
$('#runq').onclick=async()=>{const[W,f]=out();for(let i=0;i<Q.length;i++){const q=Q[i];if(q.st==='done')continue;q.st='run';q.msg='working';drawQ();
 try{await render(q.s,W,f,`Batch ${i+1} of ${Q.length}`,q.s.G);q.st='done';q.msg='saved'}catch(e){q.st='err';q.msg='failed';msg(e.message,1)}drawQ()}};
['b0','b1','b2'].forEach(i=>$('#'+i).onchange=preview);['date','win'].forEach(i=>$('#'+i).onchange=()=>{sync();preview()});
$('#cc').oninput=sync;$('#cc').onchange=preview;
['lat','lng','wkm'].forEach(i=>$('#'+i).onchange=()=>{resetT();S.lat=+$('#lat').value;S.lng=+$('#lng').value;S.widthM=+$('#wkm').value*1000;sync();preview()});

loadCfg();$('#date').value='2026-10-14';slUI();modeUI();sync();drawQ();preview();
