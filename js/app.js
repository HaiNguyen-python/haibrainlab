// HaiBrainLab application script (simulations, lessons, tabs). The 3D module stays inline in index.html so the page also works when opened from a file.
'use strict';
// ------------------------------------------------------------ utilities
const $ = id => document.getElementById(id);
// ------------------------------------------------------------ i18n
const LANG=(()=>{ try{ const q=new URLSearchParams(location.search).get('lang'); if(q){ localStorage.setItem('brainlab.lang',q); return q; } return localStorage.getItem('brainlab.lang')||'en'; }catch(e){ return 'en'; } })();
const T=(window.I18N&&window.I18N[LANG])||null;
function t(key,fallback){ return (T&&T.ui&&T.ui[key]!==undefined)?T.ui[key]:fallback; }
function tr(name,val){ if(!T||!T.data||T.data[name]===undefined) return val; const v=T.data[name]; return typeof v==='function'?v(val):v; }
function applyTextMap(){ if(!T||!T.text) return; const sel='nav button, h1, h2, h3, label, button, option, .pill, th, .pathgrid b, .pathgrid span, .keyfacts b, .toc a, .scale span, #liveOverlay b, #liveOverlay span, .ctl label, .scale';
  document.querySelectorAll(sel).forEach(el=>{ const kids=[...el.childNodes]; const txtNodes=kids.filter(n=>n.nodeType===3&&n.textContent.trim());
    if(kids.length===1&&txtNodes.length===1){ const k=el.textContent.trim(); if(T.text[k]!==undefined) el.textContent=T.text[k]; }
    else if(txtNodes.length){ txtNodes.forEach(n=>{ const k=n.textContent.trim(); if(T.text[k]!==undefined) n.textContent=n.textContent.replace(k,T.text[k]); }); }
    if(el.title&&T.text[el.title]) el.title=T.text[el.title]; if(el.placeholder&&T.text[el.placeholder]) el.placeholder=T.text[el.placeholder]; }); }
function applyI18N(phase){ if(!T) return; document.documentElement.lang=LANG; const map=phase==='early'?T.html:T.late; if(map) for(const id in map){ const el=$(id); if(el) el.innerHTML=map[id]; } if(phase==='early') applyTextMap(); }
applyI18N('early');
window.setLang=l=>{ try{ localStorage.setItem('brainlab.lang',l); }catch(e){} try{ const u=new URL(location.href); if(u.searchParams.has('lang')){ u.searchParams.set('lang',l); location.href=u.toString(); return; } }catch(e){} location.reload(); };
(function langToggle(){ const box=$('langToggle'); if(!box) return; box.querySelectorAll('button').forEach(b=>{ b.classList.toggle('on',b.dataset.lang===LANG); b.addEventListener('click',()=>{ if(b.dataset.lang!==LANG) setLang(b.dataset.lang); }); }); })();
const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));
function randn(){ let u=0,v=0; while(u===0)u=Math.random(); while(v===0)v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function bindRange(id, fmt, cb){ const el=$(id), o=$(id+'_o'); const f=()=>{ if(o) o.textContent = fmt?fmt(+el.value):el.value; }; el.addEventListener('input',()=>{f(); cb&&cb(+el.value);}); f(); return el; }
function setRange(id,v){ const el=$(id); el.value=v; el.dispatchEvent(new Event('input')); }

// Canvas with devicePixelRatio handling
// Resizes the backing store only when the CSS size really changed (rounded, so fractional device pixel ratios such as 1.25 never cause a resize every frame).
function setupCanvas(c){ const r=c.getBoundingClientRect(); const dpr=window.devicePixelRatio||1; const w=Math.max(10,Math.floor(r.width)); if(c._h===undefined) c._h=c.height; const h=c._h; const W=Math.round(w*dpr), Hh=Math.round(h*dpr); if(c.width!==W||c.height!==Hh){ c.width=W; c.height=Hh; c.style.height=h+'px'; } const ctx=c.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); return {ctx,w,h}; }

// generic line plot: series = [{data, x?, color, width, label, fill?, dash?}], x axis in [x0,x1], y in [y0,y1]
// opts: title, xlabel, hlines[{y,color,label}], vspans[{a,b,color}], bands[{a,b,color,label}], annotations[{x,y,text,dx,dy,color}], cursor (x value)
function plot(c, series, opts){
  const {ctx,w,h}=setupCanvas(c); const o=Object.assign({x0:0,x1:1,y0:-1,y1:1,title:'',xlabel:'',ylabel:'',pad:{l:46,r:12,t:18,b:22},hlines:[],vspans:[],bands:[],annotations:[],cursor:null},opts||{});
  const hasLegend=series.some(s=>s.label); const p=Object.assign({},o.pad); if(hasLegend && h>=120) p.t=Math.max(p.t,34); ctx.clearRect(0,0,w,h);
  const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#0d1322'); bg.addColorStop(1,'#080b12'); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  const pw=w-p.l-p.r, ph=h-p.t-p.b; const X=x=>p.l+(x-o.x0)/(o.x1-o.x0)*pw, Y=y=>p.t+(1-(y-o.y0)/(o.y1-o.y0))*ph;
  for(const s of o.vspans){ ctx.fillStyle=s.color; ctx.fillRect(X(s.a),p.t,X(s.b)-X(s.a),ph); }
  for(const b of o.bands){ ctx.fillStyle=b.color; ctx.fillRect(X(b.a),p.t,X(b.b)-X(b.a),ph); ctx.fillStyle='#8e9bb3'; ctx.font='10px Inter, system-ui'; ctx.textAlign='center'; ctx.fillText(b.label,(X(b.a)+X(b.b))/2,p.t+10); }
  ctx.strokeStyle='#1a2235'; ctx.lineWidth=1; ctx.setLineDash([3,4]); ctx.beginPath();
  const ny=h<100?2:4; for(let i=0;i<=ny;i++){ const y=p.t+i*ph/ny; ctx.moveTo(p.l,y); ctx.lineTo(w-p.r,y);} const nx=5; for(let i=1;i<nx;i++){ const x=p.l+i*pw/nx; ctx.moveTo(x,p.t); ctx.lineTo(x,p.t+ph);} ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle='#2a3550'; ctx.beginPath(); ctx.moveTo(p.l,p.t); ctx.lineTo(p.l,p.t+ph); ctx.lineTo(w-p.r,p.t+ph); ctx.stroke();
  ctx.fillStyle='#8e9bb3'; ctx.font='11px Inter, system-ui'; ctx.textAlign='right';
  for(let i=0;i<=ny;i++){ const v=o.y1-(o.y1-o.y0)*i/ny; ctx.fillText(fmtNum(v),p.l-5,p.t+i*ph/ny+4); }
  ctx.textAlign='center'; for(let i=0;i<=nx;i++){ const v=o.x0+(o.x1-o.x0)*i/nx; ctx.fillText(fmtNum(v),X(v),h-6); }
  for(const hl of o.hlines){ ctx.strokeStyle=hl.color||'#555'; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(p.l,Y(hl.y)); ctx.lineTo(w-p.r,Y(hl.y)); ctx.stroke(); ctx.setLineDash([]); if(hl.label){ctx.fillStyle=hl.color||'#888';ctx.textAlign='left';ctx.font='10.5px Inter, system-ui';ctx.fillText(hl.label,p.l+4,Y(hl.y)-3);} }
  ctx.save(); ctx.beginPath(); ctx.rect(p.l,p.t,pw,ph); ctx.clip();
  for(const s of series){ const d=s.data; if(!d||d.length<2) continue; const n=d.length; const xs=s.x; const yc=v=>Y(clamp(v,o.y0-(o.y1-o.y0),o.y1+(o.y1-o.y0)));
    const trace=()=>{ ctx.beginPath(); for(let i=0;i<n;i++){ const x=xs?xs[i]:o.x0+(o.x1-o.x0)*i/(n-1); const y=yc(d[i]); if(i===0) ctx.moveTo(X(x),y); else ctx.lineTo(X(x),y); } };
    if(s.fill){ trace(); const xl=xs?xs[n-1]:o.x1, xf=xs?xs[0]:o.x0; ctx.lineTo(X(xl),p.t+ph); ctx.lineTo(X(xf),p.t+ph); ctx.closePath(); const g=ctx.createLinearGradient(0,p.t,0,p.t+ph); g.addColorStop(0,s.color+'66'); g.addColorStop(1,s.color+'00'); ctx.fillStyle=g; ctx.fill(); }
    trace(); ctx.strokeStyle=s.color; ctx.lineWidth=s.width||1.6; if(s.dash) ctx.setLineDash(s.dash); ctx.shadowColor=s.color; ctx.shadowBlur=s.glow===false?0:5; ctx.stroke(); ctx.shadowBlur=0; ctx.setLineDash([]); }
  ctx.restore();
  if(o.cursor!==null&&o.cursor!==undefined){ const cx=X(o.cursor); ctx.strokeStyle='#ffffffb0'; ctx.lineWidth=1.2; ctx.setLineDash([2,3]); ctx.beginPath(); ctx.moveTo(cx,p.t); ctx.lineTo(cx,p.t+ph); ctx.stroke(); ctx.setLineDash([]); }
  for(const a of o.annotations){ const ax=X(a.x), ay=Y(a.y), tx=ax+(a.dx||30), ty=ay+(a.dy||-24); ctx.strokeStyle=a.color||'#c9d2e3'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(tx,ty); ctx.stroke(); ctx.fillStyle=a.color||'#c9d2e3'; ctx.beginPath(); ctx.arc(ax,ay,3,0,Math.PI*2); ctx.fill(); ctx.font='600 11px Inter, system-ui'; ctx.textAlign=(a.dx||30)<0?'right':'left'; ctx.fillText(a.text,tx+((a.dx||30)<0?-3:3),ty+4); }
  ctx.fillStyle='#e6ecf5'; ctx.font='600 12.5px Outfit, Inter, system-ui'; ctx.textAlign='left'; ctx.fillText(o.title,p.l,13);
  ctx.fillStyle='#8e9bb3'; ctx.font='11px Inter, system-ui'; ctx.textAlign='right'; ctx.fillText(o.xlabel,w-p.r,h-6);
  const ly=(hasLegend && h>=120)?27:13; let lx=w-p.r-2; ctx.textAlign='right'; ctx.font='11px Inter, system-ui';
  for(let k=series.length-1;k>=0;k--){ const s=series[k]; if(!s.label) continue; ctx.fillStyle='#c9d2e3'; ctx.fillText(s.label,lx,ly); const tw=ctx.measureText(s.label).width; ctx.fillStyle=s.color; ctx.fillRect(lx-tw-16,ly-6,11,4); lx-=tw+26; }
  return {X,Y,ctx,w,h,p};
}
function fmtNum(v){ const a=Math.abs(v); if(a>=100) return Math.round(v).toString(); if(a>=10) return (Math.round(v*10)/10).toString(); return (Math.round(v*100)/100).toString(); }

// ------------------------------------------------------------ tabs
document.querySelectorAll('#nav button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#nav button').forEach(x=>x.classList.toggle('active',x===b));
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.id==='tab-'+b.dataset.tab));
  activeTab=b.dataset.tab; if(activeTab==='neuron') neuronRun(); if(activeTab==='synapse'){ synDraw(); stdpDraw(); } if(activeTab==='network') netDrawAll(); if(activeTab==='lang'&&typeof runSim==='function') runSim(); if(activeTab==='code'&&typeof runCE==='function') runCE();
  window.scrollTo({top:0});
}));
let activeTab='start';

// ============================================================ 1. NEURON MODELS
const HH={C:1,gNa:120,gK:36,gL:0.3,ENa:50,EK:-77,EL:-54.387};
function safeDiv(x,y){ return Math.abs(y)<1e-7 ? 1 : x/y; } // handles 0/0 limits in rate functions
function hhRates(V){
  const am = Math.abs(V+40)<1e-6 ? 1 : 0.1*(V+40)/(1-Math.exp(-(V+40)/10));
  const bm = 4*Math.exp(-(V+65)/18);
  const ah = 0.07*Math.exp(-(V+65)/20);
  const bh = 1/(1+Math.exp(-(V+35)/10));
  const an = Math.abs(V+55)<1e-6 ? 0.1 : 0.01*(V+55)/(1-Math.exp(-(V+55)/10));
  const bn = 0.125*Math.exp(-(V+65)/80);
  return {am,bm,ah,bh,an,bn};
}
const IZH_PRESETS={RS:[0.02,0.2,-65,8],IB:[0.02,0.2,-55,4],CH:[0.02,0.2,-50,2],FS:[0.1,0.2,-65,2],LTS:[0.02,0.25,-65,2],TC:[0.02,0.25,-65,0.05],RZ:[0.1,0.26,-65,2]};

// simulate one neuron for T ms; returns {t, V, g1, g2, g3, I, spikes, rest}
function simNeuron(P){
  const T=200, model=P.model;
  const dt = model==='hh'?0.01:0.1; const steps=Math.round(T/dt); const keep = model==='hh'?5:1; const n=Math.floor(steps/keep)+1;
  const t=new Float32Array(n), V=new Float32Array(n), g1=new Float32Array(n), g2=new Float32Array(n), g3=new Float32Array(n), Ic=new Float32Array(n);
  const spikes=[]; let k=0;
  // scale current per model so one slider works for all
  const Iscale = model==='hh'?1 : model==='lif'? 1 : 1;
  const Ifn = (tm)=> (tm>=P.t0 && tm<P.t0+P.dur ? P.I*Iscale : 0) + (P.noise? P.noise*randn()*(model==='hh'?3:1) : 0);
  if(model==='hh'){
    let v=-65; let r=hhRates(v); let m=r.am/(r.am+r.bm), h=r.ah/(r.ah+r.bh), nn=r.an/(r.an+r.bn); let above=false;
    const gNa=HH.gNa*P.gNa, gK=HH.gK*P.gK, gL=HH.gL*P.gL;
    for(let s=0;s<=steps;s++){ const tm=s*dt; const I=Ifn(tm);
      r=hhRates(v);
      const INa=gNa*m*m*m*h*(v-HH.ENa), IK=gK*nn*nn*nn*nn*(v-HH.EK), IL=gL*(v-HH.EL);
      const dv=(I-INa-IK-IL)/HH.C;
      m+=dt*(r.am*(1-m)-r.bm*m); h+=dt*(r.ah*(1-h)-r.bh*h); nn+=dt*(r.an*(1-nn)-r.bn*nn); v+=dt*dv;
      if(v>0&&!above){above=true;spikes.push(tm);} if(v<-20) above=false;
      if(s%keep===0){ t[k]=tm; V[k]=v; g1[k]=m; g2[k]=h; g3[k]=nn; Ic[k]=I; k++; }
    }
  } else if(model==='lif'){
    const EL=-65, R=1; let v=EL, ref=0; // I in "mV equivalents": R*I
    for(let s=0;s<=steps;s++){ const tm=s*dt; const I=Ifn(tm)*1.2;
      if(ref>0){ ref-=dt; v=P.lReset; } else { v+=dt*(-(v-EL)+R*I)/P.lTau; if(v>=P.lTh){ spikes.push(tm); v=20; ref=P.lRef; if(ref<=0) v=P.lReset; } }
      t[k]=tm; V[k]=v; g1[k]=P.lTh; Ic[k]=I; k++; if(v===20) v=P.lReset;
    }
  } else {
    let v=-65, u=P.iB*v; const a=P.iA,b=P.iB,c=P.iC,d=P.iD;
    for(let s=0;s<=steps;s++){ const tm=s*dt; const I=Ifn(tm);
      if(v>=30){ spikes.push(tm); v=c; u+=d; }
      v+=dt*(0.04*v*v+5*v+140-u+I); u+=dt*a*(b*v-u); if(v>30) v=30;
      t[k]=tm; V[k]=v; g1[k]=u; Ic[k]=I; k++;
    }
  }
  return {t:t.subarray(0,k),V:V.subarray(0,k),g1:g1.subarray(0,k),g2:g2.subarray(0,k),g3:g3.subarray(0,k),I:Ic.subarray(0,k),spikes,T,n:k};
}
function neuronParams(){ return {model:$('nModel').value, I:+$('nI').value, t0:+$('nT0').value, dur:+$('nDur').value, noise:+$('nNoise').value,
  gNa:+$('gNa').value,gK:+$('gK').value,gL:+$('gL').value, lTau:+$('lTau').value,lTh:+$('lTh').value,lRef:+$('lRef').value,lReset:-65, iA:+$('iA').value,iB:+$('iB').value,iC:+$('iC').value,iD:+$('iD').value}; }
let lastSim=null;
function neuronRun(){ const P=neuronParams(); const r=simNeuron(P); lastSim=Object.assign({P},r); renderNeuron(); }
function renderNeuron(){ if(!lastSim) return; const r=lastSim, P=r.P;
  $('hhCtl').style.display=P.model==='hh'?'':'none'; $('lifCtl').style.display=P.model==='lif'?'':'none'; $('izhCtl').style.display=P.model==='izh'?'':'none';
  const unit=P.model==='hh'?'µA/cm²':'(a.u.)'; $('nI_o').textContent=P.I+' '+unit;
  const span=[{a:P.t0,b:P.t0+P.dur,color:'rgba(255,138,101,0.07)'}]; const cur=+$('nCur').value; $('nCur_o').textContent=cur.toFixed(1)+' ms';
  const ann=[]; // phase labels live in the Start-here figure and the membrane view below; the trace stays clean
  plot($('nV'),[{data:r.V,x:r.t,color:'#4fc3f7',label:'membrane potential',fill:true,width:1.8}],{x0:0,x1:r.T,y0:-90,y1:50,title:'Membrane potential (mV)',xlabel:'time (ms)',vspans:span,annotations:ann,cursor:cur,hlines:[{y:-65,color:'#3b4a6b',label:'rest'},...(P.model==='hh'?[{y:50,color:'#5a3030',label:'E_Na'},{y:-77,color:'#2f4a5a',label:'E_K'}]:[{y:P.model==='lif'?P.lTh:30,color:'#ff6b81',label:'threshold'}])]});
  if(P.model==='hh') plot($('nG'),[{data:r.g1,x:r.t,color:'#ff8a65',label:'m (Na⁺ activation)'},{data:r.g2,x:r.t,color:'#ffd166',label:'h (Na⁺ inactivation)'},{data:r.g3,x:r.t,color:'#66d9a8',label:'n (K⁺ activation)'}],{x0:0,x1:r.T,y0:0,y1:1,title:'Gating variables (fraction of channel gates open)',xlabel:'time (ms)',vspans:span,cursor:cur});
  else if(P.model==='lif') plot($('nG'),[{data:r.V,x:r.t,color:'#4fc3f7',fill:true},{data:r.g1,x:r.t,color:'#ff6b81',label:'threshold',dash:[4,4]}],{x0:0,x1:r.T,y0:-70,y1:-40,title:'Zoom: integration below threshold',xlabel:'time (ms)',vspans:span,cursor:cur});
  else plot($('nG'),[{data:r.g1,x:r.t,color:'#ffd166',label:'u (recovery variable)',fill:true}],{x0:0,x1:r.T,y0:-20,y1:30,title:'Recovery variable u (slow negative feedback)',xlabel:'time (ms)',vspans:span,cursor:cur});
  plot($('nIc'),[{data:r.I,x:r.t,color:'#ff8a65',label:'injected current',fill:true}],{x0:0,x1:r.T,y0:-5,y1:35,title:'Stimulus',xlabel:'time (ms)',pad:{l:46,r:12,t:16,b:18},cursor:cur});
  $('nSpk').textContent=r.spikes.length; $('nRate').textContent=(r.spikes.length/(P.dur/1000)).toFixed(1);
  $('nLat').textContent=r.spikes.length?(r.spikes[0]-P.t0).toFixed(1)+' ms after onset':'–'; $('nRest').textContent=r.V[Math.round(r.n*0.05)].toFixed(1);
  drawMembrane(); if(typeof drawIzhPhase==='function') drawIzhPhase(); if(typeof renderEquations==='function' && typeof eqOpen!=='undefined') renderEquations();
}
// ---- membrane cross-section: ion channels opening and closing at the cursor time
const ionSeed=Array.from({length:40},(_,i)=>[(i*0.618033)%1,((i*0.381966)+0.17)%1]);
function drawMembrane(){ const c=$('nMem'); const {ctx,w,h}=setupCanvas(c); const r=lastSim; const P=r.P;
  const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#0f1a2e'); bg.addColorStop(0.5,'#0d1322'); bg.addColorStop(1,'#0e1a1a'); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  if(P.model!=='hh'){ ctx.fillStyle='#8e9bb3'; ctx.font='13px Inter, system-ui'; ctx.textAlign='center'; ctx.fillText('Switch the model to Hodgkin–Huxley to watch the sodium and potassium channels open and close.',w/2,h/2); return; }
  const t=+$('nCur').value; const i=Math.min(r.n-1,Math.max(0,Math.round(t/r.T*(r.n-1)))); const V=r.V[i], m=r.g1[i], hh=r.g2[i], n=r.g3[i]; const pNa=m*m*m*hh, pK=n*n*n*n;
  const INa=HH.gNa*P.gNa*pNa*(V-HH.ENa), IK=HH.gK*P.gK*pK*(V-HH.EK); const dV=r.V[Math.min(r.n-1,i+2)]-r.V[Math.max(0,i-2)];
  const memY=h*0.47, memH=24, now=performance.now()/1000;
  ctx.font='bold 9px Inter, system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ionSeed.forEach(([u,v],k)=>{ const x=20+u*(w-40); if(k<26){ const y=22+v*(memY-34); ctx.fillStyle='rgba(255,138,101,0.75)'; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#1a0d08'; ctx.fillText('+',x,y+0.5); } else { const y=memY+memH+18+v*(h-memY-memH-36); ctx.fillStyle='rgba(102,217,168,0.7)'; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#07140d'; ctx.fillText('+',x,y+0.5); } });
  ctx.textBaseline='alphabetic';
  const mg=ctx.createLinearGradient(0,memY,0,memY+memH); mg.addColorStop(0,'#55688f'); mg.addColorStop(0.5,'#2a3550'); mg.addColorStop(1,'#55688f'); ctx.fillStyle=mg; ctx.fillRect(0,memY,w,memH);
  ctx.fillStyle='#8da0c8'; for(let x=4;x<w;x+=10){ ctx.beginPath(); ctx.arc(x,memY+3,3,0,Math.PI*2); ctx.arc(x,memY+memH-3,3,0,Math.PI*2); ctx.fill(); }
  const chans=[[0.16,'na'],[0.3,'na'],[0.44,'na'],[0.6,'k'],[0.74,'k'],[0.88,'k']];
  for(const [fx,kind] of chans){ const x=fx*w; const open=kind==='na'?pNa:pK; const col=kind==='na'?'#ff8a65':'#66d9a8'; const gap=2+16*Math.min(1,open*(kind==='na'?3:1.6)); const cw=14;
    ctx.fillStyle='#0b0f17'; ctx.fillRect(x-cw-gap/2-2,memY-6,cw*2+gap+4,memH+12);
    ctx.fillStyle=col; ctx.beginPath(); ctx.roundRect(x-cw-gap/2,memY-6,cw,memH+12,4); ctx.fill(); ctx.beginPath(); ctx.roundRect(x+gap/2,memY-6,cw,memH+12,4); ctx.fill();
    if(kind==='na'&&hh<0.35){ ctx.fillStyle='#ffd166'; ctx.beginPath(); ctx.arc(x,memY+memH+2,5,0,Math.PI*2); ctx.fill(); }
    const I=kind==='na'?-INa:IK; const mag=Math.min(1,Math.abs(I)/250); if(open>0.02&&mag>0.03){ const dir=kind==='na'?1:-1; ctx.strokeStyle=col; ctx.lineWidth=1+5*mag; ctx.globalAlpha=0.35+0.65*mag; ctx.beginPath(); ctx.moveTo(x,memY-30*dir-(dir>0?10:-10)); ctx.lineTo(x,memY+memH+30*dir+(dir>0?10:-10)); ctx.stroke(); ctx.globalAlpha=1;
      for(let k=0;k<3;k++){ const ph=((now*2.2+k/3)%1); const y=dir>0?(memY-22+ph*(memH+44)):(memY+memH+22-ph*(memH+44)); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,4+3*mag,0,Math.PI*2); ctx.fill(); } } }
  ctx.fillStyle='#c9d2e3'; ctx.font='600 11px Inter, system-ui'; ctx.textAlign='left'; ctx.fillText('OUTSIDE the cell · Na⁺ high',10,16); ctx.fillText('INSIDE the cell · K⁺ high',10,h-8);
  ctx.textAlign='center'; ctx.fillStyle='#ff8a65'; ctx.fillText('Na⁺ channels (m³h open = '+(pNa*100).toFixed(0)+'%)',0.3*w,memY+memH+34); ctx.fillStyle='#66d9a8'; ctx.fillText('K⁺ channels (n⁴ open = '+(pK*100).toFixed(0)+'%)',0.74*w,memY+memH+34);
  let phase,pc; if(V>15&&dV>-2) {phase='PEAK: Na⁺ gates inactivate (h closes)';pc='#ff8a65';} else if(dV>3&&V>-55){phase='RISING: Na⁺ rushes in';pc='#ff8a65';} else if(dV<-3&&V>-72){phase='FALLING: K⁺ leaves the cell';pc='#66d9a8';} else if(V<-70){phase='UNDERSHOOT: K⁺ channels still open';pc='#4fc3f7';} else if(dV>0.3){phase='DEPOLARISING toward threshold';pc='#ffd166';} else {phase='RESTING: pumps hold −65 mV';pc='#c9d2e3';}
  ctx.fillStyle='rgba(10,14,22,0.75)'; ctx.beginPath(); ctx.roundRect(w-228,8,220,58,8); ctx.fill(); ctx.strokeStyle='#26314a'; ctx.stroke();
  ctx.textAlign='left'; ctx.fillStyle='#fff'; ctx.font='700 20px Outfit, Inter, system-ui'; ctx.fillText(V.toFixed(1)+' mV',w-218,32); ctx.font='11px Inter, system-ui'; ctx.fillStyle='#8e9bb3'; ctx.fillText('t = '+t.toFixed(1)+' ms',w-120,32); ctx.fillStyle=pc; ctx.font='600 11px Inter, system-ui'; ctx.fillText(phase,w-218,54);
}
let spikeAnim=null;
$('nPlaySpike').addEventListener('click',()=>{ if(!lastSim) return; if(spikeAnim){ cancelAnimationFrame(spikeAnim); spikeAnim=null; } const ts=lastSim.spikes.length?lastSim.spikes[0]:lastSim.P.t0+2; const a=Math.max(0,ts-3), b=Math.min(lastSim.T,ts+9); const dur=6000; const t0=performance.now();
  const step=()=>{ const u=Math.min(1,(performance.now()-t0)/dur); $('nCur').value=(a+(b-a)*u).toFixed(2); renderNeuron(); if(u<1) spikeAnim=requestAnimationFrame(step); else spikeAnim=null; }; step(); });
