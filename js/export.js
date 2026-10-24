// Full resolution export (tiled and stitched) and the batch queue.

async function render(s,W,fmt,label,gr){const H=Math.round(W/s.asp),T=2500,cols=Math.ceil(W/T),rows=Math.ceil(H/T),bb=bbox(s),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});let n=0;
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x0=i*T,x1=Math.min(W,x0+T),y0=j*T,y1=Math.min(H,y0+T),
  tb=[bb[0]+(bb[2]-bb[0])*x0/W,bb[3]-(bb[3]-bb[1])*y1/H,bb[0]+(bb[2]-bb[0])*x1/W,bb[3]-(bb[3]-bb[1])*y0/H];
  msg(`${label}: fetching tile ${n+1} of ${cols*rows}`);const im=await fetchImg(s,tb,x1-x0,y1-y0);x.drawImage(im,x0,y0);im.close();
  const t=x.getImageData(x0,y0,x1-x0,y1-y0);grade(t,gr,x0,y0,W,H);x.putImageData(t,x0,y0);$('#bar').style.width=++n/(cols*rows)*100+'%'}
 msg(`${label}: encoding…`);const blob=await new Promise(r=>c.toBlob(r,'image/'+fmt,.95)),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download=`copper_${s.mode}_${s.lat.toFixed(3)}_${s.lng.toFixed(3)}_${s.date}_${W}x${H}.${fmt=='jpeg'?'jpg':'png'}`;a.click();$('#bar').style.width=0;msg('Saved '+a.download)}

function drawQ(){$('#ql').innerHTML=Q.map((q,i)=>`<li class="${q.st||''}"><span>${q.label}</span><em>${q.msg||'waiting'}</em><button data-i="${i}" aria-label="Remove">×</button></li>`).join('')||'<li class="none">Nothing queued yet.</li>'}
function addQ(s){Q.push({s,label:`${s.lat.toFixed(3)}, ${s.lng.toFixed(3)} on ${s.date}, ${M.find(x=>x.id===s.mode).n.toLowerCase()}`});drawQ()}
const out=()=>[dims().W,$('#fmt').value];
