// Colour grading, applied to the preview and to every exported tile.

function grade(im,g,ox,oy,W,H){const d=im.data,w=im.width,h=im.height,ex=2**(g.exposure/50),ct=(g.contrast+100)/100,sa=(g.saturation+100)/100,vb=g.vibrance/100,wm=g.warmth/2,vg=g.vignette/100*.75,mx0=W/2,my0=H/2,R=Math.hypot(mx0,my0);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;let r=cl((d[i]*ex-128)*ct+128+wm),q=cl((d[i+1]*ex-128)*ct+128),b=cl((d[i+2]*ex-128)*ct+128-wm);
  const hi=Math.max(r,q,b),lo=Math.min(r,q,b),av=(r+q+b)/3,k=Math.max(0,sa*(1+vb*(1-(hi>8?(hi-lo)/hi:0))));r=av+(r-av)*k;q=av+(q-av)*k;b=av+(b-av)*k;
  if(vg){const t=Math.max(0,Math.hypot(ox+x-mx0,oy+y-my0)/R-.45)/.55,f=1-vg*t*t;r*=f;q*=f;b*=f}d[i]=r;d[i+1]=q;d[i+2]=b}}
function paint(){if(!raw)return;const im=new ImageData(new Uint8ClampedArray(raw.data),raw.width,raw.height);grade(im,G,0,0,raw.width,raw.height);cx.putImageData(im,0,0)}
function repaint(){cancelAnimationFrame(raf);raf=requestAnimationFrame(paint)}
