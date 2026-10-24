// Small DOM helpers: option chips, status line, overlay.

const cv=$('#cv'),cx=cv.getContext('2d',{willReadFrequently:true}),ls=k=>{try{return localStorage[k]||''}catch(e){return''}};
function chips(id,items,v,cb){const el=$('#'+id);el.dataset.v=v;el.innerHTML=items.map(([k,l])=>`<button type="button" data-k="${k}" class="${k==v?'on':''}">${l}</button>`).join('');
 el.onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;el.dataset.v=k;[...el.children].forEach(c=>c.classList.toggle('on',c.dataset.k==k));cb(k)}}
const pick=(id,k)=>{const el=$('#'+id);el.dataset.v=k;[...el.children].forEach(c=>c.classList.toggle('on',c.dataset.k==k))};
const msg=(m,e)=>{$('#msg').textContent=m;$('#msg').className=e?'e':''},ov=t=>$('#ov').innerHTML=t||'';
