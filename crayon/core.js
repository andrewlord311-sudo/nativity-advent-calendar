// Core of the crayon look: seeded randomness, wobbly geometry, drawing primitives, standard scenery.
// Extracted unchanged from bronze-age/scenes.html (2.10.26) so every video keeps the same style.
const NS = "http://www.w3.org/2000/svg";
const C = {ink:'#2b2b2b', red:'#e8392c', orange:'#f28c28', yellow:'#f7d117', green:'#43b04a',
  dkgreen:'#2a7f33', blue:'#2f7de1', sky:'#8fd0fa', sea:'#4a93ea', brown:'#8a5a2b', grey:'#9a9a9a',
  dkgrey:'#5d6168', pink:'#f59ac0', bronze:'#d08a2e', gold:'#f2c230', purple:'#8e4fc9', skin:'#f6c9a0',
  copper:'#d9692a', tin:'#b9c3cc', iron:'#5b6470', straw:'#eccb5e', soil:'#a8744a', white:'#ffffff'};

// ---------- seeded randomness so every render is identical ----------
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let rng = mulberry32(1);
const R = (a,b)=>a+(b-a)*rng(), J = v=>R(-v,v);
const f = p=>p[0].toFixed(1)+','+p[1].toFixed(1);
const esc = s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');

// ---------- wobbly geometry ----------
function cr(pts){               // Catmull-Rom through the points -> cubic beziers
  let d=`M${f(pts[0])}`;
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2;
    d+=`C${f([p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6])} ${f([p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6])} ${f(p2)}`;
  }
  return d;
}
function ln(...pts){            // hand-ruled line through points, gentle wobble on long runs
  const out=[pts[0]];
  for(let i=1;i<pts.length;i++){
    const a=pts[i-1], b=pts[i], L=Math.hypot(b[0]-a[0],b[1]-a[1]), m=Math.max(1,Math.round(L/130));
    for(let k=1;k<=m;k++){
      const u=k/m, p=[a[0]+(b[0]-a[0])*u, a[1]+(b[1]-a[1])*u];
      if(k<m){p[0]+=J(3.5);p[1]+=J(3.5);}
      out.push(p);
    }
  }
  return cr(out);
}
const lerp=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];
function poly(...pts){ return ln(...pts, pts[0], lerp(pts[0],pts[1],0.1)); }   // closes with a little overshoot
function ell(cx,cy,rx,ry=rx){   // circles never quite close when you're seven
  const a0=R(0,6.283), n=18, turn=1.05+R(0,0.07), pts=[];
  for(let i=0;i<=n;i++){
    const a=a0+i/n*Math.PI*2*turn, k=1+J(0.035)+(0.5-i/n)*0.05;
    pts.push([cx+Math.cos(a)*rx*k, cy+Math.sin(a)*ry*k]);
  }
  return cr(pts);
}
function bumpy(cx,cy,rx,ry,b=0.1,k=7){
  const a0=R(0,6.283), n=40, pts=[];
  for(let i=0;i<=n+2;i++){
    const a=a0+i/n*Math.PI*2, r=1+b*Math.sin(k*a)+J(0.02);
    pts.push([cx+Math.cos(a)*rx*r, cy+Math.sin(a)*ry*r]);
  }
  return cr(pts);
}

// ---------- drawing primitives ----------
// P = one crayon stroke (optionally coloured in with a scribble). G = an item with its own timing.
function P(d,o={}){
  return `<path class="o" d="${d}" fill="none" stroke="${o.s||C.ink}" stroke-width="${o.w||7}" stroke-linecap="round" stroke-linejoin="round" pathLength="1"${o.f?` data-fill="${o.f}"`:''}/>`;
}
function G(inner,o={}){
  return `<g class="it" data-a="${o.a||'draw'}" data-t="${o.t||0}" data-dur="${o.dur||0.8}" data-ox="${o.ox||0}" data-oy="${o.oy||0}" data-loop="${o.loop||''}" data-out="${o.out??''}">${inner}</g>`;
}
const dot=(x,y,r=6,c=C.ink)=>P(`M${f([x,y])} l0.1,0`,{w:r*2,s:c});

