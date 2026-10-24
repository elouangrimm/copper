// Reads Copernicus Browser links into a position, date and band preset.

function links(t){t=t.replace(/https:\/\/www\.google\.com\/url\?[^\s)\]]*?q=([^\s)\]&]+)/g,(_,q)=>decodeURIComponent(q));return[...new Set(t.match(/https:\/\/browser\.dataspace\.copernicus\.eu\/\?[^\s)\]]+/g)||[])]}
function parse(u){const p={};u.split('?')[1].split('&').forEach(x=>{const[k,v]=x.split('=');try{p[k]=decodeURIComponent(v||'')}catch(e){p[k]=v}});
 const lat=+p.lat,lng=+p.lng;if(isNaN(lat)||isNaN(lng))throw Error('That link has no position. Copy it from the address bar of the Copernicus Browser.');
 const L=(p.layerId||'').toUpperCase(),pre=/NDVI/.test(L)?'ndvi':/NDWI|WATER/.test(L)?'ndwi':/MOIST/.test(L)?'moist':/URBAN/.test(L)?'urban':/SWIR/.test(L)?'swir':/AGRI/.test(L)?'agri':/GEOL/.test(L)?'geo':/FALSE/.test(L)?'false':/TRUE/.test(L)?'true':null;
 return{lat,lng,widthM:wz(lat,+p.zoom||11),pre,date:(p.toTime||p.fromTime||'').slice(0,10)}}