$('nCur').addEventListener('input',()=>renderNeuron());
['nI','nT0','nDur','nNoise','gNa','gK','gL','lTau','lTh','lRef','iA','iB','iC','iD'].forEach(id=>bindRange(id,null,neuronRun));
$('nModel').addEventListener('change',()=>{ $('nFIc').style.display='none'; neuronRun(); });
$('izhPreset').addEventListener('change',()=>{ const p=IZH_PRESETS[$('izhPreset').value]; setRange('iA',p[0]);setRange('iB',p[1]);setRange('iC',p[2]);setRange('iD',p[3]); });
$('nReset').addEventListener('click',()=>{ setRange('nI',10);setRange('nT0',20);setRange('nDur',100);setRange('nNoise',0);setRange('gNa',1);setRange('gK',1);setRange('gL',1);setRange('lTau',10);setRange('lTh',-50);setRange('lRef',2);$('izhPreset').value='RS';$('izhPreset').dispatchEvent(new Event('change')); $('nFIc').style.display='none'; });
$('nFI').addEventListener('click',()=>{
  const P=neuronParams(); P.noise=0; P.t0=0; P.dur=200; const xs=[],ys=[];
  for(let I=0;I<=30;I+=1){ P.I=I; const r=simNeuron(P); xs.push(I); ys.push(r.spikes.length/0.2); }
  $('nFIc').style.display=''; plot($('nFIc'),[{data:ys,x:xs,color:'#66d9a8',width:2,label:'firing rate'}],{x0:0,x1:30,y0:0,y1:Math.max(50,Math.ceil(Math.max(...ys)/50)*50),title:'f–I curve: how firing rate depends on input current',xlabel:'injected current'});
});