function TX(str,x,y,o={}){
  const size=o.size||56, cols=o.cols||[o.c||C.ink];
  let sp='', cur=0;
  [...str].forEach((ch,i)=>{
    const tgt=J(o.dy??3); const dy=tgt-cur; cur=tgt;
    sp+=`<tspan fill="${cols[i%cols.length]}" rotate="${J(o.rot??5).toFixed(1)}" dy="${dy.toFixed(1)}">${esc(ch)}</tspan>`;
  });
  return G(`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${o.anchor||'middle'}">${sp}</text>`,
    {a:o.a||'letters', t:o.t, dur:o.dur||Math.max(0.3,str.length/16), loop:o.loop, ox:x, oy:y-size*0.35, out:o.out});
}
const RAINBOW=[C.red,C.orange,C.green,C.blue,C.purple];
function heading(str){
  const w=Math.min(1500,str.length*84*0.5), pts=[];
  for(let i=0;i<=24;i++){const u=i/24; pts.push([960-w/2+w*u, 185+Math.sin(u*Math.PI*6)*7]);}
  return TX(str,960,150,{size:84,cols:RAINBOW,t:0.1}) + G(P(cr(pts),{s:C.orange,w:6}),{t:0.1+str.length/16,dur:0.6});
}
function arrow(x1,y1,x2,y2,o={}){
  const c=o.c||C.ink, b=o.bend||0, w=o.w||8;
  const m=[(x1+x2)/2-(y2-y1)*b,(y1+y2)/2+(x2-x1)*b];
  const ang=Math.atan2(y2-m[1],x2-m[0]), hl=o.hl||34;
  const h1=[x2-Math.cos(ang-0.5)*hl,y2-Math.sin(ang-0.5)*hl], h2=[x2-Math.cos(ang+0.5)*hl,y2-Math.sin(ang+0.5)*hl];
  return G(P(cr([[x1,y1],m,[x2,y2]]),{s:c,w})+P(ln(h1,[x2,y2],h2),{s:c,w}),{t:o.t,dur:o.dur||0.6});
}
function sun(x,y,t){
  let rays='';
  for(let i=0;i<10;i++){
    const a=i/10*6.283+J(0.1), r2=138+J(12);
    rays+=P(ln([x+Math.cos(a)*95,y+Math.sin(a)*95],[x+Math.cos(a)*r2,y+Math.sin(a)*r2]),{s:C.orange,w:8});
  }
  return G(P(ell(x,y,72),{s:C.orange,w:8,f:C.yellow})+dot(x-24,y-14,7)+dot(x+24,y-14,7)+P(cr([[x-28,y+14],[x,y+34],[x+28,y+14]]),{w:6}),{t,dur:1})
       + G(rays,{t:t+0.7,dur:0.8,loop:'spin:9',ox:x,oy:y});
}
function sky(t=0){
  const pts=[[-20,-30],[1940,-30],[1940,58]];
  for(let x=1800;x>=-20;x-=180) pts.push([x,58+J(9)]);
  return G(P(poly(...pts),{s:C.blue,w:6,f:C.sky}),{t,dur:0.8});
}
function ground(y,t=0,fill=C.green,edge=C.dkgreen){
  const pts=[[-20,y]];
  for(let x=160;x<=1880;x+=180) pts.push([x,y+J(9)]);
  pts.push([1960,y+J(6)],[1960,1110],[-20,1110]);
  return G(P(poly(...pts),{s:edge,w:8,f:fill}),{t,dur:1});
}
function sea(y,t=0){
  const pts=[[-20,y]];
  for(let x=140;x<=1880;x+=160) pts.push([x,y+J(12)]);
  pts.push([1960,y+J(8)],[1960,1110],[-20,1110]);
  return G(P(poly(...pts),{s:C.blue,w:8,f:C.sea}),{t,dur:1});
}
function waves(list,t){
  return list.map(([x,y],i)=>G(P(cr([[x-32,y],[x-16,y-15],[x,y],[x+16,y-15],[x+32,y]]),{s:'#1d5fb8',w:6}),
    {a:'fade',t:t+i*0.12,dur:0.3,loop:`bob:6:${1.4+i%3*0.3}`})).join('');
}

