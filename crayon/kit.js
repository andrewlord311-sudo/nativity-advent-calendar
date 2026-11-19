// The KS1 History series kit: Maya and Theo, the den, the magic crayon and door, the Big Timeline, and small objects shared by episodes.
// Everything is built from the primitives in core.js (P, G, TX, ell, cr, ln, poly, dot, sparkle, fire ...), so the look stays the series' crayon look.
// Palette additions (also in the vault style guide): Maya's tunic purple, Theo's tunic green, hair #4a2c1a / orange, paper-wall cream.
const K = {wall:'#fff0c4', wallEdge:'#d9b36a', floor:'#d29b5f', floorEdge:'#8a5a2b', maya:C.purple, theo:C.green, mayaSkin:'#c98f5d',
           mayaHair:'#4a2c1a', brickRed:'#c4543a', slate:'#6f7885', timber:'#5a3a1e', plaster:'#eadbb4', river:'#4a93ea'};

// ---------------------------------------------------------------- the children
// who: 'maya' | 'theo'. x,y = feet. sc = scale (kids are about 0.7 next to a 1.0 grown-up). lh/rh = hand offsets (unscaled) from the feet.
// mouth: 'smile' | 'wow' | 'oh' | 'grin'.  Silhouette is what tells them apart: bunches + purple vs spiky orange + green with a pocket.
function kid(who,x,y,o={}){
  const s=o.sc||0.75, p=(dx,dy)=>[x+dx*s,y+dy*s], w=Math.max(5,8*Math.min(1,s+0.25));
  const maya=who==='maya', lh=o.lh||[-62,-110], rh=o.rh||[62,-110];
  const skin=maya?K.mayaSkin:C.skin, tunic=maya?K.maya:K.theo;
  let str='';
  str+=P(ln(p(-18,-105),p(-26,0),p(-52,3)),{w})+P(ln(p(18,-105),p(26,0),p(52,3)),{w});                       // legs and feet
  str+=P(poly(p(-30,-218),p(30,-218),p(48,-98),p(-48,-98)),{f:tunic,w});                                      // tunic
  if(!maya) str+=P(poly(p(10,-170),p(34,-170),p(34,-140),p(10,-140)),{w:w*0.6});                              // Theo's big pocket
  else str+=P(ln(p(-30,-120),p(30,-120)),{s:'#6a3a9a',w:w*0.6});                                              // a stripe on Maya's tunic
  str+=P(ln(p(-28,-205),p(lh[0],lh[1])),{w})+P(ln(p(28,-205),p(rh[0],rh[1])),{w});                            // arms
  str+=P(ell(...p(0,-268),56*s),{f:skin,w});                                                                  // big round head
  if(maya){
    str+=P(cr([p(-54,-285),p(-44,-322),p(-18,-340),p(18,-340),p(44,-322),p(54,-285)]),{s:K.mayaHair,w:w*2.4});
    str+=P(ell(...p(-72,-290),22*s),{f:K.mayaHair,s:K.mayaHair,w:w*0.8})+P(ell(...p(72,-290),22*s),{f:K.mayaHair,s:K.mayaHair,w:w*0.8});   // two bunches
    str+=P(ln(p(-52,-298),p(-62,-296)),{s:C.red,w:w*1.2})+P(ln(p(52,-298),p(62,-296)),{s:C.red,w:w*1.2});     // bobbles
  } else {
    str+=P(ln(p(-48,-300),p(-38,-345),p(-22,-308),p(-8,-356),p(6,-310),p(22,-354),p(34,-308),p(50,-342),p(48,-298)),{s:C.orange,w:w*1.7});  // spiky hair
  }
  const eyeY=-274;
  if(o.shut) str+=P(cr([p(-28,eyeY),p(-20,eyeY+6),p(-12,eyeY)]),{w:w*0.7})+P(cr([p(12,eyeY),p(20,eyeY+6),p(28,eyeY)]),{w:w*0.7});
  else str+=dot(...p(-20,eyeY),Math.max(4,7*s))+dot(...p(20,eyeY),Math.max(4,7*s));
  const m=o.mouth||'smile';
  if(m==='wow') str+=P(ell(...p(0,-240),11*s,14*s),{f:'#7a2020',w:w*0.7});
  else if(m==='oh') str+=P(ell(...p(0,-242),8*s),{w:w*0.7});
  else if(m==='grin') str+=P(cr([p(-24,-250),p(0,-226),p(24,-250),p(0,-246),p(-24,-250)]),{f:'#7a2020',w:w*0.7});
  else str+=P(cr([p(-22,-250),p(0,-234),p(22,-250)]),{w:w*0.8});
  return str;
}
const kidHand=(x,y,s,h)=>[x+h[0]*s,y+h[1]*s];

