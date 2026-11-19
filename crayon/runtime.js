// Runtime: scribble fills, per-item timing (draw / pop / fade / letters + loops), frame stepping. Extracted from bronze-age/scenes.html.
// ---------- runtime ----------
let scenes=[];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const backOut=p=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(p-1,3)+c1*Math.pow(p-1,2);};

function build(order, durs){
  const stage=document.getElementById('stage'), defs=document.getElementById('defs');
  let clipN=0;
  order.forEach((id,i)=>{
    rng=mulberry32(1000+i*97);
    const g=document.createElementNS(NS,'g');
    g.innerHTML=SCENES[id]();
    stage.appendChild(g);
    // scribble fills: a zig-zag crayon stroke clipped to each shape that asked for colour
    g.querySelectorAll('path[data-fill]').forEach(p=>{
      const bb=p.getBBox(), id='c'+(clipN++);
      const cp=document.createElementNS(NS,'clipPath'); cp.id=id;
      const q=p.cloneNode(); q.removeAttribute('class'); cp.appendChild(q); defs.appendChild(cp);
      const sp=13, pts=[];
      for(let y=bb.y-12, k=0; y<=bb.y+bb.height+14; y+=sp, k++){
        pts.push([(k%2?bb.x+bb.width+14:bb.x-14)+J(4), y+J(3)]);
      }
      if(pts.length<2) pts.push([bb.x+bb.width+14,bb.y+bb.height]);
      const sc=document.createElementNS(NS,'path');
      sc.setAttribute('d','M'+pts.map(f).join(' L'));
      sc.setAttribute('fill','none'); sc.setAttribute('stroke',p.dataset.fill);
      sc.setAttribute('stroke-width','21'); sc.setAttribute('stroke-linejoin','round'); sc.setAttribute('stroke-linecap','round');
      sc.setAttribute('pathLength','1'); sc.setAttribute('clip-path',`url(#${id})`);
      sc.style.strokeDasharray='1 1';
      sc._fd=clamp(Math.sqrt(bb.width*bb.height)/650,0.25,1.1);
      p.parentNode.insertBefore(sc,p);
      p._scrib=sc;
    });
    const items=[...g.querySelectorAll('g.it')].map((el,k)=>({
      el, a:el.dataset.a, t0:+el.dataset.t, dur:+el.dataset.dur, ox:+el.dataset.ox, oy:+el.dataset.oy,
      out:el.dataset.out===''?null:+el.dataset.out, ph:k*1.7,
      loops:el.dataset.loop.split(' ').filter(Boolean).map(s=>s.split(':')),
      paths:[...el.querySelectorAll('path.o')], tsp:[...el.querySelectorAll('tspan')],
    }));
    items.forEach(it=>it.paths.forEach(p=>{p.style.strokeDasharray='1 1';}));
    scenes.push({el:g, items, dur:durs[i]});
  });
  scenes.forEach(s=>s.el.style.display='none');
  return scenes.length;
}

function upd(it,t){
  const lt=t-it.t0;
  if(lt<0){it.el.style.display='none';return;}   // display, not visibility: a nested item could re-show itself
  it.el.style.display='';
  let op=1,tx=0,ty=0,rot=0,sx=1,sy=1;
  if(it.a==='draw'){
    const n=it.paths.length, sl=it.dur/Math.max(1,n);
    it.paths.forEach((p,k)=>{
      const s0=it.t0+k*sl, pr=clamp((t-s0)/sl);
      p.style.strokeDashoffset=1-pr; p.style.visibility=pr>0?'visible':'hidden';
      const sc=p._scrib;
      if(sc){const fp=clamp((t-(s0+sl*0.85))/sc._fd); sc.style.strokeDashoffset=1-fp; sc.style.visibility=fp>0?'visible':'hidden';}
    });
  } else {
    it.paths.forEach(p=>{p.style.strokeDashoffset=0;p.style.visibility='visible';if(p._scrib){p._scrib.style.strokeDashoffset=0;p._scrib.style.visibility='visible';}});
    if(it.a==='pop'){const e=backOut(clamp(lt/it.dur)); sx=sy=Math.max(0.001,e);}
    else if(it.a==='fade'){op=clamp(lt/it.dur);}
    else if(it.a==='letters'){const k=Math.ceil(it.tsp.length*clamp(lt/it.dur)); it.tsp.forEach((s,j)=>s.setAttribute('visibility',j<k?'visible':'hidden'));}
  }
  for(const [kind,a,b,c] of it.loops){
    const A=+a, B=+b;
    if(kind==='bob') ty+=A*Math.sin(2*Math.PI*t/B+it.ph);
    else if(kind==='sway') rot+=A*Math.sin(2*Math.PI*t/B+it.ph);
    else if(kind==='spin') rot+=A*t;
    else if(kind==='drift'){const st=c!==undefined?+c:it.t0; const d=Math.max(0,t-st); tx+=A*d; ty+=(B||0)*d;}
    else if(kind==='flick'){const w=Math.sin(2*Math.PI*t/B+it.ph)+0.5*Math.sin(2*Math.PI*t/(B*0.63)); sy*=1+A*w; sx*=1-A*0.4*w;}
    else if(kind==='pulse'){const w=1+A*Math.sin(2*Math.PI*t/B); sx*=w; sy*=w;}
  }
  if(it.out!==null && t>it.out) op*=clamp(1-(t-it.out)/0.4);
  it.el.setAttribute('transform',`translate(${tx.toFixed(2)},${ty.toFixed(2)}) translate(${it.ox},${it.oy}) rotate(${rot.toFixed(2)}) scale(${sx.toFixed(4)},${sy.toFixed(4)}) translate(${-it.ox},${-it.oy})`);
  it.el.style.opacity=op;
}

let shown=-1;
function setFrame(i,t){
  if(shown!==i){scenes.forEach((s,k)=>s.el.style.display=k===i?'':'none'); shown=i;}
  const s=scenes[i];
  document.getElementById('wob').setAttribute('seed', String(1+(Math.floor(t*6)%23)+i*31));  // line boil, 6x a second
  s.el.style.opacity = t>s.dur-0.35 ? clamp((s.dur-t)/0.35) : 1;
  s.items.forEach(it=>upd(it,t));
}
window.build=build; window.setFrame=setFrame;
