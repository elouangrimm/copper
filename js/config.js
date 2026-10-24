// Shared constants, band presets and application state.

const $=s=>document.querySelector(s),TOKEN='https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token',API='https://sh.dataspace.copernicus.eu/api/v1/process';
const BANDS=['B01','B02','B03','B04','B05','B06','B07','B08','B8A','B09','B11','B12'];
const rgb=(a,b,c)=>`return[2.5*s.${a},2.5*s.${b},2.5*s.${c}]`;
const M=[
{id:'true',n:'True color',d:'The scene as the eye would see it.',in:['B04','B03','B02'],f:rgb('B04','B03','B02')},
{id:'false',n:'False color',d:'Healthy vegetation glows red, water turns ink blue.',in:['B08','B04','B03'],f:rgb('B08','B04','B03')},
{id:'urban',n:'Urban',d:'Cities in cool greys and blues against crisp green land.',in:['B12','B11','B04'],f:rgb('B12','B11','B04')},
{id:'swir',n:'SWIR',d:'Cuts through haze. Minerals, salt crusts and moisture stand out.',in:['B12','B8A','B04'],f:rgb('B12','B8A','B04')},
{id:'agri',n:'Agriculture',d:'Fields in saturated greens and rust, bare soil in warm tones.',in:['B11','B08','B02'],f:rgb('B11','B08','B02')},
{id:'geo',n:'Geology',d:'Rock types separate into bold colour bands.',in:['B12','B11','B02'],f:rgb('B12','B11','B02')},
{id:'ndvi',n:'Vegetation',d:'Plant vigour as a red to green ramp.',in:['B08','B04'],f:'let n=(s.B08-s.B04)/(s.B08+s.B04+1e-4),k=Math.max(0,Math.min(1,(n+.1)/.9));return[1-k,.9*k,.2]'},
{id:'ndwi',n:'Water',d:'Open water in clear blues, land in sand tones.',in:['B03','B08'],f:'let n=(s.B03-s.B08)/(s.B03+s.B08+1e-4);return n>0?[.05,.4+n*.5,.7+n*.3]:[s.B03*1.8,s.B03*1.8,s.B08*1.4]'},
{id:'moist',n:'Moisture',d:'Wet soil and wetlands in deep blue-green.',in:['B8A','B11'],f:'let n=(s.B8A-s.B11)/(s.B8A+s.B11+1e-4),v=(n+.8)/1.6;return[v*.2,v*.9,v*1.1]'},
{id:'custom',n:'Custom',d:'Pick any three Sentinel-2 bands for red, green and blue.',in:[]}];
const ASP=[['1.5','3:2'],['1','1:1'],['1.3333','4:3'],['1.7778','16:9'],['0.8','4:5'],['0.6667','2:3'],['0.5625','9:16'],['3','3:1']];
const GR=[['exposure','Exposure',-50,50],['contrast','Contrast',-50,50],['saturation','Saturation',-50,70],['vibrance','Vibrance',-50,70],['warmth','Warmth',-50,50],['vignette','Vignette',0,100]];
const GP={Natural:[0,0,0,0,0,0],Vivid:[8,18,30,25,5,15],Punchy:[4,32,45,35,-4,25],Moody:[-6,24,15,20,-8,35]};
const SC=[['Guérande marshes',47.32533,-2.35279,11,'2026-10-14','false'],['Exuma Cays',24.368,-76.621,12,'2026-06-01','true'],['Richat Structure',21.124,-11.402,11,'2026-03-15','false'],['Sossusvlei dunes',-24.727,15.34,12,'2026-08-10','swir'],['Lena Delta',73.05,126.85,10,'2026-07-20','false']];
const S={lat:47.32533,lng:-2.35279,widthM:80000},G={exposure:4,contrast:14,saturation:20,vibrance:15,warmth:0,vignette:12},Q=[];
let mode='false',tok,exp=0,ctl,tmr,raw=null,raf;

const cl=v=>v<0?0:v>255?255:v,esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])),CAT='https://sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0/search';
let T={x:0,y:0,k:1},L={lat:S.lat,lng:S.lng,widthM:S.widthM},ccSkip='',AV={},avk='',avp=null,cfg={q:960,xh:'plus',xs:44,zs:1,g:1};