// ---------------------------------------------------------------- the den (a child's bedroom-den; also the start and end of every episode)
function windowSun(x,y,w,h,t){
  const cx=x+w*0.5, cy=y+h*0.42; let rays='';
  for(let i=0;i<9;i++){const a=i/9*6.283; rays+=P(ln([cx+Math.cos(a)*44,cy+Math.sin(a)*44],[cx+Math.cos(a)*70,cy+Math.sin(a)*70]),{s:C.orange,w:6});}
  return G(P(poly([x,y],[x+w,y],[x+w,y+h],[x,y+h]),{s:'#8a5a2b',w:9,f:C.sky}),{t,dur:0.8})
    + G(P(ell(cx,cy,34),{s:C.orange,w:6,f:C.yellow})+dot(cx-11,cy-6,4)+dot(cx+11,cy-6,4)+P(cr([[cx-12,cy+9],[cx,cy+18],[cx+12,cy+9]]),{w:4}),{t:t+0.6,dur:0.6})
    + G(rays,{t:t+1.0,dur:0.5,loop:'spin:8',ox:cx,oy:cy})
    + G(P(ln([x+w/2,y],[x+w/2,y+h]),{s:'#8a5a2b',w:8})+P(ln([x,y+h*0.55],[x+w,y+h*0.55]),{s:'#8a5a2b',w:8}),{t:t+0.7,dur:0.4});
}
function den(t=0,o={}){
  let s=G(P(poly([-20,-20],[1940,-20],[1940,925],[-20,925]),{s:K.wallEdge,w:6,f:K.wall}),{t,dur:0.7});
  s+=ground(925,t+0.3,K.floor,K.floorEdge);
  s+=G(P(ln([-20,1000],[1940,1008]),{s:K.floorEdge,w:4})+P(ln([-20,1060],[1940,1064]),{s:K.floorEdge,w:4}),{t:t+0.9,dur:0.5});
  s+=windowSun(1500,70,340,300,t+0.5);
  if(o.rug!==false) s+=G(P(ell(960,995,430,52),{s:C.red,w:6,f:'#f0a79c'}),{t:t+1.0,dur:0.6});
  return s;
}
// the magic red crayon: tip down-left at (x,y), length ~ 230*s, tilted by ang degrees
function crayon(x,y,s,ang=0,t=0){
  const g=P(poly([x-20*s,y-40*s],[x+20*s,y-40*s],[x+20*s,y-210*s],[x-20*s,y-210*s]),{s:'#8a1f15',f:C.red,w:Math.max(5,8*s)})
    +P(poly([x-20*s,y-40*s],[x+20*s,y-40*s],[x,y+6*s]),{s:'#8a1f15',f:C.red,w:Math.max(5,8*s)})
    +P(ln([x-20*s,y-90*s],[x+20*s,y-90*s]),{s:C.white,w:Math.max(5,8*s)})+P(ln([x-20*s,y-150*s],[x+20*s,y-150*s]),{s:C.white,w:Math.max(5,8*s)});
  return `<g transform="rotate(${ang} ${x} ${y})">${g}</g>`;
}
function magnifier(x,y,s,ang=0){   // lens centre at (x,y); handle runs down-right
  const g=P(ell(x,y,48*s),{s:C.brown,w:11*s,f:'#dff3ff'})+P(ln([x+34*s,y+34*s],[x+92*s,y+92*s]),{s:C.brown,w:17*s})
    +P(cr([[x-24*s,y-8*s],[x-12*s,y-26*s],[x+8*s,y-30*s]]),{s:C.white,w:6*s});
  return `<g transform="rotate(${ang} ${x} ${y})">${g}</g>`;
}
// a speech bubble: box centre (x,y), tail pointing to (tx,ty)
function bubble(x,y,w,h,text,tx,ty,t,o={}){
  const body=P(poly([x-w/2,y-h/2],[x+w/2,y-h/2],[x+w/2,y+h/2],[x-w/2,y+h/2]),{f:C.white,w:6})
    +P(poly([x-30,y+h/2-4],[x+30,y+h/2-4],[tx,ty]),{f:C.white,w:6});
  return G(body+TX(text,x,y+(o.size||56)*0.3,{size:o.size||56,c:o.c||C.ink,a:'fade',dur:0.1}),{a:'pop',t,dur:0.45,ox:tx,oy:ty});
}
// a wobbly door standing on the floor line: bottom-centre (x,y). open=false draws it on in crayon; open=true shows it ajar with light behind.
function door(x,y,w,h,t,open=false){
  if(!open){
    return G(P(poly([x-w/2,y],[x-w/2,y-h],[x+w/2,y-h],[x+w/2,y]),{s:'#7a3a1a',f:'#c46a3a',w:9}),{t,dur:1.4})
         + G(P(poly([x-w/2+30,y-30],[x-w/2+30,y-h/2-10],[x+w/2-30,y-h/2-10],[x+w/2-30,y-30]),{s:'#7a3a1a',w:6})+P(ell(x+w/2-34,y-h*0.45,13),{s:C.gold,f:C.gold,w:7}),{t:t+1.2,dur:0.7});
  }
  return G(P(poly([x-w/2,y],[x-w/2,y-h],[x+w/2,y-h],[x+w/2,y]),{s:'#7a3a1a',f:'#fff1a8',w:9}),{t,dur:0.3})
       + G(P(poly([x-w/2+10,y-10],[x-w/2+10,y-h+10],[x+w/2-10,y-h+10],[x+w/2-10,y-10]),{s:'#fff1a8',f:C.yellow,w:3}),{a:'fade',t:t+0.1,dur:0.5,loop:'pulse:0.03:0.8',ox:x,oy:y-h/2})
       + G(P(poly([x-w/2,y],[x-w/2,y-h],[x-w/2-95,y-h+40],[x-w/2-95,y+30]),{s:'#7a3a1a',f:'#c46a3a',w:9})+P(ell(x-w/2-45,y-h*0.5,10),{s:C.gold,f:C.gold,w:6}),{t:t+0.2,dur:0.4})
       + sparkle(x-20,y-h*0.7,24,t+0.5)+sparkle(x+40,y-h*0.35,20,t+0.7)+sparkle(x,y-h-22,18,t+0.9);
}
// ---------------------------------------------------------------- the Big Timeline: a paper strip pinned along the den wall.
// items: [{x, label, pic(svg), t}] positions are along the strip (x in 220..1700). Left end LONG AGO, right end NOW.
function bigTimeline(items,t=0,o={}){
  const y=o.y||520, h=o.h||330, x0=120, x1=1800;
  let s=G(P(poly([x0,y-h/2],[x1,y-h/2],[x1,y+h/2],[x0,y+h/2]),{s:C.ink,f:C.white,w:7}),{t,dur:1});
  s+=G(P(ln([x0+30,y+70],[x1-60,y+70]),{s:C.blue,w:9})+P(ln([x1-100,y+42],[x1-48,y+70],[x1-100,y+98]),{s:C.blue,w:9}),{t:t+0.8,dur:0.8});
  s+=TX('LONG AGO',x0+150,y-h/2+62,{size:46,c:C.red,t:t+1.4})+TX('NOW',x1-110,y-h/2+62,{size:50,c:C.green,t:t+1.6});
  for(const it of items) s+=G(it.pic,{a:'pop',t:it.t,dur:0.5,ox:it.x,oy:y-20}) + (it.label?TX(it.label,it.x,y+70-18,{size:44,c:it.c||C.ink,t:it.t+0.3,out:null}):'');
  // pegs
  s+=[x0+60,x1-60,(x0+x1)/2].map(px=>G(dot(px,y-h/2+6,12,C.red),{t:t+0.9,dur:0.2})).join('');
  return s;
}
// ---------------------------------------------------------------- small objects shared by episodes
function apple(x,y,s,t){
  return G(P(ell(x,y,52*s,48*s),{s:'#8a1f15',f:C.red,w:7*s})+P(ln([x,y-44*s],[x+6*s,y-72*s]),{s:C.brown,w:7*s})+P(cr([[x+8*s,y-62*s],[x+36*s,y-84*s],[x+46*s,y-58*s]]),{s:C.dkgreen,f:C.green,w:5*s}),{a:'pop',t,dur:0.5,ox:x,oy:y});
}
function pizza(x,y,s,t){
  let g=P(ell(x,y,78*s),{s:'#a0661a',f:C.straw,w:8*s})+P(ell(x,y,56*s),{s:C.red,w:5*s});
  [[-24,-20],[20,-30],[28,14],[-30,22],[2,2],[-6,40]].forEach(([dx,dy])=>g+=P(ell(x+dx*s,y+dy*s,11*s),{s:'#8a1f15',f:C.red,w:4*s}));
  return G(g,{a:'pop',t,dur:0.5,ox:x,oy:y});
}
function bookOpen(x,y,w,h){   // an open book seen from the front, centre (x,y)
  return P(poly([x-w,y-h/2],[x,y-h/2+14],[x+w,y-h/2],[x+w,y+h/2],[x,y+h/2+14],[x-w,y+h/2]),{s:C.brown,f:C.white,w:7})
    +P(ln([x,y-h/2+14],[x,y+h/2+14]),{s:C.brown,w:6});
}
function teddy(x,y,s){
  return P(ell(x,y,52*s,58*s),{s:'#7a4a12',f:'#c98a46',w:7*s})+P(ell(x-34*s,y-96*s,16*s),{s:'#7a4a12',f:'#c98a46',w:6*s})+P(ell(x+34*s,y-96*s,16*s),{s:'#7a4a12',f:'#c98a46',w:6*s})
    +P(ell(x,y-78*s,42*s,38*s),{s:'#7a4a12',f:'#c98a46',w:7*s})+P(ell(x,y-66*s,16*s,12*s),{f:'#f1d3a0',s:'#7a4a12',w:5*s})+dot(x-14*s,y-86*s,5*s)+dot(x+14*s,y-86*s,5*s)+dot(x,y-70*s,5*s)
    +P(ell(x-46*s,y+10*s,14*s,22*s),{s:'#7a4a12',f:'#c98a46',w:6*s})+P(ell(x+46*s,y+10*s,14*s,22*s),{s:'#7a4a12',f:'#c98a46',w:6*s});
}