// ============================================================ 2. SYNAPSE
const syn={V:-65,g:0,spk:0,ves:0,t:0,hist:new Float32Array(600),histI:new Float32Array(600),particles:[],ap:null,lastSpikeT:-1e9,auto:false,queue:[]};
syn.hist.fill(-65);
const sAnim=$('sAnim');
function synStep(dtms){ // conductance-based LIF
  const type=$('sType').value, w=+$('sW').value, tau=+$('sTau').value; const Esyn=type==='exc'?0:-80; const gmax=type==='exc'?0.9:1.6;
  const sub=10; const h=dtms/sub;
  for(let i=0;i<sub;i++){
    syn.t+=h;
    // release queued presynaptic spikes
    while(syn.queue.length && syn.queue[0]<=syn.t){ syn.queue.shift(); synRelease(); }
    // conductance arrives ~1.5 ms after vesicle release
    const pending=syn.particles.filter(p=>!p.done && syn.t-p.t0>1.5); for(const p of pending){ p.done=true; syn.g+=gmax*w/3; }
    syn.g-= h*syn.g/tau;
    const Isyn=syn.g*(Esyn-syn.V);
    if(syn.refr>0){ syn.refr-=h; syn.V=-65; } else { syn.V+= h*(-(syn.V+65)+ Isyn*10)/10; if(syn.V>=-50){ syn.V=20; syn.spk++; syn.refr=2; } }
  }
  syn.hist.copyWithin(0,1); syn.hist[599]=syn.V; syn.histI.copyWithin(0,1); syn.histI[599]=syn.g;
  if(syn.V===20) syn.V=-65;
}
function synRelease(){ syn.ap={t0:syn.t}; for(let i=0;i<3;i++) syn.particles.push({t0:syn.t,y:50+Math.random()*60,done:false}); syn.ves+=3; }
function synFire(){ syn.queue.push(syn.t); }
$('sFire').addEventListener('click',synFire);
$('sBurst').addEventListener('click',()=>{ for(let i=0;i<5;i++) syn.queue.push(syn.t+i*10); });
$('sAuto').addEventListener('change',e=>syn.auto=e.target.checked);
['sW','sTau'].forEach(id=>bindRange(id));
let synLastAuto=0;
function synDraw(){
  const type=$('sType').value; const {ctx,w,h}=setupCanvas(sAnim); const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#0d1322'); bg.addColorStop(1,'#080b12'); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  const cx=w/2, cy=h*0.52; const col=type==='exc'?'#ff8a65':'#4fc3f7'; const now=performance.now()/1000; const gOpen=Math.min(1,syn.g/0.8);
  const ag=ctx.createLinearGradient(0,cy-14,0,cy+14); ag.addColorStop(0,'#3d5485'); ag.addColorStop(0.5,'#2a3b5c'); ag.addColorStop(1,'#1c2842'); ctx.fillStyle=ag; ctx.beginPath(); ctx.roundRect(10,cy-14,cx-100,28,14); ctx.fill();
  if(syn.ap){ const age=syn.t-syn.ap.t0; const x=14+age*130; if(x<cx-70){ const g=ctx.createLinearGradient(x-30,0,x+14,0); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(1,'rgba(255,255,255,0.95)'); ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(x-30,cy-12,44,24,12); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='600 10px Inter, system-ui'; ctx.textAlign='center'; ctx.fillText('spike',x-6,cy-18); } else syn.ap=null; }
  const bgr=ctx.createRadialGradient(cx-70,cy-22,6,cx-55,cy,72); bgr.addColorStop(0,'#4a6aa5'); bgr.addColorStop(1,'#1b2a44'); ctx.fillStyle=bgr; ctx.beginPath(); ctx.ellipse(cx-52,cy,52,60,0,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#5a76ad'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.lineWidth=1.2; const pool=[[-82,-30],[-70,-42],[-56,-46],[-86,-4],[-72,-16],[-56,-26],[-80,22],[-66,34],[-50,30],[-64,8]]; for(const [dx,dy] of pool){ ctx.fillStyle='#6d82b0'; ctx.strokeStyle='#a9bbe0'; ctx.beginPath(); ctx.arc(cx+dx,cy+dy,6,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle=col; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(cx+dx,cy+dy,2.5,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
  const fusing=syn.particles.some(p=>syn.t-p.t0<0.6);
  [[-12,-24],[-9,0],[-12,24]].forEach(([dx,dy],k)=>{ ctx.fillStyle='#6d82b0'; ctx.strokeStyle='#a9bbe0'; ctx.beginPath(); if(fusing&&k===1){ ctx.arc(cx+dx+4,cy+dy,8,Math.PI*0.5,Math.PI*1.5); ctx.fill(); ctx.stroke(); } else { ctx.arc(cx+dx,cy+dy,6,0,Math.PI*2); ctx.fill(); ctx.stroke(); } });
  ctx.fillStyle='rgba(255,255,255,0.035)'; ctx.fillRect(cx-1,cy-64,22,128); ctx.fillStyle='#8e9bb3'; ctx.font='10px Inter, system-ui'; ctx.textAlign='center'; ctx.fillText('cleft 20 nm',cx+10,cy+72);
  const sg=ctx.createRadialGradient(cx+60,cy-16,6,cx+56,cy,52); sg.addColorStop(0,type==='exc'?'#3f7566':'#30587a'); sg.addColorStop(1,'#172626'); ctx.fillStyle=sg; ctx.beginPath(); ctx.ellipse(cx+56,cy,38,48,0,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#4f8373'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle='#223636'; ctx.beginPath(); ctx.roundRect(cx+86,cy-13,w-cx-96,26,13); ctx.fill();
  for(let k=0;k<5;k++){ const y=cy-40+k*20; const gap=1+7*gOpen; ctx.fillStyle=col; ctx.beginPath(); ctx.roundRect(cx+20,y-gap/2-7,6,7,2); ctx.fill(); ctx.beginPath(); ctx.roundRect(cx+20,y+gap/2,6,7,2); ctx.fill();
    if(gOpen>0.12){ const ph=(now*2.5+k*0.2)%1; const x=cx+16+ph*26; ctx.fillStyle=type==='exc'?'#ff8a65':'#4fc3f7'; ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#000'; ctx.font='bold 8px Inter, system-ui'; ctx.fillText(type==='exc'?'+':'−',x,y+3); } }
  syn.particles=syn.particles.filter(p=>syn.t-p.t0<3); ctx.shadowColor=col; ctx.shadowBlur=8; ctx.fillStyle=col;
  for(const p of syn.particles){ const age=syn.t-p.t0; const x=cx-2+Math.min(1,age/1.6)*22+Math.sin(age*9+p.y)*2; const y=cy+(p.y-80)*0.55; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); } ctx.shadowBlur=0;
  ctx.fillStyle='#c9d2e3'; ctx.font='600 11px Inter, system-ui'; ctx.textAlign='center'; ctx.fillText('presynaptic terminal',cx-52,cy+86); ctx.fillText('dendritic spine',cx+72,cy+86); ctx.fillStyle='#8e9bb3'; ctx.font='10px Inter, system-ui'; ctx.fillText('vesicles full of transmitter',cx-60,cy-74); ctx.fillText('receptors',cx+40,cy-60);
  ctx.fillStyle=col; ctx.font='600 12px Inter, system-ui'; ctx.textAlign='left'; ctx.fillText(type==='exc'?'Glutamate → AMPA receptors open → Na⁺ enters → the spine depolarises (EPSP)':'GABA → GABA-A receptors open → Cl⁻ enters → the spine hyperpolarises (IPSP)',12,h-8);
  plot($('sTrace'),[{data:syn.hist,color:'#4fc3f7',label:'postsynaptic V (mV)'},{data:Array.from(syn.histI,g=>-90+g*40),color:col,label:'synaptic conductance'}],{x0:-600,x1:0,y0:-95,y1:25,title:'Postsynaptic membrane potential (last 600 ms)',xlabel:'ms before now',hlines:[{y:-50,color:'#ff6b81',label:'spike threshold'},{y:-65,color:'#3b4a6b',label:'rest'}]});
  $('sVnow').textContent=syn.hist[599].toFixed(1); $('sSpk').textContent=syn.spk; $('sVes').textContent=syn.ves;
}
syn.refr=0;
function synLoop(){ if(activeTab==='synapse'){ if(syn.auto && syn.t-synLastAuto>=50){ synLastAuto=syn.t; synFire(); } synStep(1); synDraw(); } requestAnimationFrame(synLoop); }
requestAnimationFrame(synLoop);

// STDP
const stdp={Ap:0.01,Am:0.012,tp:20,tm:20,w:0.5,traj:[0.5]};
function stdpDw(dt){ return dt>0 ? stdp.Ap*Math.exp(-dt/stdp.tp) : -stdp.Am*Math.exp(dt/stdp.tm); }
function stdpDraw(){ const dtv=+$('stdpDt').value; const xs=[],ys=[]; for(let d=-50;d<=50;d++){ xs.push(d); ys.push(stdpDw(d)*100); }
  const g=plot($('stdpWin'),[{data:ys,x:xs,color:'#66d9a8',width:2,label:'Δw (%)'}],{x0:-50,x1:50,y0:-1.5,y1:1.5,title:'STDP window: weight change vs spike timing',xlabel:'Δt (ms)',hlines:[{y:0,color:'#3b4a6b'}],vspans:[{a:0,b:50,color:'rgba(102,217,168,0.06)'},{a:-50,b:0,color:'rgba(255,107,129,0.06)'}]});
  g.ctx.fillStyle='#ff6b81'; g.ctx.beginPath(); g.ctx.arc(g.X(dtv),g.Y(stdpDw(dtv)*100),5,0,Math.PI*2); g.ctx.fill();
  g.ctx.fillStyle='#8e9bb3'; g.ctx.font='11px system-ui'; g.ctx.textAlign='left'; g.ctx.fillText('LTD (pre after post)',g.X(-48),g.Y(-1.2)); g.ctx.textAlign='right'; g.ctx.fillText('LTP (pre before post)',g.X(48),g.Y(1.2));
  $('stdpDt_o').textContent=(dtv>0?'+':'')+dtv+' ms → Δw '+(stdpDw(dtv)*100).toFixed(2)+'%';
  plot($('stdpRun'),[{data:stdp.traj,color:'#ffd166',width:2,label:'synaptic weight'}],{x0:0,x1:Math.max(60,stdp.traj.length-1),y0:0,y1:1,title:'Weight over repeated pairings',xlabel:'pairing #'});
  $('stdpW').textContent=stdp.w.toFixed(2);
}
bindRange('stdpDt',null,stdpDraw);
$('stdpGo').addEventListener('click',()=>{ const dtv=+$('stdpDt').value; let i=0; const iv=setInterval(()=>{ const dw=stdpDw(dtv); stdp.w = clamp(stdp.w + (dw>0? dw*(1-stdp.w)*4 : dw*stdp.w*4),0,1); stdp.traj.push(stdp.w); stdpDraw(); if(++i>=60) clearInterval(iv); },25); });
$('stdpClr').addEventListener('click',()=>{ stdp.w=0.5; stdp.traj=[0.5]; stdpDraw(); });
stdpDraw();

// ============================================================ 3. NETWORK (Izhikevich 2003)
// Seeded random numbers (mulberry32) so that network runs are reproducible from the seed shown in the UI
let rngState=12345; function seedRng(s){ rngState=(Math.floor(s)>>>0)||1; }
function netRand(){ let t=(rngState+=0x6D2B79F5); t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }
function netRandn(){ let u=0,v=0; while(u===0)u=netRand(); while(v===0)v=netRand(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
const Ne=800, Ni=200, N=Ne+Ni; let netModel='izh', netN=N, netNe=Ne, netPop=N;
const net={a:new Float32Array(N),b:new Float32Array(N),c:new Float32Array(N),d:new Float32Array(N),v:new Float32Array(N),u:new Float32Array(N),S:new Float32Array(N*N),fired:[],t:0,running:true,
  rasterT:[],rasterN:[],rate:new Float32Array(1000),lfp:new Float32Array(1024),stimUntil:-1,spec:null};
function netInit(){ seedRng(+($('netSeed')&&$('netSeed').value)||12345); for(let i=0;i<N;i++){ const r=netRand(); if(i<Ne){ net.a[i]=0.02; net.b[i]=0.2; net.c[i]=-65+15*r*r; net.d[i]=8-6*r*r; } else { net.a[i]=0.02+0.08*r; net.b[i]=0.25-0.05*r; net.c[i]=-65; net.d[i]=2; } net.v[i]=-65; net.u[i]=net.b[i]*net.v[i]; }
  for(let i=0;i<N;i++) for(let j=0;j<N;j++) net.S[i*N+j] = j<Ne ? 0.5*netRand() : -netRand(); // S[i][j]: j -> i
  net.t=0; net.rasterT=[]; net.rasterN=[]; net.rate.fill(0); net.lfp.fill(-65); net.stimUntil=-1; net.spec=null; }
netInit();
const Ibuf=new Float32Array(N);
function netStepMs(){
  const wE=+$('wE').value, wI=+$('wI').value, nz=+$('nzIn').value; const stim=net.t<net.stimUntil;
  for(let i=0;i<N;i++) Ibuf[i]=(i<Ne?5:2)*nz*netRandn() + (stim && i<100 ? 15:0);
  const fired=[]; for(let i=0;i<N;i++) if(net.v[i]>=30){ fired.push(i); net.v[i]=net.c[i]; net.u[i]+=net.d[i]; }
  for(const j of fired){ const g = j<Ne?wE:wI; const base=j; for(let i=0;i<N;i++) Ibuf[i]+=g*net.S[i*N+base]; }
  let sumV=0;
  for(let i=0;i<N;i++){ let v=net.v[i], u=net.u[i], I=Ibuf[i]; v+=0.5*(0.04*v*v+5*v+140-u+I); v+=0.5*(0.04*v*v+5*v+140-u+I); u+=net.a[i]*(net.b[i]*v-u); if(v>30) v=30; net.v[i]=v; net.u[i]=u; if(i<Ne) sumV+=Math.min(v,30); }
  for(const j of fired){ net.rasterT.push(net.t); net.rasterN.push(j); }
  net.rate.copyWithin(0,1); net.rate[999]=fired.length; net.lfp.copyWithin(0,1); net.lfp[1023]=sumV/Ne; net.t++;
  // trim raster to the last 1000 ms
  let cut=0; while(cut<net.rasterT.length && net.rasterT[cut]<net.t-1000) cut++; if(cut>0){ net.rasterT.splice(0,cut); net.rasterN.splice(0,cut); }
}
function netSpectrum(){ // naive DFT of LFP, 1 ms sampling, 1..100 Hz
  const x=net.lfp, n=x.length; let mean=0; for(let i=0;i<n;i++) mean+=x[i]; mean/=n; const out=new Float32Array(100);
  for(let f=1;f<=100;f++){ let re=0,im=0; const wv=2*Math.PI*f/1000; for(let i=0;i<n;i++){ const s=(x[i]-mean)*(0.5-0.5*Math.cos(2*Math.PI*i/n)); re+=s*Math.cos(wv*i); im-=s*Math.sin(wv*i);} out[f-1]=Math.sqrt(re*re+im*im)/n; }
  return out;
}
let netFrame=0;
function netDrawAll(){ if(netModel==='brunel'&&netFrame%3!==0){ return; }
  const {ctx,w,h}=setupCanvas($('raster')); ctx.fillStyle='#0a0e16'; ctx.fillRect(0,0,w,h); const p={l:46,r:10,t:18,b:22};
  ctx.fillStyle='#e6ecf5'; ctx.font='12px system-ui'; ctx.textAlign='left'; ctx.fillText('Raster: each dot is one spike (neuron index vs time, last 1000 ms)',p.l,12);
  ctx.fillStyle='#8e9bb3'; ctx.font='11px system-ui'; ctx.textAlign='right'; ctx.fillText('exc',p.l-6,p.t+(h-p.t-p.b)*0.4); ctx.fillText('inh',p.l-6,p.t+(h-p.t-p.b)*0.9); ctx.textAlign='center'; for(let i=0;i<=5;i++) ctx.fillText(String(-1000+i*200),p.l+(w-p.l-p.r)*i/5,h-6);
  ctx.strokeStyle='#26314a'; ctx.beginPath(); ctx.moveTo(p.l,p.t+(h-p.t-p.b)*0.8); ctx.lineTo(w-p.r,p.t+(h-p.t-p.b)*0.8); ctx.stroke();
  if(net.stimUntil>0 && net.stimUntil>net.t-1000){ const a=Math.max(net.t-1000,net.stimUntil-100), b=Math.min(net.stimUntil,net.t); if(b>a){ ctx.fillStyle='rgba(255,209,102,0.08)'; const X=t=>p.l+(t-(net.t-1000))/1000*(w-p.l-p.r); ctx.fillRect(X(a),p.t,X(b)-X(a),h-p.t-p.b); } }
  const T0=net.t-1000; const sx=(w-p.l-p.r)/1000, sy=(h-p.t-p.b)/netN;
  ctx.fillStyle='#ff8a65'; for(let k=0;k<net.rasterT.length;k++){ if(net.rasterN[k]>=netNe) continue; ctx.fillRect(p.l+(net.rasterT[k]-T0)*sx, p.t+net.rasterN[k]*sy, 1.5,1.5); }
  ctx.fillStyle='#4fc3f7'; for(let k=0;k<net.rasterT.length;k++){ if(net.rasterN[k]<netNe) continue; ctx.fillRect(p.l+(net.rasterT[k]-T0)*sx, p.t+net.rasterN[k]*sy, 1.5,1.5); }
  // population rate (smoothed 5 ms)
  const sm=new Float32Array(1000); for(let i=0;i<1000;i++){ let s=0,c=0; for(let k=-2;k<=2;k++){ const j=i+k; if(j>=0&&j<1000){s+=net.rate[j];c++;} } sm[i]=s/c/netN*1000; }
  plot($('popRate'),[{data:sm,color:'#66d9a8',label:'population rate (Hz per neuron)'}],{x0:-1000,x1:0,y0:0,y1:Math.max(40,Math.ceil(Math.max(...sm)/20)*20),title:'Population firing rate',xlabel:'ms',pad:{l:46,r:10,t:16,b:18}});
  let lfLo=Infinity,lfHi=-Infinity; for(let i=0;i<net.lfp.length;i++){ if(net.lfp[i]<lfLo) lfLo=net.lfp[i]; if(net.lfp[i]>lfHi) lfHi=net.lfp[i]; } if(!(lfHi-lfLo>2)){ lfLo-=1; lfHi+=1; }
  plot($('lfp'),[{data:net.lfp,color:'#ffd166',label:'mean excitatory V'}],{x0:-1024,x1:0,y0:lfLo,y1:lfHi,title:'Local field potential (EEG-like)',xlabel:'ms'});
  if(netFrame%6===0||!net.spec) net.spec=netSpectrum();
  const mx=Math.max(0.05,...net.spec);
  plot($('spec'),[{data:net.spec,x:Array.from({length:100},(_,i)=>i+1),color:'#c792ea',width:2,label:'power'}],{x0:1,x1:100,y0:0,y1:mx*1.1,title:'Frequency spectrum of the LFP',xlabel:'Hz',bands:[{a:1,b:4,color:'rgba(79,195,247,0.07)',label:'δ'},{a:4,b:8,color:'rgba(102,217,168,0.07)',label:'θ'},{a:8,b:13,color:'rgba(255,209,102,0.08)',label:'α'},{a:13,b:30,color:'rgba(255,138,101,0.07)',label:'β'},{a:30,b:100,color:'rgba(199,146,234,0.07)',label:'γ'}]});
  let tot=0; for(let i=0;i<1000;i++) tot+=net.rate[i]; $('netRate').textContent=(tot/netPop).toFixed(1); if(netFrame%6===0){ const cv=netCVisi(); $('netCV').textContent=isNaN(cv)?'–':cv.toFixed(2); } $('netT').textContent=net.t;
  // synchrony: coefficient of variation of population rate
  let m=tot/1000, va=0; for(let i=0;i<1000;i++) va+=(net.rate[i]-m)**2; va/=1000; $('netSync').textContent=m>0?(Math.sqrt(va)/m).toFixed(2):'0';
}
function netLoop(){ if(activeTab==='network'){ if(net.running){ const k=+(netModel==='brunel'?$('brSpd').value:$('spd').value); const deadline=performance.now()+28; for(let i=0;i<k;i++){ if(netModel==='brunel'){ brunelStepMs(); if(performance.now()>deadline) break; } else netStepMs(); } } netFrame++; netDrawAll(); } requestAnimationFrame(netLoop); }
requestAnimationFrame(netLoop);
['wE','wI','nzIn','spd'].forEach(id=>bindRange(id));
$('netRun').addEventListener('click',e=>{ net.running=!net.running; e.target.textContent=net.running?'Pause':'Run'; });
$('netReset').addEventListener('click',()=>{ netResetState(); if(netModel==='brunel') brunelInit(); else netInit(); });
$('netStim').addEventListener('click',()=>{ net.stimUntil=net.t+100; });
// drug and state presets: slider settings plus a one-line mechanism (simplified)
const NET_PRESETS={normal:{wE:1,wI:1,nzIn:1,note:'Balanced excitation and inhibition with normal thalamic input: mixed alpha and gamma rhythms, moderate firing.'},caffeine:{wE:1.1,wI:1,nzIn:1.4,note:'Caffeine blocks adenosine receptors and raises arousal: more background input, faster rhythms, higher firing rates.'},benzo:{wE:1,wI:1.7,nzIn:0.9,note:'Benzodiazepines and alcohol enhance GABA-A receptors: stronger inhibition, lower rates and slower, more regular rhythms; at high doses, sedation.'},anaes:{wE:1,wI:1.6,nzIn:0.3,note:'General anaesthetics boost inhibition and cut arousal input from the brainstem: activity collapses into slow waves and near silence.'},ketamine:{wE:0.5,wI:1,nzIn:1,note:'Ketamine blocks NMDA receptors, weakening excitatory synapses (a simplification: its full effect on interneurons is more complex): fragmented, irregular rhythms.'},seizure:{wE:1.2,wI:0,nzIn:1,note:'No inhibition: excitation feeds back on itself and the whole network fires in giant synchronous bursts.'}};
document.querySelectorAll('[data-net]').forEach(b=>b.addEventListener('click',()=>{ const p=NET_PRESETS[b.dataset.net]; if(!p) return; setRange('wE',p.wE); setRange('wI',p.wI); setRange('nzIn',p.nzIn); $('presetNote').textContent=t('netNote_'+b.dataset.net,p.note); }));

// ============================================================ 4. BRAIN MAP
const REGIONS=tr('REGIONS',[
 {id:'frontal',name:'Frontal lobe',color:'#e07a5f',path:'M 310 55 C 220 50 120 90 85 170 C 72 205 95 232 150 240 L 260 216 L 282 200 Q 300 130 310 55 Z',label:[170,140],
  role:'Planning, decision making, working memory, personality, voluntary movement (motor cortex at its back edge), speech production (Broca’s area).',
  lesion:'Impulsivity, poor planning, personality change (famous case: Phineas Gage), weakness on the opposite side of the body, halting speech if Broca’s area is hit.',
  fact:'The prefrontal cortex is the last region to mature, finishing in the mid-20s. That is one reason adolescents weigh risk differently.',nt:'Dopamine (motivation, working memory) and glutamate.'},
 {id:'parietal',name:'Parietal lobe',color:'#81b29a',path:'M 310 55 Q 300 130 282 200 L 390 205 L 455 215 Q 450 140 440 75 C 400 60 360 55 310 55 Z',label:[370,120],
  role:'Touch, pain and body position (somatosensory cortex at its front edge), spatial attention, number sense, integrating senses into a map of where things are.',
  lesion:'Hemispatial neglect (ignoring one side of the world), trouble judging distance, loss of touch sensation on the opposite side.',
  fact:'The somatosensory map (the “homunculus”) gives the lips and fingers far more cortex than the whole back.',nt:'Glutamate and GABA.'},
 {id:'occipital',name:'Occipital lobe',color:'#f2cc8f',path:'M 440 75 C 500 95 530 170 512 225 C 495 255 455 268 400 262 L 455 215 Q 450 140 440 75 Z',label:[478,165],
  role:'Vision. The primary visual cortex (V1) receives input from the eyes via the thalamus and starts extracting edges, orientation, colour and motion.',
  lesion:'Cortical blindness in part of the visual field, even though the eyes work perfectly.',
  fact:'The left half of each eye’s visual field is processed by the right occipital lobe, and vice versa.',nt:'Glutamate.'},
 {id:'temporal',name:'Temporal lobe',color:'#9b8fd9',path:'M 150 240 L 260 216 L 390 205 L 455 215 L 400 262 C 330 285 230 290 170 270 C 150 262 145 250 150 240 Z',label:[415,243],
  role:'Hearing (auditory cortex), understanding language (Wernicke’s area), recognising faces and objects, and, deep inside, forming memories.',
  lesion:'Trouble understanding speech (fluent but meaningless speech), face blindness (prosopagnosia), memory problems.',
  fact:'Stimulating the temporal lobe during surgery can make patients vividly re-experience old memories.',nt:'Glutamate, acetylcholine.'},
 {id:'cerebellum',name:'Cerebellum',color:'#5fa8d3',path:'M 400 265 C 440 262 490 268 505 290 C 515 320 480 345 430 340 C 395 335 380 310 390 285 Z',label:[448,305],
  role:'Coordination, balance, timing and fine-tuning of movements. Also involved in learning motor skills and some cognitive timing.',
  lesion:'Ataxia: clumsy, uncoordinated movement, intention tremor, slurred speech, trouble walking in a straight line (the sobriety test checks this).',
  fact:'Only 10% of brain volume but it holds more than half of all neurons in the brain (tiny granule cells).',nt:'GABA (Purkinje cells are inhibitory).'},
 {id:'brainstem',name:'Brainstem',color:'#c9a66b',path:'M 348 262 L 395 268 L 395 300 C 400 340 395 370 385 388 L 355 388 C 345 360 346 320 348 262 Z',label:[372,352],
  role:'Breathing, heart rate, blood pressure, sleep and wake cycles, swallowing. All signals between brain and body pass through it.',
  lesion:'Life-threatening: loss of breathing control, coma, locked-in syndrome if the pons is damaged.',
  fact:'The reticular activating system in the brainstem is what wakes the cortex up each morning.',nt:'Noradrenaline (locus coeruleus), serotonin (raphe nuclei).'},
 {id:'thalamus',name:'Thalamus',color:'#f4a261',deep:true,path:'M 335 192 m -30 0 a 30 18 0 1 0 60 0 a 30 18 0 1 0 -60 0',label:[335,196],
  role:'The relay station. Nearly every sense (except smell) stops here before reaching the cortex. It also gates attention and consciousness.',
  lesion:'Loss of sensation, chronic pain syndromes, disturbed sleep and attention, coma if both sides are hit.',
  fact:'The thalamus also loops back from the cortex, forming the thalamo-cortical rhythms you see as alpha waves on an EEG.',nt:'Glutamate.'},
 {id:'basal',name:'Basal ganglia',color:'#e76f51',deep:true,path:'M 272 165 m -32 0 a 32 24 0 1 0 64 0 a 32 24 0 1 0 -64 0',label:[272,169],
  role:'Selecting which action to perform and suppressing the rest. Habit formation, reward learning, smooth initiation of movement.',
  lesion:'Parkinson’s disease (dopamine loss: tremor, rigidity, slowness) or Huntington’s disease (uncontrolled movements).',
  fact:'Dopamine neurons here fire for reward prediction error: a surprise reward, not the reward itself.',nt:'Dopamine, GABA.'},
 {id:'hippocampus',name:'Hippocampus',color:'#2a9d8f',deep:true,path:'M 285 238 C 300 228 345 228 365 240 C 350 250 300 252 285 238 Z',label:[325,266],
  role:'Forming new long-term memories of facts and events, and spatial navigation (place cells build a cognitive map).',
  lesion:'Anterograde amnesia: unable to form new memories, while old memories and skills survive (patient H.M.).',
  fact:'London taxi drivers who memorise the city’s streets have a measurably larger posterior hippocampus.',nt:'Glutamate (site where LTP was first discovered).'},
 {id:'amygdala',name:'Amygdala',color:'#e63946',deep:true,path:'M 272 246 m -11 0 a 11 9 0 1 0 22 0 a 11 9 0 1 0 -22 0',label:[250,264],
  role:'Emotional significance, especially fear and threat detection. Tags memories as emotionally important so they are stored more strongly.',
  lesion:'Reduced fear response, trouble recognising fearful faces, poorer emotional memory.',
  fact:'A threat signal can reach the amygdala via the thalamus before the cortex has consciously recognised it.',nt:'Glutamate, GABA, noradrenaline.'},
 {id:'hypothalamus',name:'Hypothalamus',color:'#ffb703',deep:true,path:'M 322 222 m -14 0 a 14 8 0 1 0 28 0 a 14 8 0 1 0 -28 0',label:[212,228],leader:[308,222],
  role:'Hunger, thirst, body temperature, hormones (via the pituitary), circadian clock, stress response.',
  lesion:'Disrupted sleep, appetite and temperature control, hormonal disorders.',
  fact:'It is roughly the size of an almond but controls the entire endocrine system.',nt:'Many peptides: orexin, oxytocin, CRH.'},
 {id:'callosum',name:'Corpus callosum',color:'#f1faee',
  role:'A bundle of about 200 million myelinated axons connecting the two hemispheres, so that sensory, motor and cognitive information is shared across the midline. Visible in the medial cut view.',
  lesion:'Split-brain syndrome: each hemisphere works alone. An object felt with the left hand (right hemisphere) cannot be named, because language sits in the left hemisphere.',
  fact:'It is the largest white-matter tract in the brain. Cutting it (callosotomy) was used to stop seizures spreading between hemispheres.',nt:'Glutamate (axons of cortical pyramidal neurons).'}
]);
// Functional cortical areas with Brodmann numbers (BA). Language areas are shown on the left hemisphere only.
const AREAS=tr('AREAS',{
 m1:{name:'Primary motor cortex (M1)',ba:'BA 4, precentral gyrus',lobe:'frontal',col:'#e63946',fn:'Sends commands to the muscles; the body is mapped along it as the motor homunculus.'},
 pm:{name:'Premotor and supplementary motor cortex',ba:'BA 6',lobe:'frontal',col:'#f4845f',fn:'Plans and sequences movements before M1 executes them.'},
 pfc:{name:'Prefrontal cortex',ba:'BA 9, 10, 11, 46',lobe:'frontal',col:'#f6bd60',fn:'Working memory, planning, decisions, impulse control, personality.'},
 broca:{name:'Broca’s area',ba:'BA 44, 45 (left hemisphere)',lobe:'frontal',col:'#ffd166',fn:'Speech production and grammar. Damage causes halting, effortful speech.'},
 s1:{name:'Primary somatosensory cortex (S1)',ba:'BA 3, 1, 2, postcentral gyrus',lobe:'parietal',col:'#06d6a0',fn:'Touch, pressure, pain and body position; the sensory homunculus.'},
 ppc:{name:'Posterior parietal cortex',ba:'BA 5, 7, 39, 40',lobe:'parietal',col:'#2a9d8f',fn:'Spatial attention, integrating the senses, guiding reaching and eye movements.'},
 v1:{name:'Primary visual cortex (V1)',ba:'BA 17, calcarine sulcus',lobe:'occipital',col:'#4361ee',fn:'First cortical stop for vision: edges, orientation, contrast.'},
 v2:{name:'Visual association cortex',ba:'BA 18, 19',lobe:'occipital',col:'#7b9cff',fn:'Colour, motion and shape; feeds the ventral "what" and dorsal "where" streams.'},
 a1:{name:'Primary auditory cortex (A1)',ba:'BA 41, 42, Heschl’s gyrus',lobe:'temporal',col:'#c77dff',fn:'Pitch and loudness, organised as a frequency map (tonotopy).'},
 wern:{name:'Wernicke’s area',ba:'BA 22 (left hemisphere)',lobe:'temporal',col:'#9d4edd',fn:'Understanding spoken and written language. Damage causes fluent but meaningless speech.'},
 ta:{name:'Temporal association cortex',ba:'BA 20, 21, 37',lobe:'temporal',col:'#b8a1e3',fn:'Recognising objects and faces (fusiform gyrus), semantic memory.'}
});
const PATHWAYS=tr('PATHWAYS',[
 {name:'Seeing a word and reading it aloud',steps:[['occipital','Light hits the retina; the thalamus relays it to the visual cortex, which decodes the letters.'],['temporal','Wernicke’s area attaches meaning to the word.'],['frontal','Broca’s area plans the speech sounds, then motor cortex sends the commands.'],['brainstem','Cranial nerve nuclei drive the tongue, lips and larynx.']]},
 {name:'Touching a hot stove',steps:[['brainstem','Pain fibres enter the spinal cord. A reflex arc pulls the hand away before the brain even knows.'],['thalamus','The signal is relayed upward.'],['parietal','Somatosensory cortex locates the pain: right index finger.'],['frontal','Prefrontal cortex decides: run it under cold water.'],['amygdala','The event is tagged as dangerous, so you remember it.']]},
 {name:'Forming a memory of today',steps:[['parietal','Sensory cortices represent what happened.'],['hippocampus','The hippocampus binds the pieces into one episode.'],['amygdala','If it was emotional, the amygdala strengthens the storage.'],['frontal','During sleep the hippocampus replays the memory and the cortex slowly stores it for the long term.']]},
 {name:'Fear response (seeing a snake)',steps:[['thalamus','A rough image of the snake reaches the thalamus.'],['amygdala','The fast route: thalamus to amygdala, an alarm within a few tens of milliseconds (about 12 ms in rat experiments).'],['hypothalamus','The hypothalamus triggers adrenaline, raised heart rate.'],['occipital','The slow route: visual cortex analyses properly: it is only a rope.'],['frontal','Prefrontal cortex calms the amygdala down.']]},
 {name:'Choosing to move (reaching for a cup)',steps:[['frontal','Prefrontal cortex sets the goal: drink.'],['basal','Basal ganglia select the reach and suppress other movements.'],['cerebellum','The cerebellum predicts and corrects the trajectory.'],['frontal','Motor cortex sends the final commands down the spinal cord.']]}
]);
const svg=$('brainSvg'); const NS='http://www.w3.org/2000/svg';
function el(tag,attrs){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); return e; }
(function buildBrain(){
  const bg=el('g',{}); svg.appendChild(bg);
  // spinal cord
  bg.appendChild(el('path',{d:'M 355 388 L 385 388 L 385 400 L 355 400 Z',fill:'#8f7b5a'}));
  const order=['brainstem','frontal','parietal','occipital','temporal','cerebellum'];
  for(const id of order){ const r=REGIONS.find(x=>x.id===id); const p=el('path',{d:r.path,fill:r.color,class:'region',id:'rg-'+r.id}); svg.appendChild(p); }
  for(const r of REGIONS.filter(r=>r.deep)){ const p=el('path',{d:r.path,fill:r.color,class:'region deep',id:'rg-'+r.id}); svg.appendChild(p); }
  for(const r of REGIONS){ if(!r.path) continue; if(r.leader){ svg.appendChild(el('line',{x1:r.label[0]+34,y1:r.label[1]-4,x2:r.leader[0],y2:r.leader[1],stroke:'#e6ecf5','stroke-width':1,'pointer-events':'none'})); }
    const t=el('text',{x:r.label[0],y:r.label[1],class:'lbl','text-anchor':'middle'}); t.textContent=r.name; svg.appendChild(t); }
  const t=el('text',{x:30,y:385,class:'lbl'}); t.textContent='dashed = deep structures hidden inside, shown as if the brain were transparent'; svg.appendChild(t);
  const t2=el('text',{x:30,y:30,class:'lbl'}); t2.textContent='← front (anterior)'; svg.appendChild(t2);
  const t3=el('text',{x:570,y:30,class:'lbl','text-anchor':'end'}); t3.textContent='back (posterior) →'; svg.appendChild(t3);
  svg.querySelectorAll('.region').forEach(p=>p.addEventListener('click',()=>selectRegion(p.id.slice(3))));
  const sel=$('pathSel'); PATHWAYS.forEach((p,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=p.name; sel.appendChild(o); });
})();
const lesions=new Set(); window.lesions=lesions; let selectedRegion=null, glowRegion=null;
window.regionState=()=>({selected:selectedRegion,lesions,glow:glowRegion});
function applyVisuals(){ svg.querySelectorAll('.region').forEach(p=>{ const id=p.id.slice(3); p.classList.toggle('sel',id===selectedRegion); p.classList.toggle('lesion',lesions.has(id)); p.classList.toggle('glow',id===glowRegion); }); if(window.brain3d) window.brain3d.update(window.regionState()); }
function selectRegion(id){ selectedRegion=id; applyVisuals(); renderRegion(); if(typeof findCheck==='function') findCheck(id); }
function renderRegion(){ const box=$('regionInfo'); if(!selectedRegion){ if(T&&T.late&&T.late.regionIntro){ box.innerHTML=T.late.regionIntro; return; } box.innerHTML=`<h2>Click a region</h2><p>Click any coloured region to learn what it does, what happens when it is damaged, and which neurotransmitters dominate there.</p><p>Then use <b>Follow a signal</b> below the brain to watch how one experience travels through several regions in sequence.</p><h3>The big picture</h3><ul><li><b>Cortex</b> (the 4 lobes): a 2–4 mm sheet of ~16 billion neurons folded to fit the skull. Perception, language, planning.</li><li><b>Deep structures</b>: older, faster circuits for emotion, memory, reward and arousal.</li><li><b>Cerebellum and brainstem</b>: coordination and life support. The brainstem runs on autopilot.</li></ul><p>The brain uses ~20 W of power, about the same as a dim light bulb, and ~20% of your energy at rest.</p>`; return; }
  const r=REGIONS.find(x=>x.id===selectedRegion); const les=lesions.has(r.id);
  const areas=Object.values(AREAS).filter(a=>a.lobe===r.id);
  box.innerHTML=`<h2>${r.name}</h2><p>${r.role}</p>${areas.length?`<h3>${t('funcAreas','Functional areas (Brodmann areas)')}</h3><ul>${areas.map(a=>`<li><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${a.col};margin-right:5px"></i><b>${a.name}</b> <span style="color:var(--muted)">${a.ba}</span><br>${a.fn}</li>`).join('')}</ul>`:''}<h3>${t('ifDamaged','If damaged (lesion)')}</h3><p>${r.lesion}</p><h3>${t('keyChem','Key chemistry')}</h3><p>${r.nt}</p><h3>${t('didYouKnow','Did you know')}</h3><p>${r.fact}</p>
  <div class="try"><b>${t('experiment','Experiment:')}</b> ${t('lesionExp','simulate a lesion and read the predicted deficit. Then tick "apply lesions" in the Live brain tab to see which scenarios break.')}<br><button class="btn small ${les?'':'primary'}" id="lesionBtn">${les?t('heal','Heal this region'):t('lesion','Lesion this region')}</button></div>
  ${lesions.size?`<p style="font-size:13px;color:var(--muted)">${t('lesionedNow','Lesioned now:')} ${[...lesions].map(i=>REGIONS.find(x=>x.id===i).name).join(', ')}</p>`:''}`;
  $('lesionBtn').addEventListener('click',()=>{ if(les) lesions.delete(r.id); else lesions.add(r.id); applyVisuals(); renderRegion(); });
}
$('lesionClr').addEventListener('click',()=>{ lesions.clear(); applyVisuals(); renderRegion(); });
renderRegion();
let pathTimer=null;
function renderPathSteps(pw,active){ $('pathSteps').innerHTML=pw.steps.map((s,i)=>`<li class="${i===active?'on':''}">${i+1}. <b>${REGIONS.find(r=>r.id===s[0]).name}</b> – ${s[1]}${lesions.has(s[0])?' <span style="color:var(--bad)">'+t('blocked','⚠ this region is lesioned: the signal is blocked here.')+'</span>':''}</li>`).join(''); }
$('pathSel').addEventListener('change',()=>renderPathSteps(PATHWAYS[+$('pathSel').value],-1));
$('pathGo').addEventListener('click',()=>{ if(pathTimer) clearInterval(pathTimer); const pw=PATHWAYS[+$('pathSel').value]; let i=0;
  const tick=()=>{ if(i>=pw.steps.length){ glowRegion=null; applyVisuals(); clearInterval(pathTimer); pathTimer=null; renderPathSteps(pw,-1); return; } const id=pw.steps[i][0]; glowRegion=id; applyVisuals(); renderPathSteps(pw,i); if(lesions.has(id)){ clearInterval(pathTimer); pathTimer=null; return; } i++; };
  tick(); pathTimer=setInterval(tick,1400); });
renderPathSteps(PATHWAYS[0],-1);

// ============================================================ 5. QUIZ
const QUESTIONS=tr('QUESTIONS',[
 {q:'What is a neuron?',o:['A brain cell that receives, adds up and sends electrical signals','A chemical that carries mood','A brain wave','A part of the skull'],a:0,why:'Neurons are the cells of the nervous system: dendrites receive, the cell body decides, the axon sends. See Start here, Lesson 1.'},
 {q:'What is a synapse?',o:['The tiny gap where one neuron passes a chemical message to the next','The centre of a neuron','A type of brain scan','The fluid around the brain'],a:0,why:'Neurons do not touch. The 20-nanometre gap plus the sending and receiving parts is the synapse, and its strength is what learning changes.'},
 {q:'Where does most memory consolidation happen?',o:['During sleep','During a lecture','While re-reading notes','While multitasking'],a:0,why:'In deep sleep the hippocampus replays the day to the cortex; skipping sleep skips the filing.'},
 {q:'Which part of the brain is the "alarm" that detects threat within milliseconds?',o:['Amygdala','Cerebellum','Occipital lobe','Corpus callosum'],a:0,why:'The amygdala gets a fast, crude signal from the thalamus and triggers the body’s fear response before the cortex has worked out what happened.'},
 {q:'Melatonin, the darkness hormone, is released by…',o:['the pineal gland when light fades','the stomach after meals','the cerebellum during exercise','the amygdala during fear'],a:0,why:'The body clock in the hypothalamus tells the pineal gland to release melatonin at dusk. Bright screens at night delay it.'},
 {q:'Optogenetics lets scientists control neurons with…',o:['light','sound','magnets','cold'],a:0,why:'Neurons are engineered to carry light-sensitive channels, so a flash of light makes exactly those cells fire.'},
 {q:'Bilingual people on average show dementia symptoms…',o:['about four years later','about four years earlier','at the same age','never'],a:0,why:'Constantly managing two languages trains executive control and builds cognitive reserve.'},
 {q:'Which pathway explains why a smell can bring back a vivid childhood memory?',o:['Smell goes almost directly to the amygdala and hippocampus','Smell is processed in the cerebellum','Smell uses the visual cortex','Smell passes through the spinal cord'],a:0,why:'Unlike the other senses, smell bypasses the thalamus and reaches memory and emotion centres directly.'},
 {q:'Why do antidepressants take weeks to work even though serotonin rises within hours?',o:['The real effect is slow regrowth of synapses','The pills dissolve slowly','Serotonin must reach the spinal cord','They first repair the skull'],a:0,why:'Raised serotonin triggers plasticity (BDNF, new synapses in prefrontal cortex and hippocampus), which takes weeks.'},
 {q:'A two-year-old has roughly how many synapses compared with an adult?',o:['About twice as many','Half as many','The same','None yet'],a:0,why:'Synapses bloom early, then unused ones are pruned through childhood and adolescence: use it or lose it.'},
 {q:'During the rising phase of an action potential, which ion rushes INTO the neuron?',o:['Na⁺ (sodium)','K⁺ (potassium)','Cl⁻ (chloride)','Ca²⁺ only'],a:0,why:'Voltage-gated Na⁺ channels open and sodium flows in, pushing the membrane toward E_Na (+50 mV). Try gNa = 0 in the Neuron tab: no spike at all.'},
 {q:'What ends the spike and brings the membrane back down (repolarisation)?',o:['Na⁺ channels inactivating and K⁺ channels opening','More Na⁺ entering','The leak current turning off','The synapse releasing GABA'],a:0,why:'The h gate closes Na⁺ channels while the slower n gate opens K⁺ channels; K⁺ leaves the cell. Watch h and n in the gating plot.'},
 {q:'A tetrodotoxin (TTX) poisoning blocks sodium channels. In the simulator that corresponds to…',o:['gNa × 0','gK × 0','gL × 3','Noise = 5'],a:0,why:'Puffer-fish toxin TTX blocks voltage-gated Na⁺ channels, so neurons cannot fire. That is why it is lethal: the diaphragm stops.'},
 {q:'Why does a stronger current make a neuron fire FASTER rather than produce BIGGER spikes?',o:['Spikes are all-or-none; only their rate carries intensity','Bigger currents shrink the spikes','The threshold rises with current','Neurons cannot fire faster than 1 Hz'],a:0,why:'Spike amplitude is set by ion gradients, not the input. Information is coded in timing and rate. See the f–I curve.'},
 {q:'The refractory period means…',o:['Right after a spike the neuron cannot fire again for a few ms','The neuron is permanently silent','The synapse is empty of vesicles','The axon reverses direction'],a:0,why:'Na⁺ channels are inactivated and K⁺ channels still open. It limits maximum firing rate and makes spikes travel one way along the axon.'},
 {q:'An inhibitory synapse (GABA-A) makes the postsynaptic cell…',o:['Harder to fire, by pulling V toward −80 mV','Easier to fire, by pushing V toward 0 mV','Release more neurotransmitter','Grow a new dendrite'],a:0,why:'Cl⁻ enters through GABA-A channels, hyperpolarising or shunting the cell. Switch the Synapse tab to inhibitory and watch V dip.'},
 {q:'Temporal summation is…',o:['Several EPSPs arriving close in time adding up to reach threshold','Two neurons swapping axons','A spike travelling backwards','A synapse growing stronger over years'],a:0,why:'One EPSP is usually too small. Use "Burst ×5" and the postsynaptic cell crosses threshold.'},
 {q:'In STDP, the synapse gets STRONGER when…',o:['The presynaptic spike comes just before the postsynaptic spike','The presynaptic spike comes just after the postsynaptic spike','Both spike at exactly the same time only','Neither cell spikes'],a:0,why:'Pre-before-post (Δt > 0) gives LTP: the input helped cause the output. Post-before-pre gives LTD.'},
 {q:'In the 1000-neuron network, what happens when you set inhibitory strength to 0?',o:['Runaway synchronous firing, like a seizure','All neurons go silent','Nothing changes','The network becomes purely random'],a:0,why:'Excitation feeds on itself without the brake. Epileptic seizures involve exactly this loss of E/I balance.'},
 {q:'Which neurons are the "brakes" of the cortex?',o:['GABAergic interneurons','Pyramidal cells','Thalamic relay cells','Purkinje cells of the cerebellum'],a:0,why:'About 20% of cortical neurons are inhibitory interneurons. They keep activity balanced and shape rhythms like gamma.'},
 {q:'Which EEG band is 8–13 Hz and strongest when you relax with eyes closed?',o:['Alpha','Delta','Gamma','Beta'],a:0,why:'Alpha arises from thalamo-cortical loops. Delta (1–4 Hz) dominates deep sleep; gamma (30+) accompanies focused processing.'},
 {q:'Damage to the hippocampus on both sides produces…',o:['Inability to form new long-term memories','Blindness','Loss of balance','Loss of breathing control'],a:0,why:'Patient H.M. lost his hippocampi in 1953 and could never again form new episodic memories, yet could still learn motor skills.'},
 {q:'Which region relays almost all sensory input to the cortex?',o:['Thalamus','Cerebellum','Amygdala','Basal ganglia'],a:0,why:'Only smell bypasses the thalamus. It also gates what reaches awareness.'},
 {q:'Parkinson’s disease is mainly a loss of which neurotransmitter, where?',o:['Dopamine in the basal ganglia','Serotonin in the cortex','GABA in the cerebellum','Glutamate in the hippocampus'],a:0,why:'Dopamine neurons of the substantia nigra die, so the basal ganglia cannot initiate movements smoothly.'},
 {q:'Which structure contains more than half of all the neurons in the brain?',o:['Cerebellum','Frontal lobe','Brainstem','Thalamus'],a:0,why:'Its tiny granule cells number ~69 billion, against ~16 billion in the whole cortex.'},
 {q:'A signal that reaches the amygdala BEFORE the visual cortex finishes analysing the image travels via…',o:['The thalamus directly to the amygdala (fast route)','The cerebellum','The spinal cord','The occipital lobe first'],a:0,why:'LeDoux’s "low road": quick and crude. The cortex’s "high road" then confirms or cancels the alarm.'},
 {q:'Why does the Hodgkin–Huxley model need the gating variable h?',o:['To inactivate Na⁺ channels so the spike can end','To open K⁺ channels','To model the leak','To add noise'],a:0,why:'Without inactivation, Na⁺ would keep flowing and the membrane would stay depolarised. Hodgkin and Huxley won the 1963 Nobel Prize for this.'},
 {q:'The Izhikevich "chattering" cell type produces…',o:['Bursts of spikes repeating at ~40 Hz','One spike per second','No spikes','Only inhibitory output'],a:0,why:'Its high reset voltage (c = −50) lets it fire a burst, then the recovery variable u pauses it. Try the preset.'}
]);
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
let qScore=0, qAnswered=0;
function buildQuiz(){ qScore=0; qAnswered=0; $('qScore').textContent=0; const qs=shuffle(QUESTIONS.slice()).slice(0,10); $('qTotal').textContent=qs.length; if(T) $('qScore').parentNode.firstChild.textContent=t('score','Score: '); const list=$('qList'); list.innerHTML='';
  qs.forEach((q,qi)=>{ const idx=shuffle([0,1,2,3]); const d=document.createElement('div'); d.className='q'; d.innerHTML=`<div><b>${qi+1}.</b> ${q.q}</div><div class="opts">${idx.map(i=>`<button data-i="${i}">${q.o[i]}</button>`).join('')}</div><div class="why"></div>`; list.appendChild(d);
    d.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ if(d.dataset.done) return; d.dataset.done=1; const i=+b.dataset.i; if(i===q.a){ b.classList.add('right'); qScore++; } else { b.classList.add('wrong'); d.querySelector(`button[data-i="${q.a}"]`).classList.add('right'); } d.querySelector('.why').textContent=q.why; qAnswered++; $('qScore').textContent=qScore; })); });
}
$('qReset').addEventListener('click',buildQuiz); buildQuiz();

// ============================================================ LESSONS
const TRY={}; function tryBtn(label,fn){ const id='try'+Object.keys(TRY).length; TRY[id]=fn; return `<button class="btn small" data-try="${id}">${label}</button>`; }
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-try]'); if(b&&TRY[b.dataset.try]) TRY[b.dataset.try](); });
$('lesson-neuron').innerHTML=`
<h2>Level 1 · The neuron</h2>
<p>A neuron is a cell that keeps its inside about <b>−65 mV</b> relative to the outside, using ion pumps. When a strong enough input pushes it past a <b>threshold (~−50 mV)</b>, voltage-gated channels fire an <b>action potential</b>, a 1 ms, +100 mV spike that races down the axon.</p>
<h3>Three models, three levels of detail</h3>
<ul>
<li><b>Hodgkin–Huxley</b> (1952, squid axon): the real biophysics. Three gates m, h, n control Na⁺ and K⁺ channels.</li>
<li><b>Integrate-and-fire</b>: ignore the mechanism, keep the idea. Charge up, hit threshold, reset.</li>
<li><b>Izhikevich</b>: a two-equation trick that reproduces 20 real firing patterns with 4 numbers.</li>
</ul>
<div class="try"><b>Try 1: the spike anatomy.</b> In HH, set current to 10 and watch the gating plot. m opens fast (Na⁺ in, upstroke), h closes (Na⁺ stops), n opens slowly (K⁺ out, downstroke, undershoot).<br>${tryBtn('Set up',()=>{ $('nModel').value='hh'; setRange('nI',10); setRange('nDur',100); })}</div>
<div class="try"><b>Try 2: poison the neuron.</b> Tetrodotoxin blocks Na⁺ channels. Slide gNa to 0: no spikes, whatever the current. TEA blocks K⁺ channels: spikes become wide and the cell gets stuck.<br>${tryBtn('TTX (gNa = 0)',()=>{ $('nModel').value='hh'; setRange('gNa',0); })} ${tryBtn('TEA (gK = 0.2)',()=>{ $('nModel').value='hh'; setRange('gNa',1); setRange('gK',0.2); })} ${tryBtn('Cure',()=>{ setRange('gNa',1); setRange('gK',1); })}</div>
<div class="try"><b>Try 3: rate coding.</b> Click <i>Plot f–I curve</i>. Notice HH jumps from 0 to ~50 Hz abruptly (type II), while integrate-and-fire rises smoothly (type I). Spikes never get bigger, only more frequent.</div>
<div class="try"><b>Try 4: a zoo of cells.</b> Switch to Izhikevich and cycle through presets. Bursting and chattering cells exist in your cortex right now.<br>${tryBtn('Chattering cell',()=>{ $('nModel').value='izh'; $('izhPreset').value='CH'; $('izhPreset').dispatchEvent(new Event('change')); })} ${tryBtn('Fast-spiking interneuron',()=>{ $('nModel').value='izh'; $('izhPreset').value='FS'; $('izhPreset').dispatchEvent(new Event('change')); })}</div>
<div class="try"><b>Try 5: noise is real.</b> Add noise. Real neurons sit in a storm of synaptic input; sub-threshold noise can make them fire randomly.</div>
<h3>Key numbers</h3>
<ul><li>Resting potential −65 mV, threshold ≈ −50 mV, peak +40 mV</li><li>Spike duration ≈ 1 ms, refractory ≈ 2 ms, max rate ≈ 500 Hz</li><li>Conduction speed 1–120 m/s (myelin makes it fast)</li></ul>`;
$('lesson-synapse').innerHTML=`
<h2>Level 2 · The synapse</h2>
<p>Neurons do not touch. A spike arriving at the terminal opens Ca²⁺ channels, which make <b>vesicles</b> fuse and dump neurotransmitter into a 20 nm gap. Receptors on the other side open ion channels, giving a small voltage bump: an <b>EPSP</b> (excitatory, ~0.5–1 mV) or <b>IPSP</b> (inhibitory).</p>
<div class="try"><b>Try 1: one EPSP is not enough.</b> Fire once. The bump is below threshold. Now <i>Burst ×5</i>: the EPSPs pile up (temporal summation) and the cell spikes.<br>${tryBtn('Excitatory burst',()=>{ $('sType').value='exc'; setRange('sW',1); $('sBurst').click(); })}</div>
<div class="try"><b>Try 2: inhibition.</b> Switch to GABA and fire. The membrane dips toward −80 mV. Inhibition is about 20% of synapses but it decides what gets through.<br>${tryBtn('Inhibitory burst',()=>{ $('sType').value='inh'; $('sBurst').click(); })}</div>
<div class="try"><b>Try 3: a strong synapse.</b> Set weight to 3. One spike in, one spike out. That is what learning does: it turns weak synapses into reliable ones.<br>${tryBtn('Weight = 3, fire',()=>{ $('sType').value='exc'; setRange('sW',3); $('sFire').click(); })}</div>
<h3>STDP: learning at one synapse</h3>
<p>Hebb (1949): "cells that fire together wire together." Bi and Poo (1998) measured the exact rule: if the input spike arrives 5–20 ms <b>before</b> the output spike, the synapse grows (<b>LTP</b>). If it arrives just <b>after</b>, it shrinks (<b>LTD</b>). The synapse learns causality.</p>
<div class="try"><b>Try 4:</b> set Δt = +10 and run 60 pairings: weight climbs. Set Δt = −10: it falls. Set Δt = +45: almost nothing, timing matters.<br>${tryBtn('Δt = +10',()=>setRange('stdpDt',10))} ${tryBtn('Δt = −10',()=>setRange('stdpDt',-10))}</div>
<h3>Why it matters</h3>
<ul><li>Memory is stored as synaptic weights, not as "files".</li><li>Drugs act here: SSRIs, nicotine, caffeine, anaesthetics all change synapses.</li><li>Your cortex has ~10¹⁴ synapses, each a tiny learning machine.</li></ul>`;
$('lesson-network').innerHTML=`
<h2>Level 3 · The network</h2>
<p>This is Izhikevich’s 2003 model of a 1 mm² patch of cortex: <b class="exc">800 excitatory</b> pyramidal cells and <b class="inh">200 inhibitory</b> interneurons, all connected with random weights, driven by random "thalamic" input. Nobody programmed rhythms into it, yet they appear.</p>
<h3>What to look at</h3>
<ul>
<li><b>Raster:</b> each dot is one spike. Vertical stripes mean neurons fire together (synchrony).</li>
<li><b>LFP:</b> the summed voltage, what an EEG electrode would see.</li>
<li><b>Spectrum:</b> which rhythm dominates. Healthy cortex shows mixed alpha (8–13 Hz) and gamma (30–80 Hz).</li>
</ul>
<div class="try"><b>Try 1: a seizure.</b> Slide inhibitory strength to 0. Without the brake, excitation feeds on itself: giant synchronous bursts. This is the E/I imbalance behind epilepsy.<br>${tryBtn('Remove inhibition',()=>setRange('wI',0))} ${tryBtn('Restore',()=>{setRange('wI',1);setRange('wE',1);})}</div>
<div class="try"><b>Try 2: anaesthesia.</b> Turn background input down to 0.3. Firing collapses and the spectrum shifts to slow waves, as in deep sleep or anaesthesia.<br>${tryBtn('Low input',()=>setRange('nzIn',0.3))} ${tryBtn('Normal',()=>setRange('nzIn',1))}</div>
<div class="try"><b>Try 3: a stimulus.</b> Click <i>Sensory stimulus</i>. 100 neurons get extra input for 100 ms. Watch the response spread through the network via synapses and then die away.</div>
<div class="try"><b>Try 4: too much excitation.</b> Excitatory strength 2: more synchrony, higher rates. Strength 0: each neuron fires alone, no rhythm. Rhythms are a network property, not a neuron property.</div>
<h3>Ideas to take away</h3>
<ul><li>Brain rhythms (EEG bands) emerge from E/I interaction, mostly through inhibitory interneurons.</li><li>The same network can be "awake", "asleep" or "seizing" just by changing a gain. That is roughly what neuromodulators like acetylcholine and noradrenaline do.</li><li>Synchrony is the variable to watch (the pill above: standard deviation / mean of the population rate).</li></ul>`;
$('lesson-quiz').innerHTML=`
<h2>Level 5 · Quiz</h2>
<p>Ten questions drawn from a pool of ${QUESTIONS.length}, from basics to the Start here lessons. Every explanation points back to an experiment you can run in the other tabs.</p>
<h3>Suggested learning path</h3>
<ul>
<li>Day 1: Neuron tab, Try 1–3. Read about ion channels.</li>
<li>Day 2: Izhikevich presets, then the Synapse tab.</li>
<li>Day 3: STDP, then the Network tab and the seizure experiment.</li>
<li>Day 4: Brain map, play all five pathways, lesion each region.</li>
<li>Day 5: Live brain: watch "Learning a new word", then "A night of sleep" and "Chronic stress".</li>
<li>Day 6: Quiz until you score 10/10 twice.</li>
</ul>
<h3>Go deeper (free)</h3>
<ul>
<li><b>Neuromatch Academy</b> computational neuroscience course and notebooks.</li>
<li><b>Principles of Neural Science</b> (Kandel) for the biology.</li>
<li><b>Brian2</b> (Python) to build your own spiking networks.</li>
<li><b>Allen Brain Atlas</b> for real recorded neurons.</li>
<li><b>Izhikevich, "Which model to use for cortical spiking neurons?"</b> (2004) for the model zoo.</li>
</ul>`;