// person: y = feet. lh/rh = hand offsets (unscaled) from the feet point.
function person(x,y,o={}){
  const s=o.sc||1, p=(dx,dy)=>[x+dx*s,y+dy*s], w=Math.max(4,7*Math.min(1,s+0.25));
  const lh=o.lh||[-95,-175], rh=o.rh||[95,-175], hair=o.hair||C.brown;
  let str='';
  str+=P(ln(p(-24,-130),p(-34,0),p(-60,2)),{w}) + P(ln(p(24,-130),p(34,0),p(60,2)),{w});
  str+=P(poly(p(-35,-290),p(35,-290),p(58,-128),p(-58,-128)),{f:o.c||C.red,w});
  str+=P(ln(p(-32,-274),p(lh[0],lh[1])),{w}) + P(ln(p(32,-274),p(rh[0],rh[1])),{w});
  str+=P(ell(...p(0,-335),42*s),{f:C.skin,w});
  if(o.long) str+=P(cr([p(-40,-300),p(-50,-345),p(-30,-378),p(0,-386),p(30,-378),p(50,-345),p(44,-300),p(52,-262)]),{s:hair,w:w*2});
  else str+=P(cr([p(-40,-352),p(-26,-378),p(0,-385),p(26,-378),p(40,-354)]),{s:hair,w:w*2.2});
  if(o.shut) str+=P(cr([p(-22,-338),p(-15,-333),p(-8,-338)]),{w:w*0.7})+P(cr([p(8,-338),p(15,-333),p(22,-338)]),{w:w*0.7});
  else str+=dot(...p(-15,-340),Math.max(3.5,6*s))+dot(...p(15,-340),Math.max(3.5,6*s));
  str+=P(cr([p(-18,-318),p(0,-305),p(18,-318)]),{w:w*0.8});
  return str;
}
const hand=(x,y,s,h)=>[x+h[0]*s,y+h[1]*s];

