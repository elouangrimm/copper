// Copernicus Data Space calls: bounding box, evalscript, token, Process API, Catalog API.

function bbox(s){const dy=s.widthM/s.asp/111320,dx=s.widthM/(111320*Math.cos(s.lat*Math.PI/180));return[s.lng-dx/2,s.lat-dy/2,s.lng+dx/2,s.lat+dy/2]}
function script(s){const m=s.mode==='custom'?{in:s.cb,f:rgb(...s.cb)}:M.find(x=>x.id===s.mode),bs=[...new Set([...m.in,'SCL',...(s.mask>1?['B02']:[])])];
return`//VERSION=3
function setup(){return{input:[{bands:${JSON.stringify(bs)},units:${JSON.stringify(bs.map(b=>b=='SCL'?'DN':'REFLECTANCE'))}}],output:{bands:3,sampleType:"AUTO"},mosaicking:"ORBIT"}}
function bad(x){return [1,3,8,9,10].indexOf(x.SCL)>=0${s.mask>1?'||x.SCL==7||(x.B02>.26&&x.SCL!=11)':''}}
function f(s){${m.f}}
function evaluatePixel(ss){ss=ss||[];let s=null;${s.mask?'for(let x of ss)if(x.SCL!=0&&!bad(x)){s=x;break}':''}
if(!s)for(let x of ss)if(x.SCL!=0){s=x;break}
if(!s)return[0,0,0];return f(s).map(v=>Math.min(1,Math.max(0,v)))}`}
async function token(){if(tok&&Date.now()<exp)return tok;const id=$('#cid').value.trim(),sec=$('#sec').value.trim();
 if(!id||!sec){if(!$('#kd').open)$('#kd').showModal();throw Error('Add your Copernicus API key to render images.')}
 const r=await fetch(TOKEN,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'client_credentials',client_id:id,client_secret:sec})});
 if(!r.ok)throw Error('Copernicus rejected the key ('+r.status+'). Check the client ID and secret.');const j=await r.json();tok=j.access_token;exp=Date.now()+(j.expires_in-30)*1000;return tok}
async function fetchImg(s,bb,w,h,signal,fmt='png'){
 const d=new Date(s.date+'T00:00:00Z'),f=new Date(d-s.win*864e5).toISOString(),t=new Date(+d+s.win*864e5+864e5-1).toISOString();
 const body={input:{bounds:{bbox:bb,properties:{crs:'http://www.opengis.net/def/crs/EPSG/0/4326'}},data:[{type:'sentinel-2-l2a',dataFilter:{timeRange:{from:f,to:t},maxCloudCoverage:s.cc,mosaickingOrder:'leastCC'},processing:{upsampling:'BICUBIC',downsampling:'BICUBIC'}}]},
 output:{width:w,height:h,responses:[{identifier:'default',format:{type:'image/'+fmt}}]},evalscript:script(s)};
 const r=await fetch(API,{method:'POST',signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+await token()},body:JSON.stringify(body)});
 if(!r.ok)throw Error('Copernicus error '+r.status+': '+(await r.text()).replace(/\\n/g,' ').slice(0,700));return createImageBitmap(await r.blob())}

function loadAv(){const key=Math.round(S.lat/.3)+','+Math.round(S.lng/.3);if(avk===key&&avp)return avp;avk=key;const mp=AV={};
 avp=(async()=>{const end=new Date(),a=new Date(+end-420*864e5),iso=d=>d.toISOString().slice(0,19)+'Z',body={collections:['sentinel-2-l2a'],datetime:iso(a)+'/'+iso(end),bbox:bbox(snap()),limit:100,fields:{include:['properties.datetime','properties.eo:cloud_cover'],exclude:[]}};
  for(let p=0;p<8;p++){const r=await fetch(CAT,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+await token()},body:JSON.stringify(body)});if(!r.ok)throw Error('Day lookup failed ('+r.status+')');const j=await r.json();
   j.features.forEach(f=>{const d=f.properties.datetime.slice(0,10),c=f.properties['eo:cloud_cover'];mp[d]=Math.min(mp[d]??101,c)});if(!j.context||j.context.next==null||!j.features.length)break;body.next=j.context.next}})().catch(e=>{avk='';throw e});return avp}