// ============================================================ START-HERE FIGURES
function drawFigures(){
  if(!$('figAP')) return;
  // 1. annotated action potential
  { const P={model:'hh',I:12,t0:3,dur:40,noise:0,gNa:1,gK:1,gL:1,lTau:10,lTh:-50,lRef:2,lReset:-65,iA:.02,iB:.2,iC:-65,iD:8}; const r=simNeuron(P); let n=0; while(n<r.n&&r.t[n]<=22) n++; const ts=r.spikes[0]||8; const vAt=t=>r.V[Math.min(r.n-1,Math.max(0,Math.round(t/r.T*(r.n-1))))];
    plot($('figAP'),[{data:r.V.subarray(0,n),x:r.t.subarray(0,n),color:'#4fc3f7',width:2.4,fill:true,label:'membrane voltage'}],{x0:0,x1:22,y0:-90,y1:55,title:'One action potential, millisecond by millisecond (mV)',xlabel:'ms',pad:{l:46,r:12,t:18,b:22},hlines:[{y:-65,color:'#3b4a6b',label:'resting −65 mV'},{y:-50,color:'#ffd166',label:'threshold −50 mV'}],
      annotations:[{x:ts-0.75,y:vAt(ts-0.75),text:'1 · input reaches threshold',dx:-8,dy:36,color:'#ffd166'},{x:ts-0.25,y:vAt(ts-0.25),text:'2 · Na⁺ channels fly open, Na⁺ rushes in',dx:34,dy:-22,color:'#ff8a65'},{x:ts+0.1,y:vAt(ts+0.1),text:'3 · peak: Na⁺ channels shut themselves (h)',dx:40,dy:-2,color:'#ff8a65'},{x:ts+0.9,y:vAt(ts+0.9),text:'4 · K⁺ channels open, K⁺ flows out',dx:44,dy:16,color:'#66d9a8'},{x:ts+3.5,y:vAt(ts+3.5),text:'5 · undershoot and refractory pause, then rest',dx:36,dy:22,color:'#4fc3f7'}]}); }
  // 2. brain-wave bands
  { const c=$('figWaves'); const {ctx,w,h}=setupCanvas(c); const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#0d1322'); bg.addColorStop(1,'#080b12'); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    const bands=[['Delta','0.5–4 Hz','deep sleep: memory filing',1.3,'#4fc3f7'],['Theta','4–8 Hz','drowsy, dreaming, hippocampus storing',6,'#66d9a8'],['Alpha','8–13 Hz','relaxed, eyes closed',10,'#ffd166'],['Beta','13–30 Hz','awake, thinking',20,'#ff8a65'],['Gamma','30–80 Hz','intense focus, binding details',40,'#c792ea']];
    ctx.fillStyle='#e6ecf5'; ctx.font='600 12.5px Outfit, Inter, system-ui'; ctx.textAlign='left'; ctx.fillText('Brain waves: the same 2 seconds of EEG in five states',10,14);
    const rowH=(h-30)/bands.length; const x0=90, x1=w-190;
    bands.forEach(([name,hz,desc,f,col],i)=>{ const yc=28+rowH*(i+0.5); ctx.fillStyle=col; ctx.font='600 12px Inter, system-ui'; ctx.textAlign='left'; ctx.fillText(name,10,yc+1); ctx.fillStyle='#8e9bb3'; ctx.font='10.5px Inter, system-ui'; ctx.fillText(hz,10,yc+13);
      ctx.strokeStyle=col; ctx.lineWidth=1.6; ctx.shadowColor=col; ctx.shadowBlur=5; ctx.beginPath(); const amp=rowH*0.36*(1-0.5*i/bands.length); for(let k=0;k<=300;k++){ const t=k/300*2; const y=yc-Math.sin(2*Math.PI*f*t)*amp*(1+0.25*Math.sin(2*Math.PI*0.7*t)); const x=x0+(x1-x0)*k/300; if(k===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke(); ctx.shadowBlur=0;
      ctx.fillStyle='#c9d2e3'; ctx.font='11.5px Inter, system-ui'; ctx.fillText(desc,x1+12,yc+4); }); }
  // 3. a night of sleep (hypnogram)
  { const c=$('figSleep'); const {ctx,w,h}=setupCanvas(c); const bg=ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#0d1322'); bg.addColorStop(1,'#080b12'); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    const segs=[[4,8]]; for(let k=0;k<5;k++){ segs.push([2,5],[1,20+4*k],[0,Math.max(4,45-11*k)],[1,10],[3,6+11*k]); } segs.push([4,6]);
    const total=segs.reduce((a,s)=>a+s[1],0); const p={l:58,r:14,t:26,b:26}; const pw=w-p.l-p.r, ph=h-p.t-p.b; const lv=['Deep (N3)','Light (N2)','N1','REM','Awake']; const X=m=>p.l+m/total*pw, Y=st=>p.t+ph-(st/4)*ph;
    ctx.strokeStyle='#1a2235'; ctx.setLineDash([3,4]); ctx.beginPath(); for(let s=0;s<5;s++){ ctx.moveTo(p.l,Y(s)); ctx.lineTo(w-p.r,Y(s)); } ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#8e9bb3'; ctx.font='10.5px Inter, system-ui'; ctx.textAlign='right'; lv.forEach((l,s)=>ctx.fillText(l,p.l-6,Y(s)+4)); ctx.textAlign='center'; for(let hh=0;hh<=8;hh++) ctx.fillText(hh+' h',X(hh*60),h-8);
    let m=0; for(const [st,len] of segs){ if(st===3){ ctx.fillStyle='rgba(255,138,101,0.22)'; ctx.fillRect(X(m),Y(3)-ph/8,X(m+len)-X(m),ph/8*2); } if(st===0){ ctx.fillStyle='rgba(79,195,247,0.18)'; ctx.fillRect(X(m),Y(0)-ph/8,X(m+len)-X(m),ph/8); } m+=len; }
    ctx.strokeStyle='#e6ecf5'; ctx.lineWidth=2; ctx.shadowColor='#fff'; ctx.shadowBlur=4; ctx.beginPath(); m=0; let first=true; for(const [st,len] of segs){ if(first){ ctx.moveTo(X(m),Y(st)); first=false; } else ctx.lineTo(X(m),Y(st)); ctx.lineTo(X(m+len),Y(st)); m+=len; } ctx.stroke(); ctx.shadowBlur=0;
    ctx.fillStyle='#e6ecf5'; ctx.font='600 12.5px Outfit, Inter, system-ui'; ctx.textAlign='left'; ctx.fillText('A night of sleep: five 90-minute cycles',p.l,15);
    ctx.font='600 11px Inter, system-ui'; ctx.fillStyle='#4fc3f7'; ctx.fillText('deep sleep is longest early: memory filing and cleaning',X(40),Y(0)-ph/8-6); ctx.fillStyle='#ff8a65'; ctx.textAlign='right'; ctx.fillText('REM grows toward morning: dreams, emotion',X(total-20),Y(3)-ph/8-6); }
  // 4. synapses and control across a lifetime
  { const xs=[],dens=[],pfc=[],rew=[]; for(let a=0;a<=90;a+=0.25){ xs.push(a); const d=a<=2?0.35+0.65*Math.pow(a/2,0.6):a<=16?1-0.4*Math.pow((a-2)/14,0.8):a<=60?0.6-0.05*(a-16)/44:0.55-0.12*(a-60)/30; dens.push(d*100); pfc.push(100/(1+Math.exp(-(a-14)/3.6))); rew.push(100/(1+Math.exp(-(a-10.5)/2))); }
    plot($('figLife'),[{data:dens,x:xs,color:'#c792ea',width:2.4,fill:true,label:'synapse density (% of peak)'},{data:rew,x:xs,color:'#ffd166',width:2,label:'reward system maturity'},{data:pfc,x:xs,color:'#4fc3f7',width:2,label:'prefrontal control maturity'}],{x0:0,x1:90,y0:0,y1:110,title:'A lifetime: synapses bloom, then are pruned; control matures last',xlabel:'age (years)',
      annotations:[{x:2,y:100,text:'age 2: twice the adult synapses',dx:34,dy:12,color:'#c792ea'},{x:13,y:78,text:'teens: pruning, reward ready, brake not yet',dx:40,dy:12,color:'#ffd166'},{x:28,y:96,text:'~25: prefrontal cortex fully mature',dx:70,dy:22,color:'#4fc3f7'},{x:60,y:55,text:'adult life: plasticity continues',dx:30,dy:28,color:'#c792ea'}]}); }
}
drawFigures();

// ============================================================ GLOSSARY + JARGON BUSTER
const GLOSSARY=tr('GLOSSARY',[
 ['Action potential (spike)','The one-millisecond electrical pulse a neuron sends down its axon. Always the same size; information is in how often it happens.'],
 ['Acetylcholine','Chemical messenger for attention and learning; makes the cortex ready to change. High when you focus and during dreaming sleep.'],
 ['Adrenaline','Hormone from the adrenal glands that readies the body for action: fast heart, wide pupils. Released in fear and excitement.'],
 ['Amygdala','Almond-sized structure deep in each temporal lobe. Detects threat and emotional importance within milliseconds; tags memories as emotional.'],
 ['AMPA receptor','The common "fast" receptor for glutamate. Adding more of them to a synapse is what makes it stronger (LTP).'],
 ['Axon','The cable that carries a neuron’s spike to other cells. Can be a metre long. Often wrapped in myelin to speed it up.'],
 ['Basal ganglia','Group of deep structures that select actions, build habits and learn from reward using dopamine. Damaged in Parkinson’s disease.'],
 ['BDNF','Brain-derived neurotrophic factor: a growth protein that helps synapses strengthen and new neurons survive. Raised by exercise.'],
 ['Brainstem','The stalk connecting brain and spinal cord. Controls breathing, heart rate and the sleep/wake switch. Damage there is life-threatening.'],
 ['Brodmann area (BA)','One of 52 numbered patches of cortex, defined in 1909 by cell structure. Used as an address system, e.g. BA 17 = primary visual cortex.'],
 ['Cerebellum','"Little brain" at the back, under the cortex. Fine-tunes movement, balance and timing; holds more than half of all neurons.'],
 ['Consolidation','The slow process, mostly during sleep, by which a fresh memory in the hippocampus is copied into cortex and becomes stable.'],
 ['Cortex','The 2–4 mm outer sheet of the brain, folded into ridges and grooves. Perception, language, planning and voluntary movement live here.'],
 ['Cortisol','The main stress hormone. Useful for an hour (energy, alertness); harmful over weeks (blocks learning, shrinks the hippocampus).'],
 ['Default mode network','Set of midline regions active when you are not focused on a task: daydreaming, remembering, thinking about yourself.'],
 ['Dendrite','A branch of a neuron that receives messages from other neurons. Covered in tiny spines, each one a synapse.'],
 ['Dopamine','Messenger for motivation and reward prediction: it fires when something is better than expected and tags synapses as worth keeping.'],
 ['EEG','Electroencephalography: electrodes on the scalp recording the summed electrical rhythms of millions of cortical neurons (brain waves).'],
 ['Endorphins','The body’s own opioids: pleasure and pain relief. Released by exercise, laughter, music.'],
 ['Excitatory / inhibitory','An excitatory synapse pushes the next cell toward firing (glutamate); an inhibitory one pushes it away (GABA).'],
 ['f–I curve','Graph of firing rate against input current: shows that a neuron codes input strength as spikes per second.'],
 ['GABA','The brain’s main inhibitory messenger, the brake. Anti-anxiety drugs and alcohol act on its receptors.'],
 ['Glia','Support cells (astrocytes, oligodendrocytes, microglia) that feed, insulate and clean neurons. About as numerous as neurons.'],
 ['Glutamate','The brain’s main excitatory messenger, used at most synapses.'],
 ['Gyrus / sulcus','A gyrus is a ridge of cortex, a sulcus a groove. Folding packs more cortex into the skull.'],
 ['Hippocampus','Seahorse-shaped structure in each temporal lobe. Forms new memories of events and facts and holds your spatial map.'],
 ['Hodgkin–Huxley model','The 1952 mathematical description of the spike using sodium and potassium channels. Nobel Prize 1963. Shown in the Neuron tab.'],
 ['Hypothalamus','Small region under the thalamus controlling hunger, thirst, temperature, hormones, the body clock and the stress response.'],
 ['Ion channel','A protein door in the cell membrane that lets specific ions (sodium, potassium, chloride, calcium) through. Spikes are channels opening and closing.'],
 ['Izhikevich model','A simple two-equation neuron model (2003) that reproduces 20 real firing patterns. Used for the 1000-cell network here.'],
 ['Locus coeruleus','Tiny brainstem nucleus that supplies the whole brain with noradrenaline: the alertness dial.'],
 ['LTP / LTD','Long-term potentiation / depression: a synapse becoming lastingly stronger / weaker. The cellular basis of learning and forgetting.'],
 ['Membrane potential','The voltage across a neuron’s membrane, about −65 mV at rest. Inputs push it up or down; crossing threshold makes a spike.'],
 ['Myelin','Fatty insulation wrapped around axons by glia. Makes spikes travel up to 100× faster. Lost in multiple sclerosis.'],
 ['Neurogenesis','Birth of new neurons. Continues at a low rate in the adult hippocampus; boosted by exercise, reduced by stress.'],
 ['Neuron','A nerve cell: dendrites (input), cell body, axon (output). About 86 billion in the human brain.'],
 ['Neurotransmitter','A chemical released at a synapse that carries the message to the next cell: glutamate, GABA, dopamine, serotonin and others.'],
 ['NMDA receptor','A glutamate receptor that opens only when the synapse is active AND the receiving cell is already excited. It lets calcium in and triggers LTP: the coincidence detector for learning.'],
 ['Noradrenaline','Messenger for alertness and arousal (also called norepinephrine). Moderate levels sharpen attention; high levels mean fear.'],
 ['Nucleus accumbens','Part of the basal ganglia at the heart of the reward circuit; where dopamine produces "wanting".'],
 ['Oxytocin','Hormone and messenger of bonding and trust, released by touch, closeness and childbirth; calms the amygdala.'],
 ['Plasticity','The brain’s ability to change its connections with experience. It is strongest in childhood but continues for life.'],
 ['Prefrontal cortex','Front part of the frontal lobe: planning, working memory, decisions, self-control. Matures in the mid-20s.'],
 ['Raster plot','A chart with time across and neurons down, one dot per spike. Shows a whole network’s activity at a glance.'],
 ['Refractory period','The ~2 ms after a spike when a neuron cannot fire again. Limits the maximum firing rate.'],
 ['Reward prediction error','The difference between the reward you got and the reward you expected. Dopamine neurons report exactly this.'],
 ['Serotonin','Messenger for mood, patience and satiety. Many antidepressants raise its availability.'],
 ['Sharp-wave ripple','Very fast burst in the hippocampus during rest and deep sleep in which a recent experience is replayed at high speed.'],
 ['Sleep spindle','A half-second burst of 12–15 Hz waves in stage-2 sleep, linked to consolidation of skills and facts.'],
 ['STDP','Spike-timing-dependent plasticity: if the sender fires just before the receiver, the synapse strengthens; just after, it weakens.'],
 ['Synapse','The tiny gap (20 nm) where one neuron passes a chemical message to the next. About 100 trillion in a human brain. Learning changes their strength.'],
 ['Thalamus','Egg-shaped relay in the centre of the brain; almost all sensory information passes through it on the way to the cortex.'],
 ['Threshold','The membrane voltage (about −50 mV) at which a neuron fires a spike.'],
 ['Working memory','The handful of items you can hold in mind right now, kept alive by activity in prefrontal cortex. Lasts seconds.']
]);
function renderGlossary(container,filter){ const f=(filter||'').trim().toLowerCase(); container.innerHTML=GLOSSARY.filter(([t,d])=>!f||t.toLowerCase().includes(f)||d.toLowerCase().includes(f)).map(([t,d])=>`<div class="gterm"><b>${t}</b><br><span>${d}</span></div>`).join('')||'<p style="color:var(--muted)">No match. Try a shorter word.</p>'; }
applyI18N('late'); renderGlossary($('glossary')); $('glossSearch').addEventListener('input',e=>renderGlossary($('glossary'),e.target.value));
renderGlossary($('jargonList')); $('jargonSearch').addEventListener('input',e=>renderGlossary($('jargonList'),e.target.value));
$('jargonBtn').addEventListener('click',()=>{ const d=$('jargonDrawer'); d.classList.toggle('open'); if(d.classList.contains('open')) $('jargonSearch').focus(); });
$('jargonClose').addEventListener('click',()=>$('jargonDrawer').classList.remove('open'));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') $('jargonDrawer').classList.remove('open'); });

// ============================================================ LEARNING LAYER: quick checks, progress, facts, reaction test, region game
const LESSON_IDS=['l1','l2','l3','l4','l5','l6','l7','l8','l9','l10','l11','l12','l13','l14','l15'];
const QUICK=tr('QUICK',{
 l1:{q:'Roughly how many neurons does a human brain have?',o:['86 billion','86 million','8.6 trillion','860,000'],a:0,why:'About 86 billion neurons, plus a similar number of glial helper cells.'},
 l2:{q:'A stronger input makes a neuron…',o:['fire more often','fire bigger spikes','fire slower','change colour'],a:0,why:'Spikes are all-or-none. Intensity is coded as spikes per second.'},
 l3:{q:'"Cells that fire together wire together" describes…',o:['synapses getting stronger with correlated timing (LTP)','neurons physically fusing','brain waves','the blood supply'],a:0,why:'Timing-dependent strengthening of synapses is the cellular basis of learning.'},
 l4:{q:'What happens to a network with too little inhibition?',o:['Runaway synchronous firing, like a seizure','It goes silent','It learns faster','Nothing changes'],a:0,why:'Excitation feeds back on itself; GABA interneurons are the brake. Try it in the Network tab.'},
 l5:{q:'Which lobe handles vision?',o:['Occipital','Frontal','Temporal','Parietal'],a:0,why:'The occipital lobe at the back of the head contains the primary visual cortex.'},
 l6:{q:'Which study habit is best supported by how memory works?',o:['Testing yourself, spaced over days, then sleeping','Re-reading the chapter three times in one evening','Highlighting everything important','Studying with music videos on'],a:0,why:'Retrieval strengthens synapses, spacing repeats the strengthening, and sleep consolidates it.'},
 l7:{q:'Which structure is the fast alarm for threat?',o:['Amygdala','Cerebellum','Hippocampus','Thalamus'],a:0,why:'The thalamus sends a crude copy of the input to the amygdala within tens of milliseconds, before the cortex has identified it.'},
 l8:{q:'Which sense skips the thalamus on its way into the brain?',o:['Smell','Vision','Hearing','Touch'],a:0,why:'Smell goes almost straight to the amygdala and hippocampus, which is why it triggers emotional memories.'},
 l9:{q:'Caffeine keeps you awake by…',o:['blocking adenosine receptors','making more dopamine','destroying melatonin','cooling the brain'],a:0,why:'It sits in the receptors that read sleep pressure. The adenosine is still there, hence the later crash.'},
 l10:{q:'Why do teenagers take more risks than adults?',o:['The reward system matures years before the prefrontal "brake"','Their brains are smaller','They have no dopamine','Their amygdala is missing'],a:0,why:'Dopamine reward circuits are mature by ~13; prefrontal control keeps developing until ~25.'},
 l11:{q:'Damage to Broca’s area typically causes…',o:['effortful, halting speech with meaning intact','fluent speech without meaning','blindness','loss of smell'],a:0,why:'Broca’s area assembles speech; Wernicke’s area handles meaning.'},
 l12:{q:'Why can heavy drinking cause memory blackouts?',o:['Alcohol blocks NMDA receptors in the hippocampus, so LTP cannot happen','Alcohol kills the hippocampus instantly','Alcohol removes dopamine','Alcohol speeds up neurons'],a:0,why:'No NMDA activation, no new memory. The person is awake but nothing is being stored.'},
 l13:{q:'Parkinson’s disease is caused by the loss of…',o:['dopamine neurons feeding the basal ganglia','the cerebellum','serotonin in the cortex','the corpus callosum'],a:0,why:'Without dopamine the basal ganglia cannot initiate and smooth movements.'},
 l14:{q:'fMRI measures…',o:['changes in blood flow','individual spikes','neurotransmitter levels','skull temperature'],a:0,why:'Blood flow is a slow, indirect proxy for neural activity. "Lights up" means more blood, not "the centre of".'},
 l15:{q:'What did patient H.M. teach neuroscience?',o:['The hippocampus is needed to form new long-term memories','The frontal lobe controls personality','Vision is built from edges','Neurons use electricity'],a:0,why:'After losing both hippocampi in 1953 he could learn skills but never new facts or events.'}
});
const FACTS=tr('FACTS',['Your brain generates about 20 watts of power, enough to run a dim light bulb, and uses about 20% of your energy while being 2% of your weight.','Your brain has roughly a thousand times more synapses than the Milky Way has stars: about 100 trillion against 100–400 billion.','Information travels along myelinated axons at up to 120 metres per second, about 430 km/h.','The brain itself has no pain receptors. Brain surgery can be done while the patient is awake and talking.','Every night your brain shrinks the synapses it grew during the day by about 20%, keeping only the strongest.','You have a second "brain" in your gut: about 500 million neurons that talk to the main one through the vagus nerve.','Reading this sentence engages your visual cortex, Wernicke’s area, working memory and a silent version of Broca’s area.','The cerebellum is 10% of brain volume but holds about 69 billion neurons, more than the rest of the brain combined.','A fruit fly brain, with 140,000 neurons, was fully mapped in 2024. A human brain has about 600,000 times more.','Learning to juggle for three months visibly thickens the motion-processing cortex, and it thins again if you stop.','Smell is the only sense wired almost directly to memory and emotion, bypassing the thalamus.','Yawning may be the brain cooling itself: a big breath of cool air lowers brain temperature slightly.','Your brain is about 60% fat by dry weight, mostly in myelin.','The hippocampus of London taxi drivers grows measurably while they memorise 25,000 streets.','Learning something new, exercise, sleep and social contact are the best-supported habits for protecting an ageing brain.','During REM sleep your muscles are paralysed by the brainstem so you do not act out your dreams.','A single neuron can connect to 10,000 others, and the whole brain holds about 100 trillion connections.','Neurons in the retina start processing an image before it reaches the brain: edges and motion are detected in the eye.']);
// progress
function loadProg(){ try{ return JSON.parse(localStorage.getItem('brainlab.progress')||'{}'); }catch(e){ return {}; } }
function saveProg(p){ try{ localStorage.setItem('brainlab.progress',JSON.stringify(p)); }catch(e){} }
let prog=loadProg();
const BADGES=tr('BADGES',[[1,'🔬 First step'],[4,'⚡ Neuron novice'],[8,'🔗 Synapse scholar'],[12,'🧠 Brain explorer'],[15,'🏆 Brain master']]);
function renderProgress(){ const n=LESSON_IDS.filter(id=>prog[id]).length, N=LESSON_IDS.length; const pct=Math.round(n/N*100);
  const badges=BADGES.map(([k,name])=>`<span class="badge ${n>=k?'earned':''}" title="${k} lessons">${name}</span>`).join('');
  const html=`<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--muted)"><span>${t('progress','Your progress')}</span><b style="color:var(--text)">${n} / ${N} ${t('lessons','lessons')} · ${pct}%</b></div><div class="pbar"><div style="width:${pct}%"></div></div><div>${badges}</div>${n?'<button class="btn small" id="progReset" style="margin-top:6px">'+t('resetprog','Reset progress')+'</button>':''}`;
  $('progressBox').innerHTML=html; $('progressSide').innerHTML=`<h3>${t('progressH','Progress')}</h3><div class="pbar"><div style="width:${pct}%"></div></div><p style="font-size:12.5px;color:var(--muted);margin:0">${n} / ${N} ${t('lessonsLearned','lessons learned. Answer a quick check or press "Mark as learned" at the end of a lesson.')}</p>`;
  LESSON_IDS.forEach(id=>{ const b=$(id).querySelector('.lfoot button'); if(b){ b.classList.toggle('done',!!prog[id]); b.textContent=prog[id]?t('learned','✓ Learned'):t('mark','Mark as learned'); } });
  const r=$('progReset'); if(r) r.addEventListener('click',()=>{ prog={}; saveProg(prog); renderProgress(); }); }
function markLearned(id,v=true){ prog[id]=v; if(!v) delete prog[id]; saveProg(prog); renderProgress(); }
LESSON_IDS.forEach(id=>{ const card=$(id); const q=QUICK[id]; const idx=shuffle([0,1,2,3]);
  const d=document.createElement('div'); d.className='qc'; d.innerHTML=`<b>${t('quickcheck','Quick check:')}</b> ${q.q}<div class="opts">${idx.map(i=>`<button data-i="${i}">${q.o[i]}</button>`).join('')}</div><div class="why"></div>`; card.appendChild(d);
  d.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ if(d.dataset.done) return; const i=+b.dataset.i; if(i===q.a){ d.dataset.done=1; b.classList.add('right'); d.querySelector('.why').textContent='✓ '+q.why; markLearned(id); } else { b.classList.add('wrong'); d.querySelector('.why').textContent=t('notquite','Not quite. Re-read the lesson and try again.'); } }));
  const f=document.createElement('div'); f.className='lfoot'; f.innerHTML=`<button class="btn small">${t('mark','Mark as learned')}</button><span>${t('lesson','Lesson')} ${id.slice(1)} / ${LESSON_IDS.length}</span>`; card.appendChild(f); f.querySelector('button').addEventListener('click',()=>markLearned(id,!prog[id])); });