// ---------------------------------------------------------------- shared small pictures (moved here from episode 1)
const castle=(x,y,s)=>P(poly([x-90*s,y],[x-90*s,y-120*s],[x-70*s,y-120*s],[x-70*s,y-145*s],[x-45*s,y-145*s],[x-45*s,y-120*s],[x-20*s,y-120*s],[x-20*s,y-170*s],[x+10*s,y-170*s],[x+10*s,y-120*s],[x+45*s,y-120*s],[x+45*s,y-145*s],[x+70*s,y-145*s],[x+70*s,y-120*s],[x+90*s,y-120*s],[x+90*s,y]),{s:C.dkgrey,f:C.grey,w:7})
  +P(cr([[x-22*s,y],[x-22*s,y-55*s],[x,y-75*s],[x+22*s,y-55*s],[x+22*s,y]]),{f:'#3a3a3a',w:5});
const photoFrame=(x,y,w,h,inner='')=>P(poly([x-w/2,y-h/2],[x+w/2,y-h/2],[x+w/2,y+h/2],[x-w/2,y+h/2]),{s:C.brown,f:'#e8e2d4',w:9})+P(poly([x-w/2+14,y-h/2+14],[x+w/2-14,y-h/2+14],[x+w/2-14,y+h/2-14],[x-w/2+14,y+h/2-14]),{s:C.dkgrey,w:4})+inner;
const calendar=(x,y,s)=>P(poly([x-60*s,y-70*s],[x+60*s,y-70*s],[x+60*s,y+70*s],[x-60*s,y+70*s]),{f:C.white,w:7})+P(poly([x-60*s,y-70*s],[x+60*s,y-70*s],[x+60*s,y-34*s],[x-60*s,y-34*s]),{f:C.red,s:C.red,w:5})+P(cr([[x-30*s,y+4*s],[x-8*s,y+30*s],[x+34*s,y-14*s]]),{s:C.green,w:12*s});
const cake=(x,y,s)=>P(poly([x-70*s,y],[x-70*s,y-60*s],[x+70*s,y-60*s],[x+70*s,y]),{f:C.pink,w:7})+P(ln([x-70*s,y-60*s],[x-40*s,y-42*s],[x-10*s,y-60*s],[x+20*s,y-42*s],[x+50*s,y-60*s],[x+70*s,y-48*s]),{s:C.white,w:7})+P(ln([x,y-60*s],[x,y-100*s]),{s:C.red,w:8})+P(tear(x,y-100*s,10*s,24*s),{f:C.orange,s:C.orange,w:4});
const robot=(x,y,s)=>P(poly([x-34*s,y-110*s],[x+34*s,y-110*s],[x+34*s,y-60*s],[x-34*s,y-60*s]),{f:C.tin,s:C.dkgrey,w:6})+P(poly([x-44*s,y-60*s],[x+44*s,y-60*s],[x+44*s,y],[x-44*s,y]),{f:C.blue,s:C.dkgrey,w:6})+dot(x-14*s,y-90*s,6*s)+dot(x+14*s,y-90*s,6*s)+P(ln([x,y-110*s],[x,y-135*s]),{s:C.dkgrey,w:5})+dot(x,y-138*s,7*s,C.red)+P(ln([x-44*s,y-40*s],[x-70*s,y-60*s]),{s:C.dkgrey,w:7})+P(ln([x+44*s,y-40*s],[x+70*s,y-60*s]),{s:C.dkgrey,w:7});