function axe(hx,hy,s,kind='bronze',ang=0){
  let str=P(ln([hx,hy+45*s],[hx,hy-(kind==='stone'?170:205)*s]),{s:C.brown,w:Math.max(8,14*s)});
  if(kind==='stone'){
    str+=P(ell(hx+32*s,hy-160*s,58*s,38*s),{f:C.grey,s:C.dkgrey});
    str+=P(ln([hx-10*s,hy-175*s],[hx+12*s,hy-140*s]),{s:C.brown,w:5})+P(ln([hx+12*s,hy-178*s],[hx-10*s,hy-142*s]),{s:C.brown,w:5});
  } else {
    const col=kind==='iron'?C.iron:C.bronze;
    str+=P(cr([[hx-12*s,hy-185*s],[hx+45*s,hy-180*s],[hx+82*s,hy-218*s],[hx+102*s,hy-160*s],[hx+82*s,hy-100*s],[hx+45*s,hy-138*s],[hx-12*s,hy-135*s],[hx-12*s,hy-185*s]]),{f:col,s:'#7a4a12'});
    if(kind==='bronze') str+=P(cr([[hx+82*s,hy-195*s],[hx+90*s,hy-160*s],[hx+82*s,hy-122*s]]),{s:C.yellow,w:6});
  }
  return `<g transform="rotate(${ang} ${hx} ${hy})">${str}</g>`;
}
function sword(x,top,len,col){
  const w=len*0.075, q=u=>top+len*u;
  return P(cr([[x,top],[x+w*0.8,q(0.2)],[x+w,q(0.5)],[x+w*0.7,q(0.72)],[x,q(0.74)],[x-w*0.7,q(0.72)],[x-w,q(0.5)],[x-w*0.8,q(0.2)],[x,top]]),{f:col,s:col===C.iron?'#2e333a':'#7a4a12'})
    + P(ln([x,q(0.1)],[x,q(0.66)]),{s:col===C.iron?'#8b95a1':C.yellow,w:5})
    + P(ln([x-w*2.2,q(0.75)],[x+w*2.2,q(0.75)]),{s:C.brown,w:14})
    + P(ln([x,q(0.76)],[x,q(0.95)]),{s:C.brown,w:18}) + dot(x,q(0.98),13,C.brown);
}
function sparkle(x,y,sz,t,c=C.gold){
  return G(P(ln([x-sz,y],[x+sz,y]),{s:c,w:7})+P(ln([x,y-sz],[x,y+sz]),{s:c,w:7})
    +P(ln([x-sz*0.45,y-sz*0.45],[x+sz*0.45,y+sz*0.45]),{s:c,w:5})+P(ln([x+sz*0.45,y-sz*0.45],[x-sz*0.45,y+sz*0.45]),{s:c,w:5}),
    {a:'pop',t,dur:0.4,loop:'spin:50',ox:x,oy:y});
}
function tear(x,y,w,h){
  return cr([[x,y],[x-w,y-h*0.3],[x-w*0.45,y-h*0.75],[x,y-h],[x+w*0.5,y-h*0.7],[x+w,y-h*0.28],[x+w*0.3,y+2],[x,y]]);
}
function fire(x,y,s,t){
  const logs=P(ln([x-75*s,y+15*s],[x+75*s,y-15*s]),{s:C.brown,w:18*s})+P(ln([x-75*s,y-15*s],[x+75*s,y+15*s]),{s:C.brown,w:18*s});
  const fl=P(tear(x,y,62*s,165*s),{s:C.red,f:C.red,w:6})+P(tear(x,y,40*s,115*s),{s:C.orange,f:C.orange,w:6})+P(tear(x,y,22*s,70*s),{s:C.yellow,f:C.yellow,w:5});
  return G(logs,{t,dur:0.5}) + G(fl,{t:t+0.4,dur:0.7,loop:'flick:0.12:0.35',ox:x,oy:y});
}
function tree(x,y,t){
  return G(P(ln([x,y],[x,y-85]),{s:C.brown,w:16})+P(bumpy(x,y-125,55,45,0.12,6),{s:C.dkgreen,f:C.green}),{t,dur:0.7});
}
function boat(x,y,w,people,extra=''){
  let str='';
  people.forEach(([dx,c,hair,lng])=>{
    const px=x+dx, s=0.4, h=hand(px,y-8,s,[80,-60]);
    str+=person(px,y-8,{sc:s,c,hair,long:lng,rh:[80,-60]});
    str+=P(ln(h,[h[0]+105,y+75]),{s:C.brown,w:6})+P(ell(h[0]+110,y+82,11,17),{s:C.brown,w:5,f:C.brown});
  });
  str+=extra;
  str+=P(cr([[x-w/2-12,y-48],[x-w/2+22,y+8],[x-w/4,y+34],[x+w/4,y+34],[x+w/2-22,y+8],[x+w/2+12,y-48],[x-w/2-12,y-48]]),{s:'#5a3614',f:C.brown});
  str+=P(ln([x-w/2+25,y-8],[x+w/2-25,y-8]),{s:'#5a3614',w:5});
  return str;
}
function rock(x,y,rx,ry,col,edge){ return P(bumpy(x,y,rx,ry,0.07,5),{f:col,s:edge||C.ink}); }