renderProgress();
let factI=Math.floor(Math.random()*FACTS.length); function showFact(){ $('factText').textContent=FACTS[factI]; } showFact(); $('factNext').addEventListener('click',()=>{ factI=(factI+1)%FACTS.length; showFact(); });
$('logoHome').addEventListener('click',e=>{ e.preventDefault(); document.querySelector('#nav button[data-tab=start]').click(); });
// favicon from the logo
try{ const svg=document.querySelector('.logomark').outerHTML.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '); const link=document.createElement('link'); link.rel='icon'; link.type='image/svg+xml'; link.href='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg); document.head.appendChild(link); }catch(e){}
// reaction time test
const rt={state:'idle',t0:0,timer:null,results:[]}; const rtPad=$('rtPad'), rtOut=$('rtOut');
function rtArm(){ rt.state='wait'; rtPad.className='wait'; rtPad.textContent='Wait for green…'; rt.timer=setTimeout(()=>{ rt.state='go'; rtPad.className='go'; rtPad.textContent='CLICK!'; rt.t0=performance.now(); },1500+Math.random()*2500); }
$('rtStart').addEventListener('click',()=>{ rt.results=[]; rtOut.textContent=''; rtArm(); });
rtPad.addEventListener('pointerdown',()=>{ if(rt.state==='wait'){ clearTimeout(rt.timer); rt.state='idle'; rtPad.className=''; rtPad.textContent='Too early! Press Start again.'; return; } if(rt.state!=='go') return; const ms=Math.round(performance.now()-rt.t0); rt.results.push(ms); rt.state='idle'; rtPad.className=''; rtPad.textContent=ms+' ms';
  if(rt.results.length<5){ rtOut.textContent=`Tries: ${rt.results.join(', ')} ms`; setTimeout(rtArm,700); } else { const best=Math.min(...rt.results), avg=Math.round(rt.results.reduce((a,b)=>a+b)/5); rtOut.innerHTML=`Tries: ${rt.results.join(', ')} ms · <b>best ${best} ms, average ${avg} ms</b>. ${avg<220?'Fast: your visual and motor pathways are in top form.':avg<300?'Typical adult range. Sleep, caffeine and practice all shift this by tens of milliseconds.':'Slower than average right now: tiredness, distraction or a slow screen all add time.'}`; } });
// find-the-region game
const find={active:false,target:null,round:0,score:0,prev:null};
function findPool(){ const base=['frontal','parietal','occipital','temporal','cerebellum','brainstem']; const x=$('xray3d'); return (x&&x.checked)?base.concat(['thalamus','basal','hippocampus','amygdala','hypothalamus']):base; }
function findNext(){ const pool=findPool().filter(i=>i!==find.prev); find.target=pool[Math.floor(Math.random()*pool.length)]; find.prev=find.target; $('findPrompt').innerHTML=`Round ${find.round+1}/8 · click the <b style="color:var(--warn)">${REGIONS.find(r=>r.id===find.target).name}</b>`; }
$('findStart').addEventListener('click',()=>{ find.active=true; find.round=0; find.score=0; find.prev=null; findNext(); });
function findCheck(id){ if(!find.active||!find.target) return; const ok=id===find.target; if(ok) find.score++; const tn=REGIONS.find(r=>r.id===find.target).name, cn=REGIONS.find(r=>r.id===id).name; find.round++; find.target=null;
  $('findPrompt').innerHTML=ok?`<span style="color:var(--good)">✓ Correct, that is the ${tn}.</span>`:`<span style="color:var(--bad)">✗ That was the ${cn}. The target was the ${tn}.</span>`;
  if(find.round>=8){ find.active=false; const s=find.score; setTimeout(()=>{ $('findPrompt').innerHTML+=` <b>Final score ${s}/8.</b> ${s>=7?'Excellent: you know your way around the brain.':s>=5?'Good. Review the lobes in Lesson 5 and try again.':'Keep going: read Lesson 5, then play again.'}`; },300); } else setTimeout(findNext,1100); }

// ============================================================ LANGUAGE CLASS
// --- 1. timeline ---
const LAREAS=tr('LAREAS',{pfc:{n:'Prefrontal cortex',sub:'effort, working memory',x:150,y:150},broca:{n:'Broca’s area',sub:'assembles speech',x:228,y:212},motor:{n:'Motor cortex',sub:'mouth and tongue',x:280,y:120},bg:{n:'Basal ganglia',sub:'automatic habits',x:300,y:195,deep:true},a1:{n:'Auditory cortex',sub:'hears the sounds',x:322,y:250},wern:{n:'Wernicke’s area',sub:'meaning',x:398,y:238},hip:{n:'Hippocampus',sub:'new memories',x:345,y:292,deep:true},v1:{n:'Visual cortex',sub:'reading',x:522,y:205},cb:{n:'Cerebellum',sub:'corrects errors',x:470,y:330}});
const LCONN=[['a1','wern','M 322 250 C 350 230 370 232 398 238'],['wern','broca','M 398 238 C 360 160 280 160 228 212'],['broca','motor','M 228 212 C 240 170 260 140 280 120'],['pfc','broca','M 150 150 C 180 170 200 195 228 212'],['bg','motor','M 300 195 C 295 165 290 140 280 120'],['bg','broca','M 300 195 C 275 205 250 212 228 212'],['motor','cb','M 280 120 C 420 90 500 200 470 330'],['cb','motor','M 470 330 C 380 300 300 230 280 120'],['wern','hip','M 398 238 C 380 265 365 280 345 292'],['hip','wern','M 345 292 C 370 290 390 265 398 238'],['v1','wern','M 522 205 C 480 215 440 230 398 238'],['a1','hip','M 322 250 C 330 270 338 280 345 292']];
const STAGES=tr('STAGES',[
 {t:'Day 1 · first contact',text:'Everything is slow and effortful. The prefrontal cortex runs at full power to hold strange sounds in working memory. The auditory cortex has no categories for the new sounds yet (two different sounds may be heard as one). The hippocampus records every word as a new event. Speech comes out clumsy: Broca’s area and the mouth muscles have no programme for these movements.',
  kid:'For students: your brain is cutting a brand-new path through a forest. It is slow because the path does not exist yet, not because you are bad at it.',
  act:{pfc:1,broca:.4,motor:.4,bg:.1,a1:.7,wern:.3,hip:.9,v1:.5,cb:.5},effort:1,conn:[1,1,1,2,0.5,0.5,1,1,1,0.5,1,1],m:{effort:95,speed:10,accuracy:20,auto:5,myelin:5,vocab:10}},
 {t:'Week 2 · patterns appear',text:'Twenty minutes a day, and the auditory cortex begins to tune to the new sounds. Wernicke’s area starts linking sound to meaning. Every night, the hippocampus replays the day’s words to the cortex in sleep. The prefrontal cortex still works hard, but the first greetings no longer need to be assembled from scratch.',
  kid:'For students: the path is now a narrow trail. Each night your sleeping brain walks it again and makes it a little clearer.',
  act:{pfc:.85,broca:.55,motor:.5,bg:.25,a1:.85,wern:.55,hip:.95,v1:.6,cb:.6},effort:.85,conn:[2,2,1.5,2.5,1,1,1.5,1.5,2,2,1.5,1.5],m:{effort:80,speed:25,accuracy:40,auto:15,myelin:15,vocab:120}},
 {t:'Month 2 · first conversations',text:'The Broca-to-mouth loop has been practised thousands of times, and the basal ganglia start to store frequent phrases as ready-made habits. The cerebellum has corrected the pronunciation again and again. Connections thicken and gain myelin; the hippocampus is still busy with new words. After about three months of intensive study, scanners can measure thicker language cortex and a larger hippocampus.',
  kid:'For students: the trail is becoming a road. Simple sentences come out by themselves while you think about what to say next.',
  act:{pfc:.65,broca:.75,motor:.7,bg:.55,a1:.9,wern:.75,hip:.85,v1:.7,cb:.75},effort:.6,conn:[3,3,3,2,2,2,2.5,2.5,2.5,2.5,2,2],m:{effort:60,speed:45,accuracy:60,auto:40,myelin:35,vocab:500}},
 {t:'Month 6 · thinking in the language',text:'Common words are now stored directly in the cortex and no longer need the hippocampus. Wernicke’s and Broca’s areas talk through a thick, fast cable (the arcuate fasciculus). The basal ganglia handle grammar patterns automatically and the prefrontal cortex can relax and plan ideas instead of words. Effort drops, speed rises.',
  kid:'For students: the road is paved. You can drive it while talking to a friend, because your brain no longer has to watch every step.',
  act:{pfc:.4,broca:.85,motor:.85,bg:.8,a1:.9,wern:.9,hip:.6,v1:.8,cb:.8},effort:.35,conn:[4,4.5,4,1.5,3.5,3.5,3,3,2,3,3,1.5],m:{effort:35,speed:70,accuracy:75,auto:70,myelin:60,vocab:1500}},
 {t:'Year 1+ · fluent',text:'The language network now looks almost like a native speaker’s, with slightly more frontal involvement. Thousands of spaced repetitions have left thicker cortex, more myelin and a trained executive system that switches between languages. The hippocampus is only needed for new, rare words. The brain built all this one short session at a time.',
  kid:'For students: a motorway. And the brain that built it is now better at building the next one: learning a third language is easier than the second.',
  act:{pfc:.3,broca:.95,motor:.95,bg:.95,a1:.95,wern:.95,hip:.4,v1:.9,cb:.85},effort:.15,conn:[5,5.5,5,1.2,4.5,4.5,3.5,3.5,1.5,2,4,1],m:{effort:15,speed:90,accuracy:90,auto:90,myelin:85,vocab:3000}},
 {t:'What if you stop for a year?',text:'Unused synapses weaken and the vocabulary fades, fastest for rare words. But the road is not erased: the myelinated cables and the motor programmes largely remain, so relearning is several times faster than learning the first time (this is called "savings"). Ten minutes a week is enough to keep most of it.',
  kid:'For students: a road with weeds. It needs clearing, but you do not have to cut through the forest again.',
  act:{pfc:.6,broca:.6,motor:.6,bg:.7,a1:.7,wern:.65,hip:.4,v1:.6,cb:.6},effort:.55,conn:[3,3.5,3.5,1.8,3,3,2.5,2.5,1,1.5,2.5,1],m:{effort:55,speed:55,accuracy:55,auto:60,myelin:70,vocab:1200}}
]);
const METERS=tr('METERS',[['effort','Mental effort','#ff6b81'],['speed','Speed of speech','#4fc3f7'],['accuracy','Accuracy','#66d9a8'],['auto','Automatic (no thinking)','#ffd166'],['myelin','Myelin on the cables','#f1faee'],['vocab','Words stored','#c792ea']]);
let stageI=0, stageTimer=null;
(function buildLangSvg(){ const s=$('langSvg'); const NS='http://www.w3.org/2000/svg'; const el=(t,a)=>{ const e=document.createElementNS(NS,t); for(const k in a) e.setAttribute(k,a[k]); return e; };
  const defs=el('defs',{}); defs.innerHTML='<filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'; s.appendChild(defs);
  s.appendChild(el('path',{d:'M 95 230 C 60 180 80 90 170 70 C 230 40 330 40 400 65 C 480 85 560 130 560 200 C 560 250 525 285 475 295 C 445 325 400 330 372 318 C 335 332 270 334 232 312 C 172 322 110 290 95 230 Z',fill:'#131a2b',stroke:'#3b4a6b','stroke-width':'2'}));
  s.appendChild(el('path',{d:'M 440 300 C 480 292 520 305 530 330 C 535 355 500 372 462 366 C 435 360 425 330 440 300 Z',fill:'#131a2b',stroke:'#3b4a6b','stroke-width':'2'}));
  s.appendChild(el('path',{d:'M 400 318 L 430 322 L 428 385 L 404 385 Z',fill:'#131a2b',stroke:'#3b4a6b','stroke-width':'2'}));
  s.appendChild(el('path',{d:'M 150 250 C 230 228 320 218 405 214',fill:'none',stroke:'#2a3550','stroke-width':'3','stroke-linecap':'round'}));
  s.appendChild(el('path',{d:'M 300 70 C 292 130 283 180 272 216',fill:'none',stroke:'#2a3550','stroke-width':'3','stroke-linecap':'round'}));
  const t=el('text',{x:30,y:385,class:'sub'}); t.textContent='front ←   left hemisphere, side view   → back'; s.appendChild(t);
  const cg=el('g',{id:'lconn'}); s.appendChild(cg); LCONN.forEach((c,i)=>{ cg.appendChild(el('path',{id:'lc'+i,d:c[2],fill:'none',stroke:'#4fc3f7','stroke-width':'1','stroke-opacity':'0.5','stroke-linecap':'round'})); });
  const pg=el('g',{id:'lparts'}); s.appendChild(pg);
  const ag=el('g',{id:'lareas'}); s.appendChild(ag);
  for(const id in LAREAS){ const a=LAREAS[id]; const c=el('circle',{id:'la-'+id,cx:a.x,cy:a.y,r:a.deep?13:16,fill:'#ffd166','fill-opacity':'0.3',stroke:a.deep?'#fff':'none','stroke-dasharray':a.deep?'3 3':'','stroke-width':'1.2',filter:'url(#glow)'}); ag.appendChild(c);
    const l=el('text',{x:a.x,y:a.y+(a.deep?26:28),class:'lbl','text-anchor':'middle'}); l.textContent=a.n; ag.appendChild(l); const l2=el('text',{x:a.x,y:a.y+(a.deep?38:40),class:'sub','text-anchor':'middle'}); l2.textContent=a.sub; ag.appendChild(l2); }
  $('stageBtns').innerHTML=STAGES.map((st,i)=>`<button data-i="${i}">${st.t.split(' · ')[0]}</button>`).join(''); $('stageBtns').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>showStage(+b.dataset.i)));
  $('meters').innerHTML=METERS.map(([k,n,col])=>`<div class="meter"><span>${n}</span><div class="track"><div class="fill" id="mt_${k}" style="background:${col};width:0"></div></div><span class="val" id="mv_${k}"></span></div>`).join('');
})();
function showStage(i){ stageI=Math.max(0,Math.min(STAGES.length-1,i)); const st=STAGES[stageI]; $('stageBtns').querySelectorAll('button').forEach((b,k)=>b.classList.toggle('on',k===stageI));
  $('stageTitle').textContent=st.t; $('stageText').textContent=st.text; $('stageKid').textContent=st.kid;
  for(const id in LAREAS){ const c=$('la-'+id); const a=st.act[id]||0; const isPfc=id==='pfc'; c.setAttribute('fill',isPfc?`rgb(255,${Math.round(209-150*st.effort)},${Math.round(102-50*st.effort)})`:'#ffd166'); c.setAttribute('fill-opacity',(0.15+0.75*a).toFixed(2)); c.setAttribute('r',(LAREAS[id].deep?10:12)+8*a); }
  const parts=$('lparts'); parts.innerHTML=''; const NS='http://www.w3.org/2000/svg';
  LCONN.forEach((c,i)=>{ const w=st.conn[i]; const p=$('lc'+i); p.setAttribute('stroke-width',w); p.setAttribute('stroke-opacity',Math.min(0.9,0.25+w*0.12)); const n=Math.max(1,Math.round(w)); for(let k=0;k<n;k++){ const dot=document.createElementNS(NS,'circle'); dot.setAttribute('r',2.2+w*0.25); dot.setAttribute('fill','#fff'); const am=document.createElementNS(NS,'animateMotion'); am.setAttribute('dur',(3.2/Math.max(0.6,w*0.6)).toFixed(2)+'s'); am.setAttribute('repeatCount','indefinite'); am.setAttribute('begin',(-k*3/n).toFixed(2)+'s'); const mp=document.createElementNS(NS,'mpath'); mp.setAttributeNS('http://www.w3.org/1999/xlink','href','#lc'+i); am.appendChild(mp); dot.appendChild(am); parts.appendChild(dot); } });
  METERS.forEach(([k])=>{ const v=st.m[k]; $('mt_'+k).style.width=(k==='vocab'?Math.min(100,v/30):v)+'%'; $('mv_'+k).textContent=k==='vocab'?v.toLocaleString():v+'%'; }); }