// ---------------------------------------------------------------- the 'step through the door' scene, shared by every episode.
// o: {draw: when Maya starts drawing, open: when it swings open, walk: when the children go in (omit to keep them in the den),
//     label, labelT: the "how long ago" caption (red), wobbly: show the word "wobbly!"}
function doorScene(o){
  const mx=560, tx=1560, dx=1050;
  let s=den(0);
  const mh=kidHand(mx,990,1.1,[110,-300]);
  const walkM=o.walk?`drift:${(dx-mx-150)/1.3}:0:${o.walk}`:'', walkT=o.walk?`drift:${-(tx-dx-170)/1.3}:0:${o.walk}`:'';
  s+=G(kid('maya',mx,990,{sc:1.1,rh:[110,-300],mouth:'grin'}),{t:0.4,dur:0.7,loop:walkM,out:o.walk?o.walk+1.3:''});
  s+=G(crayon(mh[0],mh[1]+25,1.0,30),{t:0.5,dur:0.2,out:o.walk?o.walk:''});
  s+=G(door(dx,930,300,520,o.draw),{out:o.open,t:o.draw,dur:0.1,a:'fade'});
  if(o.wobbly) s+=TX('wobbly!',1330,470,{size:64,c:C.red,t:o.draw+1.9,out:o.open});
  s+=G(kid('theo',tx,990,{sc:1.0,mouth:'wow',lh:[-85,-190]}),{t:1.2,dur:0.8,loop:walkT,out:o.walk?o.walk+1.3:''});
  s+=door(dx,930,300,520,o.open,true);
  if(o.label) s+=TX(o.label,dx,300,{size:o.labelSize||88,cols:[C.bronze,C.orange,C.red,C.gold],t:o.labelT,dur:0.8,loop:'pulse:0.05:0.8'});
  return s;
}

