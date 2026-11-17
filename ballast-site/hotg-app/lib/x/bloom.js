/* HOTG bloom module: exact geometry from the master mark */
const C={blush:'#EE8E9A',ox:'#6E0F1F',forest:'#0E5A2C',r:'#D7263D',g:'#17963F',b:'#2E3FB0',y:'#F5C400',w:'#F8F2EC',k:'#1B1714',deep:'#9E1B32',wh:'#FFFFFF',gold:'#C9A24A'};
const CX=320,CY=322;let PET='',LINES='',N=0;
const uid=p=>p+(++N);
function wedge(k,R=520){const a0=k*Math.PI/4,a1=(k+1)*Math.PI/4;return `${CX},${CY} ${CX+R*Math.cos(a0)},${CY+R*Math.sin(a0)} ${CX+R*Math.cos((a0+a1)/2)*1.2},${CY+R*Math.sin((a0+a1)/2)*1.2} ${CX+R*Math.cos(a1)},${CY+R*Math.sin(a1)}`}
const sc=(s,rot=0)=>`translate(${CX} ${CY}) rotate(${rot}) scale(${s}) translate(${-CX} ${-CY})`;
/* bloom(): the module.
   petals: 8 fills (null = not earned, drawn as outline)
   stage: outer petal scale; inner: 8 fills for a second ring (full bloom)
   ball, line, bg, ring: outer ring colour, out: outline colour for empty petals */