$('stagePrev').addEventListener('click',()=>showStage(stageI-1)); $('stageNext').addEventListener('click',()=>showStage(stageI+1));
$('stageAuto').addEventListener('click',e=>{ if(stageTimer){ clearInterval(stageTimer); stageTimer=null; e.target.textContent='▶ Auto-play'; return; } showStage(0); e.target.textContent='■ Stop'; stageTimer=setInterval(()=>{ if(stageI>=STAGES.length-1){ clearInterval(stageTimer); stageTimer=null; e.target.textContent='▶ Auto-play'; return; } showStage(stageI+1); },9000); });
showStage(0);
// --- 2. practice simulator ---
// Memory model (simplified spaced-repetition science): each word has a stability S (days); recall chance R = exp(-gap/S).
// A successful recall after a gap multiplies S (bigger gap, up to S itself, = bigger boost: the spacing effect).
// Massed repetition (gap ≈ 0) gives only a small boost. A failed recall resets S to a little above new (relearning savings).
function recallBoost(S,gap,gain){ return 1.15+1.35*gain*Math.min(1,gap/S); }
function simLearner(sessions,minutes,weeks,sleep,recall){ const days=weeks*7; const words=[]; const curve=new Float32Array(days+1); const S0=sleep?2:1; const gain=recall?1.0:0.55;
  const dayOfWeek=[]; for(let k=0;k<sessions;k++) dayOfWeek.push(Math.round(k*7/sessions)%7);
  for(let d=0;d<=days;d++){ if(dayOfWeek.includes(d%7)&&d<days){ let budget=minutes; // review due words first (up to 60% of the session), most-forgotten first
      const due=words.filter(w=>Math.exp(-(d-w.t)/w.S)<0.8).sort((a,b)=>Math.exp(-(d-a.t)/a.S)-Math.exp(-(d-b.t)/b.S)); let rb=minutes*0.6;
      for(const w of due){ if(rb<0.5) break; rb-=0.5; budget-=0.5; const R=Math.exp(-(d-w.t)/w.S); if(R>0.35){ w.S=w.S*recallBoost(w.S,d-w.t,gain); } else { w.S=S0*1.3; } w.t=d; }
      const n=Math.floor(budget/3); for(let i=0;i<n;i++) words.push({S:S0,t:d}); }
    let kept=0; for(const w of words) kept+=Math.exp(-(d-w.t)/w.S); curve[d]=kept; }
  let durable=0; for(const w of words) if(w.S>30) durable++; let last=0; for(let d=days-6;d<=days;d++) last+=curve[d]; last/=7;
  return {curve,total:words.length,durable,last}; }
function runSim(){ const aS=+$('aS').value,aM=+$('aM').value,bS=+$('bS').value,bM=+$('bM').value,W=+$('simW').value,sleep=$('simSleep').checked,recall=$('simRecall').checked;
  $('aS_o').textContent=aS; $('aM_o').textContent=aM+' min'; $('bS_o').textContent=bS; $('bM_o').textContent=bM+' min'; $('simW_o').textContent=W;
  const A=simLearner(aS,aM,W,sleep,recall), B=simLearner(bS,bM,W,sleep,recall); const ta=aS*aM, tb=bS*bM;
  $('simTotals').innerHTML=`A: <b>${ta}</b> min/week · B: <b>${tb}</b> min/week ${ta===tb?'<span style="color:var(--good)">(equal time)</span>':''}`;
  const mx=Math.max(50,Math.max(...A.curve,...B.curve)*1.1);
  plot($('simChart'),[{data:A.curve,color:'#ff8a65',width:2,label:'Learner A words remembered'},{data:B.curve,color:'#4fc3f7',width:2,label:'Learner B words remembered'}],{x0:0,x1:W,y0:0,y1:mx,title:'Words still remembered (sum of memory strength) over the weeks',xlabel:'weeks'});
  const ka=Math.round(A.last), kb=Math.round(B.last);
  $('simOut').innerHTML=`<span>A studied <b>${A.total}</b> words · remembers <b>${ka}</b> in a typical week · <b>${A.durable}</b> durable (would survive a month off)</span><span>B studied <b>${B.total}</b> words · remembers <b>${kb}</b> · <b>${B.durable}</b> durable</span><span style="color:var(--warn)">${kb>ka?(ka>=5?`B keeps ${(kb/ka).toFixed(1)}× more with the same time`:'B keeps far more; A keeps almost nothing'):kb<ka?`A keeps more this time`:'equal'}</span>`;
  // single-word curves
  const days=20, N=400; const xs=Array.from({length:N},(_,i)=>i/(N-1)*days); const mass=[],spaced=[];
  const sched=(rev,S0f,gainF)=>{ let S=S0f,t=0; const out=[]; let ri=0; for(let i=0;i<N;i++){ const d=xs[i]; while(ri<rev.length&&rev[ri]<=d){ const gap=rev[ri]-t; const R=Math.exp(-gap/S); S=R>0.35?S*recallBoost(S,gap,gainF):S0f*1.3; t=rev[ri]; ri++; } out.push(Math.exp(-(d-t)/S)*100); } return out; };
  const S0=sleep?2:1, g=recall?1:0.55; mass.push(...sched([0.05,0.1,0.15],S0,g)); spaced.push(...sched([1,4,11],S0,g));
  plot($('curveChart'),[{data:mass,x:xs,color:'#ff8a65',width:2,label:'4× in one evening'},{data:spaced,x:xs,color:'#4fc3f7',width:2,label:'spaced recall (day 2, 5, 12)'}],{x0:0,x1:days,y0:0,y1:100,title:'One word: chance of remembering it (%)',xlabel:'days',hlines:[{y:50,color:'#3b4a6b',label:'50%'}]}); }
['aS','aM','bS','bM','simW'].forEach(id=>$(id).addEventListener('input',runSim)); ['simSleep','simRecall'].forEach(id=>$(id).addEventListener('change',runSim));
// --- 3. class word test ---
const WT=tr('WT',[['kirja','book'],['koira','dog'],['talo','house'],['vesi','water'],['kissa','cat'],['leipä','bread'],['kukka','flower'],['aurinko','sun'],['kuu','moon'],['ystävä','friend']]);
let wtTick=null;
$('wtStart').addEventListener('click',()=>{ $('wtWords').innerHTML=WT.map(([f,e])=>`<div><b>${f}</b><span>${e}</span></div>`).join(''); $('wtRecall').style.display='none'; $('wtWhy').style.display='none'; $('wtExplain').style.display='none'; $('wtScore').textContent=''; let left=30; $('wtTimer').textContent=left+' s'; clearInterval(wtTick);
  wtTick=setInterval(()=>{ left--; $('wtTimer').textContent=left+' s'; if(left<=0){ clearInterval(wtTick); $('wtWords').innerHTML='<div style="grid-column:1/-1">Hidden. Count backwards from 20 together, then write what you remember.</div>'; $('wtRecall').style.display=''; $('wtExplain').style.display=''; $('wtTimer').textContent='recall'; } },1000); });
$('wtCheck').addEventListener('click',()=>{ const typed=$('wtInput').value.toLowerCase().split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean); const hit=WT.filter(([f,e])=>typed.some(t=>t===f||t===e||(t.length>3&&(f.startsWith(t)||e.startsWith(t))))); $('wtScore').innerHTML=`You remembered <b>${hit.length} / 10</b>: ${hit.map(h=>h[0]).join(', ')||'none yet'}.`; });
$('wtExplain').addEventListener('click',()=>{ $('wtWhy').style.display=''; $('wtWhy').innerHTML=`<b>What just happened in the brain.</b><ul><li>Most people get 4 to 7. That is the capacity of a single pass through working memory, with no sleep and no repetition.</li><li>The first and last words are remembered best (primacy and recency): the first got the most rehearsal, the last are still in working memory.</li><li>Words that made a picture or a feeling (sun, moon, friend) survive better: two codes (sound + image) give the hippocampus two routes.</li><li>Tomorrow, without practice, most of these will be gone. One recall tonight and one tomorrow would keep most of them: that is the whole point of the simulator above.</li></ul>`; });
// --- 4. jump to 3D scenarios ---
document.querySelectorAll('#lang3d [data-scn]').forEach(b=>b.addEventListener('click',()=>{ document.querySelector('#nav button[data-tab=live]').click(); if(window.openLiveScenario) setTimeout(()=>window.openLiveScenario(b.dataset.scn),200); }));
// --- presentation mode ---
$('presentBtn').addEventListener('click',()=>{ const on=document.body.classList.toggle('present'); $('presentBtn').textContent=on?'✕ Exit presentation':'🖥 Presentation mode'; try{ if(on&&document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); else if(!on&&document.fullscreenElement) document.exitFullscreen(); }catch(e){} });
document.addEventListener('fullscreenchange',()=>{ if(!document.fullscreenElement&&document.body.classList.contains('present')){ document.body.classList.remove('present'); $('presentBtn').textContent='🖥 Presentation mode'; } });

// ============================================================ PROGRAMMING BRAIN
const CAREAS={dlpfc:{n:'Dorsolateral prefrontal',sub:'working memory, planning',x:160,y:140},ifg:{n:'Inferior frontal (BA 44/47)',sub:'syntax, chunking',x:232,y:212},sma:{n:'Premotor / SMA (BA 6)',sub:'sequencing steps',x:300,y:92},acc:{n:'Anterior cingulate',sub:'error and conflict monitoring',x:250,y:135,deep:true},bg:{n:'Basal ganglia / dopamine',sub:'reward, habit',x:305,y:188,deep:true},ins:{n:'Insula',sub:'"something is wrong"',x:335,y:228,deep:true},mtg:{n:'Middle temporal (BA 21)',sub:'meaning of identifiers',x:395,y:258,},ipl:{n:'Inferior parietal (BA 40)',sub:'integrating symbols, attention',x:430,y:150},spatial:{n:'Right parietal (far side)',sub:'spatial reasoning',x:490,y:110,deep:true},v1:{n:'Visual cortex',sub:'reading the screen',x:525,y:210},hip:{n:'Hippocampus',sub:'new memories',x:350,y:292,deep:true},dmn:{n:'Default mode (medial)',sub:'mind-wandering',x:330,y:55,deep:true}};
const CCONN=[['v1','mtg','M 525 210 C 480 240 440 255 395 258'],['v1','ipl','M 525 210 C 500 180 470 160 430 150'],['mtg','ifg','M 395 258 C 340 200 290 200 232 212'],['ipl','dlpfc','M 430 150 C 350 100 240 100 160 140'],['ifg','dlpfc','M 232 212 C 210 190 185 165 160 140'],['dlpfc','sma','M 160 140 C 200 100 250 90 300 92'],['acc','dlpfc','M 250 135 C 220 130 190 135 160 140'],['ins','acc','M 335 228 C 300 200 270 165 250 135'],['bg','dlpfc','M 305 188 C 260 180 200 165 160 140'],['hip','mtg','M 350 292 C 370 280 385 270 395 258'],['mtg','hip','M 395 258 C 380 275 365 285 350 292'],['spatial','ipl','M 490 110 C 470 120 450 135 430 150'],['dlpfc','dmn','M 160 140 C 220 80 280 60 330 55']];
const CSTATES={
 read:{novice:{t:'Reading and tracing code · novice',text:'The executive network (dorsolateral prefrontal + inferior parietal) runs near capacity holding variable values; the inferior frontal and middle temporal regions decode identifiers and syntax; premotor areas simulate execution. Activation is high and widespread, and the hippocampus is busy storing the example.',feel:'The student feels: "I have to keep everything in my head at once." Load rises with every extra variable and every unfamiliar name.',act:{dlpfc:.95,ifg:.8,sma:.6,acc:.5,bg:.3,ins:.3,mtg:.8,ipl:.85,spatial:.4,v1:.9,hip:.7,dmn:.1},conn:[2,2,2.5,3,2.5,2,1.5,1,1,2,2,1,0.5],load:[75,55,60],ev:'Siegmund et al. 2014; Ivanova et al. 2020; Peitek et al. 2021.'},
        expert:{t:'Reading and tracing code · expert',text:'The same code produces much lower activation: beacons guide the eyes, chunks replace lines, and the language regions process code almost like familiar prose. Prefrontal cortex is only lightly engaged.',feel:'The expert feels: "a filter, then a sum, then a print". Nothing to hold, just to recognise.',act:{dlpfc:.45,ifg:.55,sma:.35,acc:.3,bg:.5,ins:.35,mtg:.6,ipl:.55,spatial:.3,v1:.8,hip:.25,dmn:.15},conn:[2.5,2,3,1.5,2,1,1,1,2,0.8,0.8,0.8,0.5],load:[30,15,25],ev:'Siegmund et al. 2017 (neural efficiency); Floyd et al. 2017 (code becomes language-like).'}},
 debug:{novice:{t:'Finding a bug · novice',text:'The anterior cingulate registers the expected-vs-actual conflict, prefrontal cortex generates hypotheses, and the novice has to trace line by line because no intuitive "error feeling" exists yet. Working memory is at its limit and frustration raises cortisol.',feel:'"It should work. I don’t know where to look." Every line is a suspect.',act:{dlpfc:.95,ifg:.7,sma:.5,acc:.9,bg:.4,ins:.5,mtg:.7,ipl:.85,spatial:.4,v1:.9,hip:.5,dmn:.1},conn:[2,2.5,2,3,2,1.5,3,1.5,1,1,1,1,0.5],load:[85,60,50],ev:'Castelhano et al. 2019 (expert insula signal absent in novices); Fritz et al. 2014 (physiological load).'},
        expert:{t:'Finding a bug · expert',text:'The insula and anterior cingulate flag the faulty line as the eyes pass it, before analysis. Verification is quick; prefrontal load stays moderate.',feel:'"That line smells wrong." Then a short check confirms it.',act:{dlpfc:.6,ifg:.5,sma:.4,acc:.75,bg:.5,ins:.9,mtg:.5,ipl:.6,spatial:.3,v1:.8,hip:.3,dmn:.1},conn:[2,2,2,2,1.5,1.5,3,3,1.5,0.8,0.8,0.8,0.5],load:[40,20,30],ev:'Castelhano et al. 2019.'}},
 write:{novice:{t:'Writing code from a problem statement · novice',text:'Planning subgoals, retrieving patterns from the hippocampus, assembling syntax in inferior frontal cortex and typing all compete for working memory. This is the highest-load, highest-learning task: the student generates everything.',feel:'"I know what it should do, but not how to start." Each subgoal that gets written is a small success.',act:{dlpfc:1,ifg:.85,sma:.9,acc:.7,bg:.4,ins:.3,mtg:.6,ipl:.7,spatial:.4,v1:.6,hip:.8,dmn:.1},conn:[1.5,1.5,2.5,2.5,3,3.5,2,1,1.5,2.5,2.5,1,0.5],load:[90,50,85],ev:'Krueger et al. 2020 (code writing engages attention/working-memory regions); Margulieux (subgoal labels); generation effect.'},
        expert:{t:'Writing code from a problem statement · expert',text:'Chunks are retrieved as habits from the basal ganglia and sequenced by premotor cortex; syntax is automatic. Prefrontal cortex spends its capacity on design decisions rather than on the next line.',feel:'"Loop, accumulate, return." The hands are ahead of conscious thought.',act:{dlpfc:.55,ifg:.6,sma:.8,acc:.4,bg:.85,ins:.3,mtg:.5,ipl:.5,spatial:.3,v1:.5,hip:.3,dmn:.1},conn:[1,1,2,1.5,2,3,1,0.8,3,0.8,0.8,0.8,0.5],load:[35,15,35],ev:'Chase & Simon chunking; Soloway & Ehrlich 1984 (programming plans).'}},
 data:{novice:{t:'Manipulating a data structure · novice',text:'Mentally rotating a tree or walking a linked list recruits spatial-reasoning regions in parietal cortex, especially on the right, alongside the executive network. Students with weaker spatial skills find this hardest, and spatial training helps.',feel:'"Where does the pointer go now?" The student draws boxes and arrows on paper.',act:{dlpfc:.85,ifg:.4,sma:.5,acc:.5,bg:.3,ins:.3,mtg:.4,ipl:.9,spatial:.95,v1:.8,hip:.5,dmn:.1},conn:[1,3,1,3,1,1.5,1.5,1,1,1,1,3.5,0.5],load:[80,45,60],ev:'Huang et al. 2019 (fMRI/fNIRS); Cooper et al. 2015 (spatial-skills training improves CS1).'},
        expert:{t:'Manipulating a data structure · expert',text:'The structure is a known shape with known operations; spatial regions still engage but the executive network is barely loaded.',feel:'"It’s a rotation." One picture, not a sequence of steps.',act:{dlpfc:.45,ifg:.3,sma:.4,acc:.3,bg:.5,ins:.3,mtg:.3,ipl:.6,spatial:.7,v1:.7,hip:.25,dmn:.15},conn:[1,2,1,1.5,1,1,1,0.8,1.5,0.8,0.8,2.5,0.5],load:[30,15,25],ev:'Huang et al. 2019.'}},
 ai:{novice:{t:'Reading a complete solution before attempting · novice',text:'Visual and language regions read the answer fluently; the executive network is only lightly engaged, the hippocampus encodes weakly, dopamine has no prediction error to signal, and the default mode network drifts. It feels like understanding.',feel:'"Yes, that makes sense." A week later: "I had this… how did it go?"',act:{dlpfc:.35,ifg:.5,sma:.2,acc:.2,bg:.2,ins:.2,mtg:.6,ipl:.5,spatial:.3,v1:.8,hip:.35,dmn:.45},conn:[2,1.5,1.5,1,1,0.5,0.5,0.5,0.5,0.8,0.5,0.5,2],load:[20,20,15],ev:'Prather et al. 2024 (illusion of competence); Roediger & Karpicke 2006; Slamecka & Graf 1978.'},
        expert:{t:'Reading a complete solution · expert',text:'An expert reads a solution as a check against their own plan: the hippocampus compares, the cingulate flags disagreements, and the answer is integrated into an existing schema. For them, reading solutions is efficient learning.',feel:'"Ah, they used a dictionary instead of two lists." The expert extracts the one new idea.',act:{dlpfc:.5,ifg:.5,sma:.3,acc:.55,bg:.45,ins:.35,mtg:.6,ipl:.5,spatial:.3,v1:.8,hip:.5,dmn:.15},conn:[2,1.5,2,1.5,1.5,1,1.5,0.8,1,1.5,1.5,0.5,0.5],load:[30,15,45],ev:'Expertise reversal effect (Kalyuga): worked examples help novices most and experts least.'}}
};
(function buildCodeSvg(){ const s=$('codeSvg'); const NS='http://www.w3.org/2000/svg'; const el=(t,a)=>{ const e=document.createElementNS(NS,t); for(const k in a) e.setAttribute(k,a[k]); return e; };
  const defs=el('defs',{}); defs.innerHTML='<filter id="glow2"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'; s.appendChild(defs);
  s.appendChild(el('path',{d:'M 95 230 C 60 180 80 90 170 70 C 230 40 330 40 400 65 C 480 85 560 130 560 200 C 560 250 525 285 475 295 C 445 325 400 330 372 318 C 335 332 270 334 232 312 C 172 322 110 290 95 230 Z',fill:'#131a2b',stroke:'#3b4a6b','stroke-width':'2'}));
  s.appendChild(el('path',{d:'M 440 300 C 480 292 520 305 530 330 C 535 355 500 372 462 366 C 435 360 425 330 440 300 Z',fill:'#131a2b',stroke:'#3b4a6b','stroke-width':'2'}));
  s.appendChild(el('path',{d:'M 400 318 L 430 322 L 428 385 L 404 385 Z',fill:'#131a2b',stroke:'#3b4a6b','stroke-width':'2'}));
  s.appendChild(el('path',{d:'M 150 250 C 230 228 320 218 405 214',fill:'none',stroke:'#2a3550','stroke-width':'3','stroke-linecap':'round'}));
  s.appendChild(el('path',{d:'M 300 70 C 292 130 283 180 272 216',fill:'none',stroke:'#2a3550','stroke-width':'3','stroke-linecap':'round'}));
  const t=el('text',{x:30,y:385,class:'sub'}); t.textContent='front ←   left hemisphere, side view (dashed = deep or far side)   → back'; s.appendChild(t);
  const cg=el('g',{}); s.appendChild(cg); CCONN.forEach((c,i)=>cg.appendChild(el('path',{id:'cc'+i,d:c[2],fill:'none',stroke:'#4fc3f7','stroke-width':'1','stroke-opacity':'0.5','stroke-linecap':'round'})));
  const pg=el('g',{id:'cparts'}); s.appendChild(pg); const ag=el('g',{}); s.appendChild(ag);
  for(const id in CAREAS){ const a=CAREAS[id]; ag.appendChild(el('circle',{id:'ca-'+id,cx:a.x,cy:a.y,r:a.deep?13:16,fill:'#ffd166','fill-opacity':'0.3',stroke:a.deep?'#fff':'none','stroke-dasharray':a.deep?'3 3':'','stroke-width':'1.2',filter:'url(#glow2)'}));
    const l=el('text',{x:a.x,y:a.y+(a.deep?26:28),class:'lbl','text-anchor':'middle'}); l.textContent=a.n; ag.appendChild(l); const l2=el('text',{x:a.x,y:a.y+(a.deep?38:40),class:'sub','text-anchor':'middle'}); l2.textContent=a.sub; ag.appendChild(l2); }
  $('ctMeters').innerHTML=[['intr','Intrinsic load','#ff8a65'],['extr','Extraneous load','#ff6b81'],['germ','Germane load (learning)','#66d9a8']].map(([k,n,col])=>`<div class="meter"><span>${n}</span><div class="track"><div class="fill" id="ct_${k}" style="background:${col};width:0"></div></div><span class="val" id="ctv_${k}"></span></div>`).join('');
})();
function showCodeState(){ const st=CSTATES[$('ctTask').value][$('ctLevel').value]; $('ctTitle').textContent=st.t; $('ctText').textContent=st.text; $('ctFeel').textContent=st.feel; $('ctEvidence').textContent='Evidence: '+st.ev;
  for(const id in CAREAS){ const c=$('ca-'+id); const a=st.act[id]||0; const hot=id==='dlpfc'||id==='acc'; c.setAttribute('fill',id==='dmn'?'#9b8fd9':id==='ins'||id==='acc'?'#ff6b81':id==='bg'?'#ffd166':id==='hip'?'#2a9d8f':'#ffd166'); c.setAttribute('fill-opacity',(0.12+0.8*a).toFixed(2)); c.setAttribute('r',(CAREAS[id].deep?10:12)+8*a); }
  const parts=$('cparts'); parts.innerHTML=''; const NS='http://www.w3.org/2000/svg';
  CCONN.forEach((c,i)=>{ const w=st.conn[i]; const p=$('cc'+i); p.setAttribute('stroke-width',w); p.setAttribute('stroke-opacity',Math.min(0.9,0.2+w*0.14)); const n=Math.max(1,Math.round(w)); for(let k=0;k<n;k++){ const dot=document.createElementNS(NS,'circle'); dot.setAttribute('r',2+w*0.3); dot.setAttribute('fill','#fff'); const am=document.createElementNS(NS,'animateMotion'); am.setAttribute('dur',(3.4/Math.max(0.6,w*0.6)).toFixed(2)+'s'); am.setAttribute('repeatCount','indefinite'); am.setAttribute('begin',(-k*3/n).toFixed(2)+'s'); const mp=document.createElementNS(NS,'mpath'); mp.setAttributeNS('http://www.w3.org/1999/xlink','href','#cc'+i); am.appendChild(mp); dot.appendChild(am); parts.appendChild(dot); } });
  [['intr',0],['extr',1],['germ',2]].forEach(([k,i])=>{ $('ct_'+k).style.width=st.load[i]+'%'; $('ctv_'+k).textContent=st.load[i]+'%'; }); }