// ---------------------------------------------------------------- toys and 1960s home (episode 3)
function spinTop(x,y,s){   // a wooden spinning top, tip at (x,y)
  return P(ln([x,y-108*s],[x,y-175*s]),{s:C.brown,w:13*s})+dot(x,y-180*s,12*s,C.brown)
    +P(poly([x-62*s,y-108*s],[x+62*s,y-108*s],[x+6*s,y],[x-6*s,y]),{s:'#8a1f15',f:C.red,w:7*s})
    +P(ln([x-48*s,y-78*s],[x+48*s,y-78*s]),{s:C.yellow,w:12*s})+P(ln([x-28*s,y-42*s],[x+28*s,y-42*s]),{s:C.yellow,w:11*s});
}
function tablet(x,y,s,ang=0){   // centre (x,y)
  const g=P(poly([x-120*s,y-80*s],[x+120*s,y-80*s],[x+120*s,y+80*s],[x-120*s,y+80*s]),{s:C.ink,f:C.dkgrey,w:8*s})
    +P(poly([x-100*s,y-62*s],[x+100*s,y-62*s],[x+100*s,y+62*s],[x-100*s,y+62*s]),{s:C.blue,f:'#bfe6ff',w:4*s})
    +P(ell(x-36*s,y-6*s,24*s),{f:C.yellow,s:C.orange,w:5*s})+P(cr([[x+10*s,y+30*s],[x+44*s,y-30*s],[x+80*s,y+30*s]]),{s:C.green,w:8*s});
  return `<g transform="rotate(${ang} ${x} ${y})">${g}</g>`;
}
const marble=(x,y,r,c)=>P(ell(x,y,r),{f:c,w:6})+P(cr([[x-r*0.5,y-r*0.2],[x-r*0.3,y-r*0.55],[x,y-r*0.6]]),{s:C.white,w:5});
function hoop(x,y,s){ return P(ell(x,y,100*s,30*s),{s:C.yellow,w:15*s}); }
function ropeArc(x1,y1,x2,y2,sag){ return P(cr([[x1,y1],[(x1+x2)/2-(x2-x1)*0.25,(y1+y2)/2+sag*0.8],[(x1+x2)/2,(y1+y2)/2+sag],[(x1+x2)/2+(x2-x1)*0.25,(y1+y2)/2+sag*0.8],[x2,y2]]),{s:C.brown,w:8}); }
function hopscotch(x,y,w,h,numbers=true){   // flat chalk grid, centre of the bottom edge at (x,y); 1 | 2 3 | 4 | 5 6
  const rows=[[1],[2,3],[4],[5,6]]; let g='', yy=y;
  rows.forEach((r,ri)=>{ r.forEach((n,i)=>{ const x0=x-(r.length*w)/2+i*w;
    g+=P(poly([x0,yy],[x0+w,yy],[x0+w,yy-h],[x0,yy-h]),{s:C.white,w:6})+(numbers?TX(String(n),x0+w/2,yy-h*0.28,{size:h*0.55,c:C.white,a:'fade',dur:0.1}):''); }); yy-=h; });
  return g;
}
function boardGame(x,y,sz){   // snakes and ladders, centre (x,y)
  const h=sz/2, c=sz/5; let g=P(poly([x-h,y-h],[x+h,y-h],[x+h,y+h],[x-h,y+h]),{s:C.ink,f:'#fff6c9',w:9});
  for(let i=1;i<5;i++) g+=P(ln([x-h+i*c,y-h+4],[x-h+i*c,y+h-4]),{s:'#b8a15a',w:4})+P(ln([x-h+4,y-h+i*c],[x+h-4,y-h+i*c]),{s:'#b8a15a',w:4});
  g+=P(ln([x-h*0.6,y+h*0.8],[x-h*0.2,y-h*0.5]),{s:C.brown,w:8})+P(ln([x-h*0.35,y+h*0.8],[x+h*0.05,y-h*0.5]),{s:C.brown,w:8});
  for(let k=0;k<4;k++) g+=P(ln([x-h*0.55+k*h*0.14,y+h*0.62-k*h*0.38],[x-h*0.3+k*h*0.14,y+h*0.58-k*h*0.38]),{s:C.brown,w:6});
  g+=P(cr([[x+h*0.7,y-h*0.7],[x+h*0.4,y-h*0.35],[x+h*0.75,y-h*0.05],[x+h*0.35,y+h*0.3],[x+h*0.6,y+h*0.7]]),{s:C.dkgreen,w:14})+dot(x+h*0.7,y-h*0.76,10,C.dkgreen)
    +dot(x-h*0.1,y+h*0.45,12,C.red)+dot(x+h*0.1,y+h*0.1,12,C.blue);
  return g;
}
function radio(x,y,s){   // centre (x,y)
  return P(ln([x+60*s,y-90*s],[x+130*s,y-170*s]),{s:C.dkgrey,w:6*s})
    +P(poly([x-110*s,y-90*s],[x+110*s,y-90*s],[x+110*s,y+90*s],[x-110*s,y+90*s]),{s:'#5a3614',f:C.brown,w:8*s})
    +P(ell(x-40*s,y,52*s),{s:C.ink,f:'#d9b87a',w:6*s})+P(ell(x-40*s,y,26*s),{s:C.ink,w:4*s})
    +P(ln([x+25*s,y-40*s],[x+90*s,y-40*s]),{s:C.straw,w:7*s})+P(ln([x+25*s,y],[x+90*s,y]),{s:C.straw,w:7*s})+P(ln([x+25*s,y+40*s],[x+90*s,y+40*s]),{s:C.straw,w:7*s})
    +dot(x+58*s,y-70*s,8*s,C.straw)+dot(x+86*s,y-70*s,8*s,C.straw);
}
function oldTV(x,y,s){   // black-and-white telly, centre (x,y)
  return P(ln([x,y-100*s],[x-60*s,y-180*s]),{s:C.dkgrey,w:6*s})+P(ln([x,y-100*s],[x+60*s,y-180*s]),{s:C.dkgrey,w:6*s})
    +P(poly([x-140*s,y-100*s],[x+140*s,y-100*s],[x+140*s,y+100*s],[x-140*s,y+100*s]),{s:'#5a3614',f:C.brown,w:8*s})
    +P(cr([[x-112*s,y-78*s],[x+50*s,y-80*s],[x+56*s,y+78*s],[x-112*s,y+78*s],[x-112*s,y-78*s]]),{s:C.ink,f:'#c9c9c9',w:6*s})
    +P(ell(x-30*s,y-10*s,22*s),{f:'#8a8a8a',s:'#5d5d5d',w:5*s})+P(poly([x-60*s,y+78*s],[x,y+78*s],[x-6*s,y+20*s],[x-54*s,y+20*s]),{f:'#8a8a8a',s:'#5d5d5d',w:5*s})
    +dot(x+92*s,y-40*s,13*s,C.ink)+dot(x+92*s,y+10*s,13*s,C.ink)
    +P(ln([x-110*s,y+100*s],[x-120*s,y+135*s]),{s:C.dkgrey,w:7*s})+P(ln([x+110*s,y+100*s],[x+120*s,y+135*s]),{s:C.dkgrey,w:7*s});
}
function windKey(x,y,s){ return P(ln([x,y],[x+46*s,y]),{s:C.gold,w:8*s})+P(ell(x+60*s,y,18*s,26*s),{s:'#9c7a10',f:C.gold,w:6*s}); }
function museumCase(x,y,w,h,inner=''){   // glass case on a plinth; (x,y) = centre of the glass
  return P(poly([x-w/2,y+h/2],[x-w/2,y+h/2+90],[x+w/2,y+h/2+90],[x+w/2,y+h/2]),{s:C.ink,f:'#d9c9a8',w:8})
    +P(poly([x-w/2,y-h/2],[x+w/2,y-h/2],[x+w/2,y+h/2],[x-w/2,y+h/2]),{s:C.blue,f:'#e6f6ff',w:8})+inner
    +P(ln([x-w/2+25,y-h/2+30],[x-w/2+60,y-h/2+75]),{s:C.white,w:7});
}
function grandad(x,y,o={}){   // an old man: grey hair, glasses
  const s=o.sc||0.9, p=(dx,dy)=>[x+dx*s,y+dy*s];
  return person(x,y,{sc:s,c:o.c||C.blue,hair:'#e4e4e4',lh:o.lh,rh:o.rh})
    +P(ell(...p(-15,-340),17*s),{w:4})+P(ell(...p(15,-340),17*s),{w:4})+P(ln(p(-2,-340),p(2,-340)),{w:4})
    +P(cr([p(-22,-336),p(0,-322),p(22,-336)]),{w:5});
}
