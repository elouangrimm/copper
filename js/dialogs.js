// Settings and API key dialogs.

function applyCfg(){try{localStorage.copper=JSON.stringify(cfg)}catch(e){}$('#xh').className=cfg.xh;$('#xh').style.setProperty('--xs',cfg.xs+'px');$('#grid').style.display=cfg.g?'':'none';$('#sqv').textContent=cfg.q+' px wide';$('#xt').classList.toggle('on',cfg.xh!=='off')}
function loadCfg(){try{Object.assign(cfg,JSON.parse(localStorage.copper||'{}'))}catch(e){}$('#sq').value=cfg.q;$('#sxs').value=cfg.xs;$('#szs').value=cfg.zs;$('#sg').checked=!!cfg.g;pick('sxh',cfg.xh);applyCfg()}
chips('sxh',[['off','Off'],['plus','Plus'],['dot','Dot'],['ring','Ring']],'plus',k=>{cfg.xh=k;applyCfg()});
$('#sq').oninput=e=>{cfg.q=+e.target.value;applyCfg()};$('#sq').onchange=()=>preview(0);
$('#sxs').oninput=e=>{cfg.xs=+e.target.value;applyCfg()};$('#szs').oninput=e=>{cfg.zs=+e.target.value;applyCfg()};$('#sg').onchange=e=>{cfg.g=+e.target.checked;applyCfg()};
$('#sb').onclick=()=>$('#sd').showModal();$('#sx').onclick=()=>$('#sd').close();
$('#xt').onclick=()=>{cfg.xh=cfg.xh==='off'?'plus':'off';pick('sxh',cfg.xh);applyCfg()};

function keyUI(){const ok=ls('cid')&&ls('sec');$('#dot').className=ok?'ok':'';$('#kt').textContent=ok?'API key saved':'Add API key'}
$('#cid').value=ls('cid');$('#sec').value=ls('sec');keyUI();
$('#kb').onclick=()=>$('#kd').showModal();$('#kx').onclick=()=>$('#kd').close();
$('#ks').onclick=async()=>{tok=null;$('#km').textContent='Checking…';try{await token();localStorage.cid=$('#cid').value.trim();localStorage.sec=$('#sec').value.trim();keyUI();$('#kd').close();preview()}catch(e){$('#km').textContent=e.message}};
$('#kc').onclick=()=>{try{localStorage.removeItem('cid');localStorage.removeItem('sec')}catch(e){}$('#cid').value=$('#sec').value='';tok=null;keyUI();$('#km').textContent='Key removed.'};