$('ctTask').addEventListener('change',showCodeState); $('ctLevel').addEventListener('change',showCodeState); showCodeState();
document.querySelectorAll('#code3d [data-scn]').forEach(b=>b.addEventListener('click',()=>{ document.querySelector('#nav button[data-tab=live]').click(); if(window.openLiveScenario) setTimeout(()=>window.openLiveScenario(b.dataset.scn),200); }));
// --- cost of easy answers model ---
const CE_STRATS=tr('CE_STRATS',[{id:'struggle',n:'Attempt, no help',sn:'no help',col:'#ff6b81',s:0},{id:'hint',n:'Attempt, then hint',sn:'hint after attempt',col:'#66d9a8',s:1},{id:'worked',n:'Worked example first, then attempt',sn:'worked example first',col:'#4fc3f7',s:2},{id:'answer',n:'Full solution first (AI or key)',sn:'solution first',col:'#ffd166',s:3}]);
const sig=x=>1/(1+Math.exp(-x));
function ceModel(d,p,n,s){ // d difficulty 1-5, p prior 0-1, n exercises, s support level 0-3
  const gapFit=p*5-d;                                  // how well the task matches the student
  const effort=clamp(0.25+0.75*clamp((d/5)*[1,0.78,0.6,0.15][s],0,1),0,1);   // generation effort: support removes it
  const succOwn=sig(1.6*gapFit+0.3);                   // success on own attempt
  const succ=s===0?succOwn:s===1?sig(1.6*gapFit+1.8):s===2?sig(1.6*gapFit+2.2):0.98;   // eventual success with support
  const frustration=s===0?clamp(1-succOwn,0,1)*0.8:s===1?clamp(1-succOwn,0,1)*0.25:0.1;
  const gen=[1,1,0.8,0.15][s];                          // share of the solution the student generates (the attempt after a worked example is still generation)
  let K=(0.2+0.8*effort)*gen*(0.45+0.55*succ);          // encoding per exercise
  if(s===0&&succOwn<0.3) K*=0.6;                        // unproductive struggle without consolidation
  const Kn=1-Math.pow(1-K,Math.min(n,6)*0.35);          // several exercises on the same pattern
  const imm=clamp(s===3?0.95:s===2?0.6+0.35*succ:0.25+0.7*succ,0,1);
  const S=1.5+22*Kn; const ret=t=>Kn*Math.exp(-t/S)+ (1-Kn)*0.08*Math.exp(-t/2);
  const conf=clamp(0.35+0.45*imm+0.12*s/3+0.1*(1-frustration),0,1);
  return {effort,succ,frustration,K:Kn,imm,ret,conf,minutes:Math.round((4+8*d)*(s===3?0.35:s===2?0.7:s===1?0.85:1.15))}; }
function runCE(){ const d=+$('ceD').value,p=+$('ceP').value,n=+$('ceN').value; $('ceD_o').textContent=d; $('ceP_o').textContent=Math.round(p*100)+'%'; $('ceN_o').textContent=n;
  const res=CE_STRATS.map(st=>({st,m:ceModel(d,p,n,st.s)}));
  $('ceBars').innerHTML=res.map(({st,m})=>{ const r7=m.ret(7), gap=m.conf-r7; const bar=(n,v,col)=>`<div class="meter"><span>${n}</span><div class="track"><div class="fill" style="background:${col};width:${Math.round(v*100)}%"></div></div><span class="val">${Math.round(v*100)}%</span></div>`;
    return `<div class="cebar" style="border-color:${st.col}"><b style="color:${st.col}">${st.n}</b>${bar('Immediate performance',m.imm,'#c9d2e3')}${bar('Encoded (schema)',m.K,'#66d9a8')}${bar('Recall after 1 week',r7,st.col)}${bar('Confidence',m.conf,'#ffd166')}${bar('Frustration',m.frustration,'#ff6b81')}<div style="font-size:12px;color:var(--muted);margin-top:4px">≈ ${m.minutes} min per exercise · confidence − recall gap <b style="color:${gap>0.3?'var(--bad)':'var(--good)'}">${Math.round(gap*100)} pts</b></div></div>`; }).join('');
  const xs=Array.from({length:120},(_,i)=>i/119*28); plot($('ceChart'),res.map(({st,m})=>({data:xs.map(t=>m.ret(t)*100),x:xs,color:st.col,width:2,label:st.sn})),{x0:0,x1:28,y0:0,y1:100,title:'Predicted recall of the pattern (%) over the following weeks',xlabel:'days after the session',hlines:[{y:50,color:'#3b4a6b'}]}); }
['ceD','ceP','ceN'].forEach(id=>$(id).addEventListener('input',runCE));

// ------------------------------------------------------------ start
neuronRun();
window.addEventListener('resize',()=>{ if(activeTab==='neuron') renderNeuron(); if(activeTab==='start') drawFigures(); if(activeTab==='lang'&&typeof runSim==='function') runSim(); if(activeTab==='code'&&typeof runCE==='function') runCE(); stdpDraw(); });