function bloom(o={}){
 const p=o.petals||Array(8).fill(C.r),s=o.scale??1,bg=o.bg||C.w,line=o.line||bg,ball=o.ball||(p.find(Boolean)||C.r),sw=o.sw||13,out=o.out||'#CFC4B6';
 const is=o.innerScale||.74,ir=o.innerRot??0;
 const W=Array.from({length:8},(_,k)=>uid('w'));const cu=uid('u'),ci=uid('i'),cf=uid('f');
 const front=o.front||[];const fm=uid('fm');const ps=o.ps||Array(8).fill(1),bs=o.bs??1,pmax=Math.max(...ps);
 let d=`<defs>${W.map((id,k)=>`<clipPath id="${id}"><polygon points="${wedge(k)}"/></clipPath>`).join('')}
  <clipPath id="${cu}"><path d="${PET}" transform="${sc(s*pmax)}"/><circle cx="${CX}" cy="${CY}" r="${135*bs}"/>${o.inner?`<path d="${PET}" transform="${sc(is,ir)}"/>`:''}</clipPath>
  <clipPath id="${ci}"><circle cx="${CX}" cy="${CY}" r="${261*Math.max(s*pmax,1)}"/></clipPath>
  <mask id="${fm}" maskUnits="userSpaceOnUse" x="-400" y="-400" width="1400" height="1400"><rect x="-400" y="-400" width="1400" height="1400" fill="#fff"/><circle cx="${CX}" cy="${CY}" r="150" fill="#000"/></mask><clipPath id="${cf}">${front.map(k=>`<g transform="${sc(o.frontScale||.6,ir)}"><g clip-path="url(#${W[k]})"><path d="${PET}" mask="url(#${fm})"/></g></g>`).join('')}</clipPath></defs>`;
 const petalSet=(fills,tf,stroke,frontOnly,pk)=>`<g transform="${tf}">${fills.map((f,k)=>(frontOnly&&!frontOnly.includes(k))?'':`<g clip-path="url(#${W[k]})"><path ${pk?`transform="${sc(pk[k])}"`:''} ${frontOnly?`mask="url(#${fm})"`:''} d="${PET}" fill="${f||'none'}" ${f?(stroke?`stroke="${o.gap||bg}" stroke-width="${stroke}" paint-order="stroke"`:''):`stroke="${out}" stroke-width="${sw*.5}" vector-effect="non-scaling-stroke"`}/></g>`).join('')}</g>`;
 let g=(o.border?`<path d="${PET}" transform="${sc(s)}" fill="${o.border}" stroke="${o.border}" stroke-width="${o.bw||22}" stroke-linejoin="round"/>`:'')+petalSet(p,sc(s),0,null,o.ps?ps:null);
 if(o.inner)g+=petalSet(o.inner,sc(is,ir),26,null,o.ps?ps:null);
 g+=`<circle cx="${CX}" cy="${CY}" r="${135*bs}" fill="${ball}"/>`;
 g+=`<g clip-path="url(#${cu})"><g clip-path="url(#${ci})" fill="none" stroke="${line}" stroke-width="${sw}">${bs!==1?`<g transform="${sc(bs)}" stroke-width="${sw/bs}">${LINES}</g>`:LINES}${o.ps?`<path d="M${CX-700} ${CY}H${CX+700}M${CX} ${CY-700}V${CY+700}"/>`:''}</g></g>`;
 if(o.solidBall)g+=`<circle cx="${CX}" cy="${CY}" r="${135-sw*1.2}" fill="${ball}"/>`;
 if(front.length){g+=petalSet(o.frontFill?Array(8).fill(o.frontFill):(o.inner||Array(8).fill(C.deep)),sc(o.frontScale||.6,ir),30,front);g+=`<g clip-path="url(#${cf})" fill="none" stroke="${line}" stroke-width="${sw}">${LINES}</g>`}
 const vb=o.vb||(o.ps?`${CX-262*Math.max(1,pmax)-4} ${CY-262*Math.max(1,pmax)-4} ${524*Math.max(1,pmax)+8} ${524*Math.max(1,pmax)+8}`:'58 60 524 524');
 return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${d}<g transform="rotate(${90+(o.tilt||0)} ${CX} ${CY})">${g}</g>${o.extra||''}</svg>`;
}
/* one petal unit: the petal, a gap, and its slice of the ball */
function petal(fill,o={}){const k=0;const id=uid('w'),m=uid('m');const rot=157.5-45*k;
 return `<svg viewBox="${o.vb||'170 20 300 300'}" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${id}"><polygon points="${wedge(k)}"/></clipPath>
 <mask id="${m}" maskUnits="userSpaceOnUse" x="-400" y="-400" width="1400" height="1400"><rect x="-400" y="-400" width="1400" height="1400" fill="#fff"/><circle cx="${CX}" cy="${CY}" r="${o.slice?149:146}" fill="#000"/></mask></defs>
 <g transform="rotate(${rot} ${CX} ${CY}) rotate(90 ${CX} ${CY})"><g clip-path="url(#${id})"><path d="${PET}" fill="${fill}" mask="url(#${m})"/>${o.slice?`<circle cx="${CX}" cy="${CY}" r="135" fill="${o.slice}"/><g fill="none" stroke="${o.lines||'#fff'}" stroke-width="13"><circle cx="${CX}" cy="${CY}" r="135" fill="none" stroke="none"/>${LINES}</g>`:''}</g></g>${o.extra||''}</svg>`}

window.bloomReady=fetch((window.BLOOM_BASE||'')+'../guide/mark.tpl.svg').then(r=>r.text()).then(t=>{const doc=new DOMParser().parseFromString(t,'image/svg+xml');
 PET=doc.querySelector('path[fill="__INK__"]').getAttribute('d');
 const lg=doc.querySelector('g[stroke="__LINE__"]');LINES=[...lg.children].map(e=>e.outerHTML.replace(/ xmlns="[^"]*"/g,'')).join('');});

/* off-kilter: ONE locked uneven shape (petal lengths follow a fixed wave). Variety comes only from rotating the whole bloom.
   SHAPES: candidates; MASTER is the locked one. kilter(seed) -> the master shape at one of 8 rotations (45deg steps). */
const SHAPES={A:k=>.9+.1*Math.sin(k),B:k=>.92+.08*Math.sin(2*k),C:k=>.9+.1*Math.sin(k+2),D:k=>.94+.06*Math.sin(k)};
let MASTER='A';
const shape=(n=MASTER)=>Array.from({length:8},(_,k)=>SHAPES[n](k));
function kilter(seed,amt=1,n){let x=(seed*9301+49297)%233280;const r=()=>(x=(x*9301+49297)%233280)/233280;
 return {ps:shape(n).map(v=>1+(v-1)*amt),tilt:Math.floor(r()*8)*45}}