// ============================================================ v1.0 PROFESSIONAL LAYER: version, deep links, shortcuts, export, about, paper links
const APP_VERSION='1.6.0';
const TAB_KEYS=['start','neuron','synapse','network','brain','live','lang','code','quiz'];
function showTab(name){ const b=document.querySelector('#nav button[data-tab="'+name+'"]'); if(b) b.click(); }
(function tabsPro(){
  const nav=$('nav'); nav.setAttribute('role','tablist'); nav.querySelectorAll('button').forEach(b=>{ b.setAttribute('role','tab'); b.setAttribute('aria-controls','tab-'+b.dataset.tab);
    b.addEventListener('click',()=>{ nav.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',x===b?'true':'false')); try{ history.replaceState(null,'','#'+b.dataset.tab); localStorage.setItem('brainlab.tab',b.dataset.tab); }catch(e){} }); });
  document.querySelectorAll('.tab').forEach(t=>t.setAttribute('role','tabpanel'));
  // deep links: #neuron, #live/code_ai, #code
  const applyHash=()=>{ const h=location.hash.replace('#','').split('/'); if(h[0]&&TAB_KEYS.includes(h[0])){ showTab(h[0]); if(h[0]==='live'&&h[1]){ let tries=0; const iv=setInterval(()=>{ if(window.openLiveScenario){ window.openLiveScenario(h[1]); clearInterval(iv); } else if(++tries>50) clearInterval(iv); },200); } return true; } return false; };
  if(!applyHash()){ try{ const last=localStorage.getItem('brainlab.tab'); if(last&&TAB_KEYS.includes(last)&&last!=='start') showTab(last); }catch(e){} }
  window.addEventListener('hashchange',applyHash);
  document.addEventListener('keydown',e=>{ const tag=(e.target.tagName||'').toLowerCase(); if(tag==='input'||tag==='select'||tag==='textarea'||e.ctrlKey||e.metaKey||e.altKey) return;
    if(/^[0-8]$/.test(e.key)){ showTab(TAB_KEYS[+e.key]); } else if(e.key==='g'){ $('jargonBtn').click(); } else if(e.key==='?'){ $('aboutBtn').click(); } });
})();
// PNG export for every 2-D chart
(function exportPro(){
  const dl=(url,name)=>{ const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); };
  document.querySelectorAll('canvas[id]').forEach(c=>{ if(c.closest('#brain3d,#live3d')||c.id==='gizmo3d') return; const wrap=document.createElement('div'); wrap.className='cv'; c.parentNode.insertBefore(wrap,c); wrap.appendChild(c);
    const b=document.createElement('button'); b.className='png'; b.type='button'; b.textContent='⤓ PNG'; b.title='Download this chart as a PNG image'; wrap.appendChild(b);
    b.addEventListener('click',()=>{ try{ dl(c.toDataURL('image/png'),'haibrainlab-'+c.id+'.png'); }catch(e){ alert('Export failed: '+e.message); } }); });
  window.brainlabDownload=dl;
})();
// About dialog
(function aboutPro(){
  const d=$('aboutDrawer'); d.innerHTML=`<div class="row" style="justify-content:space-between"><h2>About HaiBrainLab <span class="pill">v${APP_VERSION}</span></h2><button class="btn small" id="aboutClose">✕</button></div>
  <p>An interactive neuroscience simulator for learners, teachers and computing-education research. Runs entirely in the browser; no data is collected.</p>
  <h3>What is simulated, what is illustrated</h3>
  <p>The Neuron, Synapse and Network tabs are numerical simulations of published models (Hodgkin–Huxley 1952, Izhikevich 2003, Bi &amp; Poo 1998). The 3D brain, the live scenarios, the language simulator and the easy-answers model are illustrative models built from the literature; their numbers are not measurements. Full equations and parameters: <a href="docs/METHODS.md" target="_blank" rel="noopener">docs/METHODS.md</a>.</p>
  <h3>Keyboard shortcuts</h3>
  <p><kbd>0</kbd>–<kbd>8</kbd> switch tabs · <kbd>g</kbd> glossary · <kbd>?</kbd> this dialog · <kbd>Esc</kbd> close</p>
  <h3>Sharing</h3>
  <p>Every tab has a link: <code>#neuron</code>, <code>#code</code>, and live scenarios open directly with <code>#live/code_ai</code>. Hover any chart for a PNG download; the 3D views have a screenshot button.</p>
  <h3>Cite</h3>
  <p>Nguyen, H. (2026). <i>HaiBrainLab: an interactive neuroscience simulator</i> (v${APP_VERSION}). MIT License. See CITATION.cff in the project folder.</p>
  <h3>Credits</h3>
  <p>three.js (MIT) for 3D rendering; Google Fonts Outfit and Inter. Built with Claude Code.</p>`;
  $('aboutBtn').addEventListener('click',()=>{ d.classList.toggle('open'); $('jargonDrawer').classList.remove('open'); });
  $('aboutClose').addEventListener('click',()=>d.classList.remove('open'));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') d.classList.remove('open'); });
  $('footerText').innerHTML=`HaiBrainLab v${APP_VERSION} · MIT License · <a href="#" id="footAbout">About &amp; methods</a> · Models: Hodgkin &amp; Huxley (1952), Izhikevich (2003), Bi &amp; Poo (1998). Everything runs locally in your browser; nothing is collected.`;
  $('footAbout').addEventListener('click',e=>{ e.preventDefault(); $('aboutBtn').click(); window.scrollTo({top:0}); });
})();
// "find paper" links on every cited study
(function paperLinks(){ const mk=q=>{ const a=document.createElement('a'); a.className='paperlink'; a.target='_blank'; a.rel='noopener'; a.href='https://scholar.google.com/scholar?q='+encodeURIComponent(q); a.textContent='find ↗'; a.title='Search for this paper'; return a; };
  document.querySelectorAll('#codeEvidence table tr').forEach(tr=>{ const td=tr.children[0], f=tr.children[3]; if(!td||td.tagName!=='TD'||!f) return; td.appendChild(mk(td.textContent+' '+f.textContent.split(':')[0].slice(0,80))); });
  document.querySelectorAll('#codeAside li').forEach(li=>li.appendChild(mk(li.textContent)));
})();


// ============================================================ v1.5 RESEARCH LAYER: lab notebook, CSV export, reference library
(function notebook(){
  const KEY='brainlab.notes'; const d=$('noteDrawer');
  const load=()=>{ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ return []; } };
  const save=n=>{ try{ localStorage.setItem(KEY,JSON.stringify(n)); }catch(e){} };
  const TABN={start:'Start here',neuron:'Neuron',synapse:'Synapse',network:'Network',brain:'Brain map',live:'Live brain',lang:'Language class',code:'Programming brain',quiz:'Quiz'};
  window.noteContext=()=>{ const nb=document.querySelector('#nav button[data-tab="'+activeTab+'"]'); let c=nb?nb.textContent.replace(/^\d+\s*·\s*/,''):(TABN[activeTab]||activeTab);
    if(activeTab==='neuron'&&typeof lastSim!=='undefined'&&lastSim){ const P=lastSim.P; c+=` · ${P.model.toUpperCase()} I=${P.I} t0=${P.t0} dur=${P.dur} noise=${P.noise}`+(P.model==='hh'?` gNa×${P.gNa} gK×${P.gK} gL×${P.gL}`:P.model==='izh'?` a=${P.iA} b=${P.iB} c=${P.iC} d=${P.iD}`:` τ=${P.lTau} θ=${P.lTh}`)+` · spikes=${lastSim.spikes.length}`; }
    if(activeTab==='network') c+=` · wE=${$('wE').value} wI=${$('wI').value} input=${$('nzIn').value} · t=${$('netT').textContent} ms rate=${$('netRate').textContent} Hz sync=${$('netSync').textContent}`;
    if(activeTab==='synapse') c+=` · ${$('sType').value} w=${$('sW').value} τ=${$('sTau').value}`;
    if(activeTab==='brain'&&selectedRegion) c+=` · ${REGIONS.find(r=>r.id===selectedRegion).name}`+(lesions.size?` · lesions: ${[...lesions].join(', ')}`:'');
    if(activeTab==='live'&&window.liveContext) c+=` · ${window.liveContext()}`;
    if(activeTab==='code') c+=` · ${$('ctTask').value}/${$('ctLevel').value} · difficulty ${$('ceD').value}, prior ${$('ceP').value}`;
    return c; };
  function render(){ const notes=load(); d.innerHTML=`<div class="row" style="justify-content:space-between"><h2>${t('nbTitle','Lab notebook')} <span class="pill">${notes.length}</span></h2><button class="btn small" id="noteClose">✕</button></div>
    <p style="font-size:12.5px;color:var(--muted);margin:4px 0 6px">${t('nbHint','Notes are saved in this browser only. Each note records what you were looking at. Export before clearing your browser data.')}</p>
    <div style="font-size:12px;color:var(--accent);margin-bottom:4px" id="noteCtx"></div>
    <textarea id="noteText" placeholder="${t('nbPh','Observation, question, hypothesis…')}"></textarea>
    <div class="row" style="margin:6px 0 10px"><button class="btn small primary" id="noteAdd">${t('nbAdd','Add note')}</button><button class="btn small" id="noteMd">${t('nbMd','Export Markdown')}</button><button class="btn small" id="noteJson">JSON</button>${notes.length?`<button class="btn small" id="noteClear">${t('nbClear','Clear all')}</button>`:''}</div>
    <div id="noteList">${notes.slice().reverse().map(n=>`<div class="note"><div class="meta"><span>${new Date(n.ts).toLocaleString()} · ${n.ctx}</span><button data-del="${n.ts}" title="${t('nbDel','Delete')}">✕</button></div><p>${esc(n.text)}</p></div>`).join('')||`<p style="color:var(--muted)">${t('nbEmpty','No notes yet.')}</p>`}</div>`;
    $('noteCtx').textContent=t('nbCtx','Context:')+' '+noteContext();
    $('noteClose').addEventListener('click',()=>d.classList.remove('open'));
    $('noteAdd').addEventListener('click',()=>{ const txt=$('noteText').value.trim(); if(!txt) return; const n=load(); n.push({ts:Date.now(),ctx:noteContext(),text:txt}); save(n); render(); });
    $('noteMd').addEventListener('click',()=>{ const n=load(); const md='# HaiBrainLab notebook\n\n'+n.map(x=>`## ${new Date(x.ts).toLocaleString()}\n*${x.ctx}*\n\n${x.text}\n`).join('\n'); brainlabDownload('data:text/markdown;charset=utf-8,'+encodeURIComponent(md),'haibrainlab-notebook.md'); });
    $('noteJson').addEventListener('click',()=>brainlabDownload('data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(load(),null,2)),'haibrainlab-notebook.json'));
    const cl=$('noteClear'); if(cl) cl.addEventListener('click',()=>{ if(confirm(t('nbConfirm','Delete all notes? Export first if you want to keep them.'))){ save([]); render(); } });
    d.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',()=>{ save(load().filter(x=>String(x.ts)!==b.dataset.del)); render(); }));
    const ta=$('noteText'); ta.addEventListener('keydown',e=>{ if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)) $('noteAdd').click(); }); }
  const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  $('noteBtn').addEventListener('click',()=>{ const open=!d.classList.contains('open'); document.querySelectorAll('.drawer,#aboutDrawer,#jargonDrawer').forEach(x=>x.classList.remove('open')); if(open){ render(); d.classList.add('open'); $('noteText').focus(); } });
  document.addEventListener('keydown',e=>{ const tag=(e.target.tagName||'').toLowerCase(); if(tag==='input'||tag==='select'||tag==='textarea'||e.ctrlKey||e.metaKey||e.altKey) return; if(e.key==='n') $('noteBtn').click(); if(e.key==='l') $('libBtn').click(); if(e.key==='Escape') document.querySelectorAll('.drawer').forEach(x=>x.classList.remove('open')); });
})();
(function csvExport(){
  const csv=(rows,name)=>brainlabDownload('data:text/csv;charset=utf-8,'+encodeURIComponent(rows.map(r=>r.join(',')).join('\n')),name);
  $('nCsv').addEventListener('click',()=>{ if(!lastSim) return; const r=lastSim, P=r.P; const g=P.model==='hh'?['m','h','n']:P.model==='izh'?['u','',''] :['threshold_mV','',''];
    const rows=[['t_ms','V_mV',g[0],g[1],g[2],'I_injected'].filter(Boolean)]; for(let i=0;i<r.n;i++){ const row=[r.t[i].toFixed(3),r.V[i].toFixed(3),r.g1[i].toFixed(4)]; if(g[1]){ row.push(r.g2[i].toFixed(4),r.g3[i].toFixed(4)); } row.push(r.I[i].toFixed(3)); rows.push(row); }
    rows.unshift(['# HaiBrainLab neuron trace','model='+P.model,'I='+P.I,'t0='+P.t0,'dur='+P.dur,'noise='+P.noise,P.model==='hh'?`gNa=${P.gNa};gK=${P.gK};gL=${P.gL}`:'']); csv(rows,'haibrainlab-neuron-'+P.model+'.csv'); });
  $('netCsv').addEventListener('click',()=>{ const rows=[['# HaiBrainLab network spikes, last 1000 ms',`model=${netModel}`,`seed=${$('netSeed').value}`,netModel==='brunel'?`g=${br.g};eta=${br.eta};subset=1000E+250I of 12500`:'',`wE=${$('wE').value}`,`wI=${$('wI').value}`,`input=${$('nzIn').value}`,`sim_t=${net.t}`],['t_ms','neuron','type']]; for(let k=0;k<net.rasterT.length;k++) rows.push([net.rasterT[k],net.rasterN[k],net.rasterN[k]<netNe?'E':'I']); csv(rows,'haibrainlab-network-spikes.csv'); });
  $('netLfpCsv').addEventListener('click',()=>{ const rows=[['# HaiBrainLab simulated LFP (mean excitatory V), 1 ms samples, last 1024 ms',`sim_t=${net.t}`],['t_ms','lfp_mV']]; for(let i=0;i<net.lfp.length;i++) rows.push([net.t-1024+i,net.lfp[i].toFixed(3)]); csv(rows,'haibrainlab-network-lfp.csv'); });
})();
const LIBRARY=[
 ['Neuron and synapse',[
  ['Hodgkin & Huxley (1952).','A quantitative description of membrane current and its application to conduction and excitation in nerve.','J Physiol 117:500–544'],
  ['Izhikevich (2003).','Simple model of spiking neurons.','IEEE Trans Neural Netw 14:1569–1572'],
  ['Izhikevich (2004).','Which model to use for cortical spiking neurons?','IEEE Trans Neural Netw 15:1063–1070'],
  ['Bi & Poo (1998).','Synaptic modifications in cultured hippocampal neurons: dependence on spike timing, synaptic strength, and postsynaptic cell type.','J Neurosci 18:10464–10472'],
  ['Bliss & Lømo (1973).','Long-lasting potentiation of synaptic transmission in the dentate area of the anaesthetized rabbit.','J Physiol 232:331–356'],
  ['Hebb (1949).','The Organization of Behavior.','Wiley'],
  ['Brunel (2000).','Dynamics of sparsely connected networks of excitatory and inhibitory spiking neurons.','J Comput Neurosci 8:183–208'],
  ['Kandel (2001).','The molecular biology of memory storage: a dialogue between genes and synapses.','Science 294:1030–1038']]],
 ['Brain structure and numbers',[
  ['Azevedo et al. (2009).','Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain.','J Comp Neurol 513:532–541'],
  ['Herculano-Houzel (2009).','The human brain in numbers: a linearly scaled-up primate brain.','Front Hum Neurosci 3:31'],
  ['Brodmann (1909).','Vergleichende Lokalisationslehre der Grosshirnrinde.','Barth, Leipzig'],
  ['Penfield & Boldrey (1937).','Somatic motor and sensory representation in the cerebral cortex of man as studied by electrical stimulation.','Brain 60:389–443'],
  ['White et al. (1986).','The structure of the nervous system of the nematode Caenorhabditis elegans.','Phil Trans R Soc B 314:1–340'],
  ['Dorkenwald et al. (2024).','Neuronal wiring diagram of an adult brain (FlyWire).','Nature 634:124–138']]],
 ['Learning and memory',[
  ['Scoville & Milner (1957).','Loss of recent memory after bilateral hippocampal lesions (patient H.M.).','J Neurol Neurosurg Psychiatry 20:11–21'],
  ['O\u2019Keefe & Dostrovsky (1971).','The hippocampus as a spatial map (place cells).','Brain Res 34:171–175'],
  ['Maguire et al. (2000).','Navigation-related structural change in the hippocampi of taxi drivers.','PNAS 97:4398–4403'],
  ['Draganski et al. (2004).','Changes in grey matter induced by training (juggling).','Nature 427:311–312'],
  ['Nader, Schafe & LeDoux (2000).','Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval.','Nature 406:722–726'],
  ['Roediger & Karpicke (2006).','Test-enhanced learning: taking memory tests improves long-term retention.','Psychol Sci 17:249–255'],
  ['Cepeda et al. (2006).','Distributed practice in verbal recall tasks: a review and quantitative synthesis.','Psychol Bull 132:354–380'],
  ['Dunlosky et al. (2013).','Improving students\u2019 learning with effective learning techniques.','Psychol Sci Public Interest 14:4–58'],
  ['Slamecka & Graf (1978).','The generation effect: delineation of a phenomenon.','J Exp Psychol: Hum Learn Mem 4:592–604'],
  ['Bjork & Bjork (2011).','Making things hard on yourself, but in a good way: creating desirable difficulties.','In: Psychology and the Real World'],
  ['Kapur (2008).','Productive failure.','Cognition and Instruction 26:379–424'],
  ['Sweller (1988).','Cognitive load during problem solving.','Cognitive Science 12:257–285'],
  ['Lally et al. (2010).','How are habits formed: modelling habit formation in the real world.','Eur J Soc Psychol 40:998–1009'],
  ['Yin & Knowlton (2006).','The role of the basal ganglia in habit formation.','Nat Rev Neurosci 7:464–476']]],
 ['Sleep',[
  ['Walker (2017).','Why We Sleep.','Scribner'],
  ['Diekelmann & Born (2010).','The memory function of sleep.','Nat Rev Neurosci 11:114–126'],
  ['Walker et al. (2002).','Practice with sleep makes perfect: sleep-dependent motor skill learning.','Neuron 35:205–211'],
  ['Xie et al. (2013).','Sleep drives metabolite clearance from the adult brain.','Science 342:373–377'],
  ['de Vivo et al. (2017).','Ultrastructural evidence for synaptic scaling across the wake/sleep cycle.','Science 355:507–510'],
  ['Borbély (1982).','A two process model of sleep regulation.','Hum Neurobiol 1:195–204'],
  ['Spiegel et al. (2004).','Sleep curtailment is accompanied by decreased leptin, elevated ghrelin, and increased hunger.','Ann Intern Med 141:846–850']]],
 ['Emotion, reward, stress and body',[
  ['LeDoux (1996).','The Emotional Brain.','Simon & Schuster'],
  ['Schultz, Dayan & Montague (1997).','A neural substrate of prediction and reward.','Science 275:1593–1599'],
  ['Berridge & Kringelbach (2015).','Pleasure systems in the brain.','Neuron 86:646–664'],
  ['Arnsten (2009).','Stress signalling pathways that impair prefrontal cortex structure and function.','Nat Rev Neurosci 10:410–422'],
  ['McEwen (2007).','Physiology and neurobiology of stress and adaptation: central role of the brain.','Physiol Rev 87:873–904'],
  ['Vyas et al. (2002).','Chronic stress induces contrasting patterns of dendritic remodeling in hippocampal and amygdaloid neurons.','J Neurosci 22:6810–6818'],
  ['Singer et al. (2004).','Empathy for pain involves the affective but not sensory components of pain.','Science 303:1157–1162'],
  ['Melzack & Wall (1965).','Pain mechanisms: a new theory (gate control).','Science 150:971–979'],
  ['Stephens, Atkins & Kingston (2009).','Swearing as a response to pain.','NeuroReport 20:1056–1060'],
  ['Salimpoor et al. (2011).','Anatomically distinct dopamine release during anticipation and experience of peak emotion to music.','Nat Neurosci 14:257–262'],
  ['Kahneman & Tversky (1979).','Prospect theory: an analysis of decision under risk.','Econometrica 47:263–291'],
  ['Killingsworth & Gilbert (2010).','A wandering mind is an unhappy mind.','Science 330:932'],
  ['Hölzel et al. (2011).','Mindfulness practice leads to increases in regional brain gray matter density.','Psychiatry Res Neuroimaging 191:36–43'],
  ['Jung-Beeman et al. (2004).','Neural activity when people solve verbal problems with insight.','PLoS Biol 2:e97'],
  ['Kounios & Beeman (2014).','The cognitive neuroscience of insight.','Annu Rev Psychol 65:71–93'],
  ['Dietrich (2003).','Functional neuroanatomy of altered states of consciousness: the transient hypofrontality hypothesis.','Conscious Cogn 12:231–256'],
  ['Erickson et al. (2011).','Exercise training increases size of hippocampus and improves memory.','PNAS 108:3017–3022'],
  ['Ward et al. (2017).','Brain drain: the mere presence of one\u2019s own smartphone reduces available cognitive capacity.','J Assoc Consum Res 2:140–154'],
  ['Leroy (2009).','Why is it so hard to do my work? The challenge of attention residue when switching between work tasks.','Organ Behav Hum Decis Process 109:168–181'],
  ['Conway, Cowan & Bunting (2001).','The cocktail party phenomenon revisited: the importance of working memory capacity.','Psychon Bull Rev 8:331–335'],
  ['Willander & Larsson (2006).','Smell your way back to childhood: autobiographical odor memory.','Psychon Bull Rev 13:240–244']]],
 ['Language',[
  ['Mårtensson et al. (2012).','Growth of language-related brain areas after foreign language learning.','NeuroImage 63:240–244'],
  ['Mechelli et al. (2004).','Structural plasticity in the bilingual brain.','Nature 431:757'],
  ['Bialystok, Craik & Freedman (2007).','Bilingualism as a protection against the onset of symptoms of dementia.','Neuropsychologia 45:459–464'],
  ['Kuhl (2004).','Early language acquisition: cracking the speech code.','Nat Rev Neurosci 5:831–843'],
  ['Werker & Tees (1984).','Cross-language speech perception: evidence for perceptual reorganization during the first year of life.','Infant Behav Dev 7:49–63']]],
 ['Programming and computing education',[
  ['Siegmund et al. (2014).','Understanding understanding source code with functional magnetic resonance imaging.','ICSE 2014'],
  ['Siegmund et al. (2017).','Measuring neural efficiency of program comprehension.','ESEC/FSE 2017'],
  ['Floyd, Santander & Weimer (2017).','Decoding the representation of code in the brain: an fMRI study of code review and expertise.','ICSE 2017'],
  ['Peitek et al. (2021).','Program comprehension and code complexity metrics: an fMRI study.','ICSE 2021'],
  ['Castelhano et al. (2019).','The role of the insula in intuitive expert bug detection in computer code: an fMRI study.','Brain Imaging Behav 13:623–637'],
  ['Huang et al. (2019).','Distilling neural representations of data structure manipulation using fMRI and fNIRS.','ICSE 2019'],
  ['Ivanova et al. (2020).','Comprehension of computer code relies primarily on domain-general executive brain regions.','eLife 9:e58906'],
  ['Liu et al. (2020).','Computer code comprehension shares neural resources with formal logical inference in the fronto-parietal network.','eLife 9:e59340'],
  ['Krueger et al. (2020).','Neurological divide: an fMRI study of prose and code writing.','ICSE 2020'],
  ['Prat et al. (2020).','Relating natural language aptitude to individual differences in learning programming languages.','Sci Rep 10:3817'],
  ['Fritz et al. (2014).','Using psycho-physiological measures to assess task difficulty in software development.','ICSE 2014'],
  ['Cooper et al. (2015).','Spatial skills training in introductory computing.','ICER 2015'],
  ['Prather et al. (2024).','The widening gap: the benefits and harms of generative AI for novice programmers.','ICER 2024'],
  ['Denny, Prather, Becker, Finnie-Ansley, Hellas, Leinonen et al. (2024).','Computing education in the era of generative AI.','Commun ACM 67(2):56–67'],
  ['Xie et al. (2019).','A theory of instruction for introductory programming skills.','Computer Science Education 29:205–253']]],
 ['Textbooks',[
  ['Kandel, Koester, Mack & Siegelbaum (2021).','Principles of Neural Science, 6th ed.','McGraw-Hill'],
  ['Purves et al. (2018).','Neuroscience, 6th ed.','Oxford University Press'],
  ['Bear, Connors & Paradiso (2020).','Neuroscience: Exploring the Brain, 4th ed.','Wolters Kluwer']]]
];
(function library(){ const d=$('libDrawer'); const n=LIBRARY.reduce((s,g)=>s+g[1].length,0);
  d.innerHTML=`<div class="row" style="justify-content:space-between"><h2>${t('libTitle','Reference library')} <span class="pill">${n}</span></h2><button class="btn small" id="libClose">✕</button></div>
  <p style="font-size:12.5px;color:var(--muted);margin:4px 0 6px">${t('libHint','Every study and book the app draws on. "find" opens a search for the paper. Citation details are from memory and should be confirmed against the original before you cite them.')}</p>
  <input type="search" id="libSearch" placeholder="${t('libSearch','Filter by author, topic or year…')}" style="width:100%;background:var(--panel2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:7px 10px;font-size:13.5px;margin-bottom:6px">
  <div id="libList"></div>`;
  const renderLib=q=>{ q=(q||'').toLowerCase(); $('libList').innerHTML=LIBRARY.map(([g,items])=>{ const rows=items.filter(r=>!q||(g+' '+r.join(' ')).toLowerCase().includes(q)); if(!rows.length) return ''; return `<h3>${t('lib_'+g,g)}</h3>`+rows.map(r=>`<div class="ref"><b>${r[0]}</b> <i>${r[1]}</i> <span style="color:var(--muted)">${r[2]}</span> <a class="paperlink" target="_blank" rel="noopener" href="https://scholar.google.com/scholar?q=${encodeURIComponent(r[0]+' '+r[1])}">find ↗</a></div>`).join(''); }).join('')||`<p style="color:var(--muted)">${t('libNone','No match.')}</p>`; };
  renderLib(); $('libSearch').addEventListener('input',e=>renderLib(e.target.value));
  $('libClose').addEventListener('click',()=>d.classList.remove('open'));
  $('libBtn').addEventListener('click',()=>{ const open=!d.classList.contains('open'); document.querySelectorAll('.drawer,#aboutDrawer,#jargonDrawer').forEach(x=>x.classList.remove('open')); if(open){ d.classList.add('open'); $('libSearch').focus(); } });
})();


// ============================================================ v1.6 SCIENCE LAYER
// ---- Brunel (2000) sparse LIF network at the paper's size: N_E=10000, N_I=2500, C_E=1000, C_I=250, J=0.1 mV, delay 1.5 ms
// Raster, LFP and CV(ISI) use a fixed subset of 1000 E + 250 I neurons; the population rate counts every neuron.
const BR={NE:10000,NI:2500,CE:1000,CI:250,J:0.1,tau:20,theta:20,Vr:10,trp:2,dt:0.1,D:1.5,showE:1000,showI:250};
const br={V:null,ref:null,off:null,tg:null,bufIdx:null,bufCnt:null,steps:15,ptr:0,g:5,eta:2,x:1};
function netResetState(){ net.rasterT=[]; net.rasterN=[]; net.rate.fill(0); net.lfp.fill(netModel==='brunel'?10:-65); net.t=0; net.stimUntil=-1; net.spec=null; }
function brunelInit(){ const seed=+($('netSeed').value)||12345; seedRng(seed); br.x=((seed^0x9E3779B9)|0)||1; const n=BR.NE+BR.NI; br.V=new Float32Array(n); br.ref=new Float32Array(n);
  for(let i=0;i<n;i++) br.V[i]=BR.Vr+netRand()*(BR.theta-BR.Vr);
  // connectivity stored by presynaptic neuron (CSR); two passes over the same random stream: count, then fill
  const deg=new Int32Array(n); const st=rngState;
  for(let i=0;i<n;i++){ for(let k=0;k<BR.CE;k++) deg[(netRand()*BR.NE)|0]++; for(let k=0;k<BR.CI;k++) deg[BR.NE+((netRand()*BR.NI)|0)]++; }
  br.off=new Int32Array(n+1); for(let j=0;j<n;j++) br.off[j+1]=br.off[j]+deg[j]; br.tg=new Uint16Array(br.off[n]); const fill=Int32Array.from(br.off.subarray(0,n)); rngState=st;
  for(let i=0;i<n;i++){ for(let k=0;k<BR.CE;k++){ const p=(netRand()*BR.NE)|0; br.tg[fill[p]++]=i; } for(let k=0;k<BR.CI;k++){ const p=BR.NE+((netRand()*BR.NI)|0); br.tg[fill[p]++]=i; } }
  br.steps=Math.round(BR.D/BR.dt); br.bufIdx=new Uint16Array(br.steps*n); br.bufCnt=new Int32Array(br.steps); br.ptr=0; }
const brIin=new Float32Array(BR.NE+BR.NI);
function brunelStepMs(){ const n=BR.NE+BR.NI, g=br.g, NE=BR.NE, J=BR.J, gJ=-g*BR.J, th=BR.theta, Vr=BR.Vr, trp=BR.trp, dt=BR.dt, decay=BR.dt/BR.tau, off=br.off, tg=br.tg, V=br.V, ref=br.ref, bufIdx=br.bufIdx, bufCnt=br.bufCnt, showE=BR.showE, showIend=NE+BR.showI;
  const nuThr=th/(J*BR.CE*BR.tau/1000); const extCount=BR.CE*br.eta*nuThr*dt/1000; const mu=J*extCount, sigU=J*Math.sqrt(12*extCount); // external Poisson input in the diffusion limit: mean J*C_E*nu_ext*dt, variance J^2*C_E*nu_ext*dt (variance-matched uniform increments; ~200 are summed by the membrane)
  const sub=Math.round(1/dt); const stim=net.t<net.stimUntil; let total=0, x=br.x;
  for(let s=0;s<sub;s++){ brIin.fill(0); const base=br.ptr*n, cnt=bufCnt[br.ptr];
    for(let q=0;q<cnt;q++){ const j=bufIdx[base+q]; const w=j<NE?J:gJ; const e=off[j+1]; for(let z=off[j];z<e;z++) brIin[tg[z]]+=w; }
    let fc=0; for(let i=0;i<n;i++){ if(ref[i]>0){ ref[i]-=dt; V[i]=Vr; continue; } x^=x<<13; x^=x>>>17; x^=x<<5; const u=(x>>>0)/4294967296-0.5; let v=V[i]; v+=-v*decay+brIin[i]+mu+sigU*u+(stim&&i<100?0.6:0);
      if(v>=th){ bufIdx[base+fc++]=i; v=Vr; ref[i]=trp; if(i<showE){ net.rasterT.push(net.t); net.rasterN.push(i); } else if(i>=NE&&i<showIend){ net.rasterT.push(net.t); net.rasterN.push(showE+i-NE); } } V[i]=v; }
    bufCnt[br.ptr]=fc; total+=fc; br.ptr=(br.ptr+1)%br.steps; }
  br.x=x; let sumV=0; for(let i=0;i<showE;i++) sumV+=V[i];
  net.rate.copyWithin(0,1); net.rate[999]=total; net.lfp.copyWithin(0,1); net.lfp[1023]=sumV/showE; net.t++;
  let cut=0; while(cut<net.rasterT.length&&net.rasterT[cut]<net.t-1000) cut++; if(cut>0){ net.rasterT.splice(0,cut); net.rasterN.splice(0,cut); } }
function netCVisi(){ const last=new Float32Array(netN).fill(-1), sum=new Float32Array(netN), sq=new Float32Array(netN), cnt=new Int16Array(netN);
  for(let k=0;k<net.rasterT.length;k++){ const i=net.rasterN[k], tt=net.rasterT[k]; if(last[i]>=0){ const isi=tt-last[i]; sum[i]+=isi; sq[i]+=isi*isi; cnt[i]++; } last[i]=tt; }
  let acc=0,m=0; for(let i=0;i<netN;i++){ if(cnt[i]>=3){ const mean=sum[i]/cnt[i]; const v=sq[i]/cnt[i]-mean*mean; if(mean>0){ acc+=Math.sqrt(Math.max(0,v))/mean; m++; } } } return m?acc/m:NaN; }
function drawBrPhase(){ const c=$('brPhase'); if(!c) return; const {ctx,w,h}=setupCanvas(c); const p={l:44,r:12,t:22,b:26}; const pw=w-p.l-p.r, ph=h-p.t-p.b; const X=g=>p.l+g/8*pw, Y=e=>p.t+ph-e/4*ph;
  ctx.fillStyle='#0a0e16'; ctx.fillRect(0,0,w,h); ctx.fillStyle='rgba(255,138,101,0.10)'; ctx.fillRect(X(0),p.t,X(4)-X(0),ph); ctx.fillStyle='rgba(102,217,168,0.10)'; ctx.fillRect(X(4),p.t,X(8)-X(4),Y(1)-p.t); ctx.fillStyle='rgba(79,195,247,0.10)'; ctx.fillRect(X(4),Y(1),X(8)-X(4),Y(0)-Y(1));
  ctx.strokeStyle='#2a3550'; ctx.lineWidth=1.2; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(X(4),p.t); ctx.lineTo(X(4),p.t+ph); ctx.moveTo(X(4),Y(1)); ctx.lineTo(X(8),Y(1)); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle='#8e9bb3'; ctx.font='11px Inter, system-ui'; ctx.textAlign='center'; for(let g=0;g<=8;g+=2) ctx.fillText(g,X(g),h-8); ctx.textAlign='right'; for(let e=0;e<=4;e++) ctx.fillText(e,p.l-5,Y(e)+4); ctx.textAlign='left'; ctx.fillStyle='#e6ecf5'; ctx.font='600 12px Outfit, Inter, system-ui'; ctx.fillText('Regime diagram: g (x) vs ν_ext/ν_thr (y)',p.l,13);
  ctx.font='600 11px Inter, system-ui'; ctx.fillStyle='#ff8a65'; ctx.fillText('SR',X(1.6),Y(3.4)); ctx.fillStyle='#66d9a8'; ctx.fillText('AI (SI fast at higher drive)',X(4.3),Y(3.4)); ctx.fillStyle='#4fc3f7'; ctx.fillText('SI slow',X(6.2),Y(0.5));
  for(const [g,e,lab] of [[3,2,'SR'],[5,2,'AI'],[6,4,'SI fast'],[4.5,0.9,'SI slow']]){ ctx.fillStyle='#c9d2e3'; ctx.beginPath(); ctx.arc(X(g),Y(e),4,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#8e9bb3'; ctx.font='10px Inter, system-ui'; ctx.fillText(lab,X(g)+6,Y(e)-5); }
  ctx.strokeStyle='#ffd166'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(X(br.g),Y(br.eta),7,0,Math.PI*2); ctx.stroke(); ctx.fillStyle='#ffd166'; ctx.font='600 11px Inter, system-ui'; ctx.fillText(`g=${br.g.toFixed(1)}, η=${br.eta.toFixed(1)}`,Math.min(X(br.g)+10,w-110),Y(br.eta)+16); }
(function brunelUI(){ const sync=()=>{ br.g=+$('brG').value; br.eta=+$('brEta').value; $('brG_o').textContent=br.g.toFixed(1); $('brEta_o').textContent=br.eta.toFixed(1); $('brSpd_o').textContent=$('brSpd').value; drawBrPhase(); };
  ['brG','brEta','brSpd'].forEach(id=>$(id).addEventListener('input',sync)); sync();
  document.querySelectorAll('[data-br]').forEach(b=>b.addEventListener('click',()=>{ const [g,e]=b.dataset.br.split(',').map(Number); $('brG').value=g; $('brEta').value=e; sync(); }));
  $('brPhase').addEventListener('click',e=>{ const r=$('brPhase').getBoundingClientRect(); const w=r.width,h=r.height; const p={l:44,r:12,t:22,b:26}; const g=clamp((e.clientX-r.left-p.l)/(w-p.l-p.r)*8,0,8); const eta=clamp((1-(e.clientY-r.top-p.t)/(h-p.t-p.b))*4,0.2,4); $('brG').value=g.toFixed(1); $('brEta').value=eta.toFixed(1); sync(); });
  $('netModel').addEventListener('change',()=>{ netModel=$('netModel').value; const b=netModel==='brunel'; $('izhCtlRow').style.display=b?'none':''; $('brunelCtl').style.display=b?'':'none'; netN=b?BR.showE+BR.showI:N; netNe=b?BR.showE:Ne; netPop=b?BR.NE+BR.NI:N; $('legE').textContent=b?t('legEbr','excitatory (1000 of 10 000 shown)'):t('legE','excitatory (800, pyramidal)'); $('legI').textContent=b?t('legIbr','inhibitory (250 of 2 500 shown)'):t('legI','inhibitory (200, interneurons)'); netResetState(); if(b){ brunelInit(); drawBrPhase(); } else netInit(); });
  $('netSeed').addEventListener('change',()=>{ netResetState(); if(netModel==='brunel') brunelInit(); else netInit(); });
  $('legE').textContent=t('legE','excitatory (800, pyramidal)'); $('legI').textContent=t('legI','inhibitory (200, interneurons)');
})();
// ---- Izhikevich phase plane (v, u) with nullclines
function drawIzhPhase(){ const c=$('nPhase'); if(!lastSim||lastSim.P.model!=='izh'){ c.style.display='none'; return; } c.style.display=''; const P=lastSim.P; const vs=[],n0=[],nI=[],nu=[]; for(let v=-80;v<=30;v+=1){ vs.push(v); n0.push(0.04*v*v+5*v+140); nI.push(0.04*v*v+5*v+140+P.I); nu.push(P.iB*v); }
  const cur=+$('nCur').value; const i=Math.min(lastSim.n-1,Math.round(cur/lastSim.T*(lastSim.n-1)));
  const g=plot(c,[{data:n0,x:vs,color:'#4fc3f7',label:'v-nullcline (I=0)',dash:[4,3],glow:false},{data:nI,x:vs,color:'#ff8a65',label:'v-nullcline (I=pulse)',glow:false},{data:nu,x:vs,color:'#66d9a8',label:'u-nullcline u=bv',glow:false},{data:Array.from(lastSim.g1),x:Array.from(lastSim.V),color:'#ffd166',width:1.2,label:'trajectory',glow:false}],{x0:-80,x1:30,y0:-25,y1:40,title:'Izhikevich phase plane: recovery u against voltage v (mV)',xlabel:'v (mV)'});
  g.ctx.fillStyle='#fff'; g.ctx.beginPath(); g.ctx.arc(g.X(clamp(lastSim.V[i],-80,30)),g.Y(clamp(lastSim.g1[i],-25,40)),4,0,Math.PI*2); g.ctx.fill(); }
// ---- equations panel
var eqOpen=false; $('nEqBtn').addEventListener('click',()=>{ eqOpen=!eqOpen; renderEquations(); });
function renderEquations(){ const box=$('nEq'); if(!eqOpen||!lastSim){ box.style.display='none'; return; } const P=lastSim.P; box.style.display='';
  if(P.model==='hh') box.textContent=`Hodgkin–Huxley (1952), rest shifted to −65 mV
C dV/dt = I − gNa·m³h·(V − ENa) − gK·n⁴·(V − EK) − gL·(V − EL)
C = 1 µF/cm²   gNa = ${(120*P.gNa).toFixed(1)}   gK = ${(36*P.gK).toFixed(1)}   gL = ${(0.3*P.gL).toFixed(2)} mS/cm²   ENa = +50   EK = −77   EL = −54.4 mV
dm/dt = αm(1−m) − βm·m   αm = 0.1(V+40)/(1−e^{−(V+40)/10})   βm = 4·e^{−(V+65)/18}
dh/dt = αh(1−h) − βh·h   αh = 0.07·e^{−(V+65)/20}            βh = 1/(1+e^{−(V+35)/10})
dn/dt = αn(1−n) − βn·n   αn = 0.01(V+55)/(1−e^{−(V+55)/10})   βn = 0.125·e^{−(V+65)/80}
I = ${P.I} µA/cm² from t = ${P.t0} ms for ${P.dur} ms${P.noise?`, plus Gaussian noise σ = ${(3*P.noise).toFixed(1)}`:''}.  Forward Euler, dt = 0.01 ms.`;
  else if(P.model==='lif') box.textContent=`Leaky integrate-and-fire
τ dV/dt = −(V − EL) + R·I        τ = ${P.lTau} ms   EL = −65 mV   R·I = ${(1.2*P.I).toFixed(1)} mV during the pulse
if V ≥ θ = ${P.lTh} mV: spike, V ← −65 mV, refractory ${P.lRef} ms.   Euler, dt = 0.1 ms.`;
  else box.textContent=`Izhikevich (2003)
dv/dt = 0.04v² + 5v + 140 − u + I
du/dt = a(bv − u)                 if v ≥ 30 mV: v ← c, u ← u + d
a = ${P.iA}   b = ${P.iB}   c = ${P.iC}   d = ${P.iD}   I = ${P.I} during the pulse.   Euler, dt = 0.1 ms.
v-nullcline: u = 0.04v² + 5v + 140 + I   u-nullcline: u = bv   (see the phase plane above)`; }
// ---- validation suite: automatic checks against textbook values
function runValidation(){ const base={model:'hh',I:0,t0:0,dur:200,noise:0,gNa:1,gK:1,gL:1,lTau:10,lTh:-50,lRef:2,lReset:-65,iA:.02,iB:.2,iC:-65,iD:8}; const sim=o=>simNeuron(Object.assign({},base,o)); const rate=r=>r.spikes.length/0.2; const out=[];
  const add=(name,got,lo,hi,unit,ref)=>out.push({name,got,exp:`${lo} – ${hi} ${unit}`,pass:got>=lo&&got<=hi,ref});
  let r=sim({I:0}); add('HH resting potential',+r.V[r.n-1].toFixed(2),-66.5,-63.5,'mV','Hodgkin & Huxley 1952; rest ≈ −65 mV with EL = −54.4');
  r=sim({I:10,t0:20,dur:100}); let vmax=-100; for(let i=0;i<r.n;i++) if(r.V[i]>vmax) vmax=r.V[i]; add('HH spike peak at I = 10',+vmax.toFixed(1),25,50,'mV','overshoot near +40 mV (ENa = +50)');
  add('HH firing rate at I = 10 µA/cm²',rate(sim({I:10})),55,85,'Hz','≈ 65–70 Hz for the standard squid-axon model');
  let rheo=null; for(let I=1;I<=10;I+=0.25){ if(sim({I}).spikes.length>=3){ rheo=I; break; } } add('HH rheobase (sustained firing)',rheo===null?99:rheo,1.5,8,'µA/cm²','≈ 2–6 depending on criterion; type II onset');
  const onset=rheo===null?0:rate(sim({I:rheo+0.5})); add('HH onset frequency (type II jump)',+onset.toFixed(1),30,120,'Hz','HH starts firing at ~50 Hz, not from zero (Hodgkin 1948 class 2)');
  add('TTX: gNa = 0 abolishes spikes',sim({I:30,gNa:0}).spikes.length,0,0,'spikes','Na⁺ channel block');
  const width=rr=>{ let i0=-1,i1=-1; for(let i=0;i<rr.n;i++){ if(i0<0&&rr.V[i]>-20) i0=i; else if(i0>=0&&rr.V[i]<-20){ i1=i; break; } } return i0<0||i1<0?0:(i1-i0)*rr.T/(rr.n-1); }; const wN=width(sim({I:10,t0:20,dur:100})), wT=width(sim({I:10,t0:20,dur:100,gK:0.2})); add('TEA: gK = 0.2 broadens the spike (width ratio)',+(wT/wN).toFixed(2),1.2,20,'×','K⁺ block slows repolarisation (Armstrong & Binstock 1965)');
  const l5=rate(sim({model:'lif',I:5})), l10=rate(sim({model:'lif',I:10})), l20=rate(sim({model:'lif',I:20})); add('LIF f–I monotonic (f(20) > f(10) ≥ f(5))',(l20>l10&&l10>=l5&&l20>0)?1:0,1,1,'(1 = true)','integrate-and-fire: type I, smooth onset');
  add('Izhikevich RS firing rate at I = 10',rate(sim({model:'izh',I:10})),5,60,'Hz','regular spiking with adaptation (Izhikevich 2003)');
  const ch=sim({model:'izh',I:10,iA:.02,iB:.2,iC:-50,iD:2}); let cv=NaN; if(ch.spikes.length>3){ const isi=[]; for(let i=1;i<ch.spikes.length;i++) isi.push(ch.spikes[i]-ch.spikes[i-1]); const m=isi.reduce((a,b)=>a+b)/isi.length; const v=isi.reduce((a,b)=>a+(b-m)*(b-m),0)/isi.length; cv=Math.sqrt(v)/m; } add('Izhikevich CH preset bursts (ISI CV > 0.5)',+cv.toFixed(2),0.5,5,'','chattering = bursts of spikes (Izhikevich 2003)');
  add('STDP window: Δw(+10 ms) = A₊·e^(−10/20) = 6.065',+(stdpDw(10)*1000).toFixed(3),6.05,6.08,'×10⁻³','Bi & Poo 1998 exponential window');
  add('STDP window: Δw(−10 ms) < 0',stdpDw(-10)<0?1:0,1,1,'(1 = true)','post-before-pre gives LTD');
  return out; }
$('nValidBtn').addEventListener('click',()=>{ const box=$('nValid'); box.style.display=''; box.innerHTML=`<p style="color:var(--muted);font-size:12.5px">${t('valRunning','Running checks…')}</p>`; setTimeout(()=>{ const res=runValidation(); const ok=res.filter(x=>x.pass).length;
  box.innerHTML=`<h3 style="margin:0 0 6px;color:var(--accent)">${t('valTitle','Validation')}: ${ok}/${res.length} ${t('valPassed','passed')}</h3><table class="tbl"><tr><th>${t('valName','Check')}</th><th>${t('valGot','Result')}</th><th>${t('valExp','Expected')}</th><th></th><th>${t('valRef','Reference')}</th></tr>${res.map(x=>`<tr><td>${x.name}</td><td style="font-family:var(--mono)">${x.got}</td><td style="font-family:var(--mono)">${x.exp}</td><td style="color:${x.pass?'var(--good)':'var(--bad)'}">${x.pass?'✓':'✗'}</td><td style="color:var(--muted)">${x.ref}</td></tr>`).join('')}</table><p style="font-size:12px;color:var(--muted)">${t('valNote','Checks run the simulations in this page with their current numerical settings; expected ranges are textbook values. A failed check means a bug or a parameter outside the standard regime.')}</p>`; },30); });
