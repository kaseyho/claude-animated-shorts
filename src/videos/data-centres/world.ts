import * as T from 'three';
import { Pen, bodyFront, bodySide, Outfit, Expr } from '../../../templates/bridge/toon';
import { addEnvironment } from './environment';

const INK = '#252940';
const C = { teal:'#218f96', navy:'#293f5c', blue:'#347fae', coral:'#e8794c', cream:'#f4ddac', grass:'#8aad79', dark:'#292e48', gold:'#f2b83e' };
const v = (x=0,y=0,z=0) => new T.Vector3(x,y,z);
const ease = (t:number) => { t=Math.max(0,Math.min(1,t)); return t*t*(3-2*t); };
const mat = (color:string) => new T.MeshLambertMaterial({color});


type CameraBeat={at:number;pos:[number,number,number];to:[number,number,number];look:[number,number,number]};
// Hard cuts introduce a new idea; restrained moves inside each beat provide parallax.
// Normalized positions follow the measured narration without changing native speech.
const CAMERA_TRACKS:Record<number,CameraBeat[]>={
  1:[
    {at:0,pos:[1.2,3.8,11.4],to:[.8,3.65,10.9],look:[.1,2.3,3.2]},
    {at:1.98/6.9,pos:[4.4,6.8,18.5],to:[3.7,6.3,17.7],look:[0,2.3,0]},
    {at:5.81/6.9,pos:[1.1,3.9,12.2],to:[.7,3.7,11.6],look:[-.1,2.3,3.1]},
  ],
  2:[
    {at:0,pos:[-2,8.2,23.4],to:[-1.6,7.9,22.8],look:[-1.8,1.8,.4]},
    {at:2.18/(199/30),pos:[4,6.3,17.5],to:[3.5,6,16.9],look:[0,1.9,1]},
    {at:4.11/(199/30),pos:[6.2,6.4,18.3],to:[5.7,6.2,17.8],look:[0,2,0]},
  ],
  3:[
    {at:0,pos:[5,4.8,14.8],to:[4.5,4.6,14.3],look:[-.4,2.4,-.5]},
    {at:2.98/(263/30),pos:[5.4,7.5,20],to:[4.9,7.1,19.5],look:[0,3.5,-.5]},
    {at:5.5166666667/(263/30),pos:[2.8,7.1,19.5],to:[2.2,6.8,19],look:[0,3.5,0]},
  ],
  4:[
    {at:0,pos:[7.4,7.5,20],to:[6.9,7.2,19.5],look:[0,2.1,0]},
    {at:1.93/5.5,pos:[5.2,6.7,16.8],to:[4.8,6.5,16.3],look:[-.5,3.4,0]},
    {at:3.1/5.5,pos:[2.2,4.5,13.2],to:[1.7,4.3,12.8],look:[0,2.8,3.4]},
  ],
  5:[
    {at:0,pos:[5,7,20],to:[4.5,6.7,19.4],look:[0,2.2,0]},
    {at:1.62/(209/30),pos:[2.6,5.5,15],to:[2.1,5.2,14.5],look:[-1.1,2.4,0]},
    {at:4.2/(209/30),pos:[2.2,5.6,16.6],to:[1.7,5.4,16],look:[0,2.1,2.2]},
  ],
  6:[
    {at:0,pos:[3,6.5,21],to:[2.6,6.2,20.5],look:[0,2,0]},
    {at:1.1133333333/(173/30),pos:[4.6,6.2,16.7],to:[4.1,6,16.2],look:[1.4,3,-1.1]},
    {at:3.4333333333/(173/30),pos:[.2,4.6,13.6],to:[-.2,4.4,13.1],look:[-1.1,2.4,3.1]},
  ],
  7:[
    {at:0,pos:[4,7.4,20],to:[3.4,7,19.5],look:[0,2,0]},
    {at:2.9666666667/(194/30),pos:[1.5,5.4,16.8],to:[.9,5.2,16.2],look:[0,2.1,2.5]},
  ],
  8:[
    {at:0,pos:[3,6.5,20],to:[2.6,6.2,19.5],look:[0,2.2,0]},
    {at:2.59/8.6,pos:[4.4,4.4,13.3],to:[4.1,4.2,12.8],look:[1.5,2.3,2.9]},
    {at:4.69/8.6,pos:[3.5,7.2,20],to:[2.9,6.8,19.3],look:[0,3,-.3]},
  ],
  9:[
    {at:0,pos:[2.5,7.5,20],to:[2.1,7.2,19.5],look:[0,2,0]},
    {at:1.71/(275/30),pos:[1.8,6.4,15.8],to:[1.2,6.1,15.2],look:[0,2.9,0]},
    {at:6.24/(275/30),pos:[.4,5.4,16.2],to:[0,5.1,15.6],look:[0,2,1]},
  ],
  10:[
    {at:0,pos:[5,7.5,21],to:[4.4,7.1,20.3],look:[0,2,0]},
    {at:2.2733333333/(224/30),pos:[1.4,5.1,17.1],to:[.9,4.8,16.5],look:[0,2,2.7]},
    {at:5.9333333333/(224/30),pos:[.4,4.6,16.6],to:[.4,4.6,16.6],look:[0,2,2.9]},
  ],
};
export const CAMERA_CUTS:Record<number,number[]>=Object.fromEntries(Object.entries(CAMERA_TRACKS).map(([id,beats])=>[id,beats.slice(1).map(beat=>beat.at)]));

type Update = (t:number,u:number,camera:T.PerspectiveCamera)=>void;
type ActorOptions = {
  background?: boolean;
  gesture?: boolean;
  expression?: (u: number) => Expr;
  gestureAt?: (u: number) => boolean;
  walk?: { from: [number, number]; to: [number, number]; duration: number };
};
export class Stage {
  root=new T.Group();
  updates:Update[]=[];
  cameraFrom=[6,7,17]; cameraLook=[0,1.7,0];
  background='#b9dce0';
  fog:T.Fog;
  constructor(public id:number) {
    // All neighbourhood beats share daylight. The noise explanation previously
    // jumped to night and back despite no change of time in the narration.
    const hemi=new T.HemisphereLight('#fff6df','#8e8da8',2.1);
    const sun=new T.DirectionalLight('#fff1db',3.1); sun.position.set(-10,18,12);
    this.root.add(hemi,sun);
    if (id===1) this.hook();
    if (id===2) this.buildout();
    if (id===3) this.power();
    if (id===4) this.grid();
    if (id===5) this.water();
    if (id===6) this.noise();
    if (id===7) this.global();
    if (id===8) this.benefits();
    if (id===9) this.meeting();
    if (id===10) this.finale();
    addEnvironment(this);
    this.fog=new T.Fog(this.background,32,100);
  }
  mesh(g:T.BufferGeometry,color:string,p:number[],parent:T.Object3D=this.root,outline=true) {
    const m=new T.Mesh(g,mat(color));m.position.set(p[0],p[1],p[2]);parent.add(m);
    if(outline){ const line=new T.LineSegments(new T.EdgesGeometry(g,30),new T.LineBasicMaterial({color:INK,transparent:true,opacity:.8}));m.add(line); }
    return m;
  }
  box(x:number,y:number,z:number,w:number,h:number,d:number,color:string,parent:T.Object3D=this.root,outline=true){return this.mesh(new T.BoxGeometry(w,h,d),color,[x,y,z],parent,outline);}
  sphere(x:number,y:number,z:number,r:number,color:string,parent:T.Object3D=this.root){return this.mesh(new T.SphereGeometry(r,20,12),color,[x,y,z],parent,false);}
  contactShadow(w:number,d:number,parent:T.Object3D){
    const shadow=new T.Mesh(new T.CircleGeometry(1,32),new T.MeshBasicMaterial({color:'#34495b',transparent:true,opacity:.13,depthWrite:false}));
    shadow.rotation.x=-Math.PI/2;shadow.scale.set(w,d,1);shadow.position.set(.16,.018,.18);parent.add(shadow);
  }
  rod(a:number[],b:number[],r:number,color:string,parent:T.Object3D=this.root){const av=v(...a),bv=v(...b);const m=this.mesh(new T.CylinderGeometry(r,r,av.distanceTo(bv),8),color,av.clone().add(bv).multiplyScalar(.5).toArray(),parent,false);m.quaternion.setFromUnitVectors(v(0,1,0),bv.sub(av).normalize());return m;}
  platform(color=C.grass,r=8){
    // A continuous site grounds the story; no floating diorama edge in the frame.
    const m=this.box(0,-.13,-18,180,.2,180,color,this.root,false);
    if(this.id!==3&&this.id!==9){
      this.box(0,.001,2,2.8,.025,14,'#d6c9b8',this.root,false);
      for(let z=-4;z<9;z+=1.25)this.box(0,.016,z,2.8,.008,.018,'#b8b4a5',this.root,false);
    }
    return m;
  }
  cloud(x:number,y:number,z:number,s=1){const g=new T.Group();g.position.set(x,y,z);for(const [a,b,r] of [[-1,0,.8],[0,.4,1],[1,0,.7],[0,-.1,1]])this.sphere(a*s,b*s,0,r*s,'#fff9e8',g);this.root.add(g);this.updates.push((t)=>g.position.x=x+.12*Math.sin(t*.5+x));return g;}
  tree(x:number,z:number,s=1){this.rod([x,0,z],[x,2*s,z],.13*s,'#947860');this.sphere(x,2.2*s,z,.8*s,'#6c9e81');this.sphere(x-.3*s,1.8*s,z,.55*s,'#8eb58a');}
  house(x:number,z:number,color=C.cream,s=1){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);this.root.add(g);this.contactShadow(1.8,1.45,g);this.box(0,1,0,2.4,2,2,color,g);const roof=this.mesh(new T.ConeGeometry(1.95,1,4),C.coral,[0,2.5,0],g);roof.rotation.y=Math.PI/4;this.box(0,.6,1.02,.55,1.2,.08,C.navy,g);for(const a of [-.78,.78]){this.box(a,1.35,1.04,.47,.55,.08,'#b9dee2',g);this.box(a,1.35,1.1,.035,.55,.02,C.cream,g,false);}return g;}
  factory(x=0,z=-2,s=1){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);this.root.add(g);this.contactShadow(3.65,2.25,g);this.box(0,1.65,0,6,3.3,3.3,'#bbc8c8',g);this.box(0,3.36,0,6.3,.22,3.6,C.navy,g);this.box(0,1.15,1.69,1.25,2.1,.08,C.navy,g);for(let j=0;j<7;j++){this.box(-2.55+j*.85,2.6,1.72,.52,.5,.08,C.blue,g);this.box(-2.7+j*.9,1.6,1.7,.06,2.95,.05,'#869ba8',g,false);}for(const a of [-2,0,2]){this.box(a,3.65,0,1.2,.45,1.15,'#8698a6',g);const fan=this.mesh(new T.CylinderGeometry(.43,.43,.03,16),C.dark,[a,3.89,0],g,false);for(let k=0;k<3;k++){const blade=this.box(0,.035,0,.7,.02,.14,'#a6bec4',fan,false);blade.rotation.y=k*Math.PI/3;}this.updates.push((t)=>fan.rotation.y=t*4);}return g;}
  rack(x:number,z:number,s=1){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);this.root.add(g);this.box(0,1.75,0,1.6,3.5,1.2,C.navy,g);for(let j=0;j<8;j++){this.box(0,.3+j*.4,.63,1.32,.26,.07,'#718b9b',g);const led=this.box(.45,.3+j*.4,.69,.13,.07,.03,'#7af3c8',g,false);this.updates.push((t)=>{led.scale.x=.7+.3*Math.sin(t*4+j);});}return g;}
  actor(x:number,z:number,index=0,expr:Expr='nervous',height=3,options:ActorOptions={}){
    // Keep close-up ink and facial reactions crisp in the 1440px-wide export.
    const canvas=document.createElement('canvas');canvas.width=options.background?240:600;canvas.height=options.background?400:1000;
    const ctx=canvas.getContext('2d')!;const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
    const g=new T.Group();g.position.set(x,0,z);this.root.add(g);
    const mesh=new T.Mesh(new T.PlaneGeometry(height*.6,height),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.DoubleSide,alphaTest:.04}));mesh.position.y=height*.5;g.add(mesh);
    const shadow=new T.Mesh(new T.CircleGeometry(height*.18,24),new T.MeshBasicMaterial({color:'#465268',transparent:true,opacity:.18,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.scale.y=.4;shadow.position.y=.035;g.add(shadow);
    const outfit:Outfit={jacket:[C.teal,C.coral,'#8273af',C.gold][index%4],pants:'#4c5269',boots:INK,hat:'hair',hair:['#523c35','#2d2934','#81533e','#50464a'][index%4],skin:['#f5d4b4','#bd885e','#e8b58d','#835742'][index%4]};
    this.updates.push((t,u,cam)=>{
      const walk=options.walk;
      if(walk){const q=Math.min(1,Math.max(0,t/walk.duration));g.position.set(walk.from[0]+(walk.to[0]-walk.from[0])*q,0,walk.from[1]+(walk.to[1]-walk.from[1])*q);}
      ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/600,canvas.height/1000);
      const currentExpression=options.expression?.(u) ?? expr;
      const gesturing=options.gestureAt?.(u) ?? (options.gesture||(!options.background&&(this.id===7||this.id===9)));
      const blink=((t+index*.6)%3.8)<.13;
      if(walk){
        if(walk.to[0]<walk.from[0]){ctx.translate(600,0);ctx.scale(-1,1);}
        bodySide(new Pen(ctx),outfit,{mode:t<walk.duration?'march':'stand',phase:t*.72+index*.17,stride:.45,stomp:.25,expr:currentExpression,seed:index+16,blink});
      } else {
        bodyFront(new Pen(ctx),outfit,{mode:'stand',expr:currentExpression,seed:index+16,blink,headTilt:(currentExpression==='shock'?5:3)*Math.sin(t*1.7+index),wave:gesturing?.65*Math.sin(t*2.4+index):undefined,look:options.background?0:.13*Math.sin(t*.8+index)});
      }
      ctx.restore();texture.needsUpdate=true;
      const worldPosition=g.getWorldPosition(new T.Vector3());
      g.rotation.y=Math.atan2(cam.position.x-worldPosition.x,cam.position.z-worldPosition.z);
      mesh.position.y=height*.5+(walk?0:.025*Math.sin(t*2+index));
    });
    return g;
  }
  coin(x:number,y:number,z:number,s=.6,parent:T.Object3D=this.root){const c=this.mesh(new T.CylinderGeometry(s,s,.12,24),C.gold,[x,y,z],parent);c.rotation.x=Math.PI/2;const ring=new T.Mesh(new T.TorusGeometry(s*.75,.025,8,24),mat('#b27c32'));c.add(ring);ring.rotation.x=Math.PI/2;ring.position.y=.07;return c;}
  bolt(x:number,y:number,z:number,s=1,parent:T.Object3D=this.root){const sh=new T.Shape();sh.moveTo(.05,.9);sh.lineTo(-.55,-.1);sh.lineTo(-.1,-.1);sh.lineTo(-.3,-.9);sh.lineTo(.6,.2);sh.lineTo(.12,.2);sh.closePath();const m=this.mesh(new T.ExtrudeGeometry(sh,{depth:.13,bevelEnabled:false}),C.gold,[x,y,z],parent);m.scale.setScalar(s);return m;}
  drop(x:number,y:number,z:number,s=1,parent:T.Object3D=this.root){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(s);parent.add(g);this.sphere(0,0,0,.4,'#4fbbd1',g);this.mesh(new T.ConeGeometry(.33,.65,20),'#4fbbd1',[0,.38,0],g,false);return g;}
  phone(x:number,y:number,z:number){const g=new T.Group();g.position.set(x,y,z);this.root.add(g);this.box(0,0,0,.68,1.15,.12,INK,g);this.box(0,0,.075,.55,.91,.02,'#c8f4f0',g,false);for(let k=0;k<3;k++){const app=this.box(-.08+k*.07,.22-k*.22,.095,.31,.12,.02,[C.teal,C.coral,C.blue][k],g,false);this.updates.push(t=>app.scale.x=.82+.18*Math.sin(t*3+k*.9));}const ping=this.sphere(.19,.35,.1,.045,C.gold,g);this.updates.push(t=>ping.scale.setScalar(.8+.2*Math.sin(t*6)));this.cloud(x,y+1.35,z,.22);return g;}
  // Illustrative paths make a relationship visible without suggesting a measured flow rate.
  connection(points:number[][], colour:string, start=0, speed=.65){
    const curve=new T.CatmullRomCurve3(points.map(p=>v(...p)));
    const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(40)),new T.LineBasicMaterial({color:colour,transparent:true,opacity:.35}));
    this.root.add(line);
    for(let i=0;i<4;i++){
      const bead=new T.Mesh(new T.SphereGeometry(.095,8,6),new T.MeshBasicMaterial({color:colour}));
      this.root.add(bead);
      this.updates.push((t,u)=>{bead.visible=u>=start;line.visible=u>=start;bead.position.copy(curve.getPoint((t*speed+i/4)%1));});
    }
  }
  hook(){
    this.background='#b6dce7';this.platform();this.house(-4,-1);this.tree(4,2);
    this.actor(-.4,3.6,0,'neutral',3.4,{expression:u=>u<.287?'grin':u<.842?'shock':'stern',gestureAt:u=>u<.24||u>.842});
    const phone=this.phone(.65,2.3,3.8);phone.scale.setScalar(1.15);
    this.updates.push((t,u)=>{phone.rotation.z=u<.287?.035*Math.sin(t*8):-.08;});
    const f=this.factory(0,-2,1.1);
    this.updates.push((t,u)=>{
      const q=ease((u-.24)/.27);f.visible=q>0;f.scale.setScalar(1.1*Math.max(.001,q));
    });
    this.connection([[.65,3.3,3.8],[2,4.7,1.5],[1.7,3.2,-.3]],'#f5c84b',.51,.42);
    this.cloud(-3,6,-4,.8);this.cameraFrom=[4,6.8,18.5];this.cameraLook=[0,2.3,0];
  }
  buildout(){
    this.background='#b6d7e3';this.platform();this.factory(0,-2);
    for(let i=0;i<3;i++){
      const f=this.factory(-3.7+i*3.7,2.4,.45);
      this.updates.push((t,u)=>{
        const q=ease((u-.14-i*.14)/.16);
        // Uniform growth preserves spacing between roof, fan and trim surfaces.
        f.visible=q>0;f.scale.setScalar(.45*Math.max(.001,q));
      });
    }
    this.actor(-1.7,4.1,2,'shock',3.2,{expression:u=>u<.62?'shock':'nervous',gestureAt:u=>u>.62});
    this.actor(1.1,4.1,1,'stern',2.9,{expression:u=>u<.33?'neutral':'stern',gestureAt:u=>u>.34&&u<.64});
    this.cloud(-3,6,-4,.9);this.cameraFrom=[3,8.8,22];this.cameraLook=[0,1.8,0];
  }
  power(){
    this.background='#9bbfce';this.platform('#9ab8bd',6);
    for(const [x,z] of [[-2,0],[0,-1],[2,-2]])this.rack(x,z,.85);
    for(let i=0;i<8;i++){
      const b=this.bolt(-3+(i%4)*2,4+Math.floor(i/4)*1.5,0,.6);
      this.updates.push((t,u)=>{
        const q=i<4?1:ease((u-.63-(i-4)*.025)/.095);
        b.visible=q>0;b.scale.setScalar(.6*Math.max(.001,q));
        b.position.y=4+Math.floor(i/4)*1.5+.07*Math.sin(t*2+i);
      });
    }
    this.connection([[-2,3.5,.7],[-1,4,1],[1.2,3,1.5]],'#77e3cf',0,.9);
    this.actor(1.5,3,0,'nervous',2.8,{expression:u=>u<.63?'neutral':'shock',gestureAt:u=>u>.63});
    this.cameraFrom=[4,7.3,19.5];this.cameraLook=[0,3.2,0];
  }
  pylon(x:number,z:number){for(const a of [-1,1])this.rod([x+a*.8,0,z],[x+a*.25,5,z],.09,C.navy);for(let j=0;j<4;j++){this.rod([x-.75+j*.1,j*1.2,z],[x+.65-j*.1,(j+1)*1.2,z],.05,C.navy);this.rod([x+.75-j*.1,j*1.2,z],[x-.65+j*.1,(j+1)*1.2,z],.05,C.navy);}this.box(x,4.2,z,2.8,.15,.2,C.navy);}
  grid(){
    this.platform();this.house(-3,1);this.factory(2,-2,.7);this.pylon(-2,-2);this.pylon(3,2);
    for(const dx of [-.8,.8])this.rod([-2+dx,4.3,-2],[3+dx,4.3,2],.025,INK);
    this.connection([[-2,4.35,-2],[.5,4.35,0],[3,4.35,2]],'#f2c858',.1,.45);
    this.actor(0,4,1,'nervous',3,{expression:u=>u<.564?'nervous':'stern',gestureAt:u=>u>.564});
    for(let i=0;i<4;i++){
      const c=this.coin(-1.1+i*.7,3.5,4,.35);
      this.updates.push((t,u)=>{const q=ease((u-.564-i*.035)/.09);c.visible=q>0;c.scale.setScalar(Math.max(.001,q));c.position.y=3.5+.08*Math.sin(t*2+i);});
    }
    this.cameraFrom=[7.4,7.5,20];this.cameraLook=[0,2.1,0];
  }
  water(){
    this.background='#dbc9ad';this.platform('#c8b78d');this.factory(2,-2,.7);
    this.mesh(new T.CylinderGeometry(1.3,1.3,2.7,32),'#4f92ab',[-2,1.35,0]);
    this.mesh(new T.CylinderGeometry(1.34,1.34,.15,32),C.navy,[-2,2.8,0]);
    this.rod([-2,1,0],[2,1,0],.18,C.blue);this.rod([2,1,0],[2,1,-2],.18,C.blue);
    for(let i=0;i<4;i++){
      const d=this.drop(-3.5+i*1.3,4.2,-.5,.7);
      this.updates.push((t,u)=>{const q=ease((u-.21-i*.025)/.08);d.visible=q>0;d.scale.setScalar(.7*Math.max(.001,q));d.position.y=4.2+.1*Math.sin(t*1.7+i);});
    }
    this.connection([[-2,1,.23],[0,1,.23],[2,1,.23],[2,1,-1.3]],'#72dff0',.233,.55);
    this.actor(0,3.7,2,'nervous',3.2,{expression:u=>u<.6?'neutral':'nervous',gestureAt:u=>u>.6});
    this.house(-4,-3,C.cream,.75);this.cameraFrom=[5,7,20];this.cameraLook=[0,2.2,0];
  }
  noise(){
    this.background='#b9dce0';this.platform();this.house(-2,1,'#9e9db9',1.3);this.factory(2,-3,.9);
    this.actor(-1,4,2,'stern',3.3,{expression:u=>u<.193?'neutral':u<.595?'shock':'stern',gestureAt:u=>u>.595});
    for(let i=0;i<3;i++){
      const m=new T.Mesh(new T.TorusGeometry(1+i*.45,.065,8,36,Math.PI*.8),new T.MeshBasicMaterial({color:'#eb8951',transparent:true,depthWrite:false}));
      m.position.set(1,2.6,1.5);m.rotation.z=-Math.PI*.4;this.root.add(m);
      this.updates.push((t,u)=>{const phase=(t*.55+i*.3)%1;m.visible=u>.193;m.scale.setScalar(.65+phase*.8);m.material.opacity=.65*(1-phase);});
    }
    this.cameraFrom=[3,6.5,21];this.cameraLook=[0,2,0];
  }
  global(){
    this.background='#a5cbd9';this.platform('#abbca8');this.factory(0,-3,.65);this.house(-4,-1,C.coral,.8);this.house(4,-1,C.cream,.8);
    for(let i=0;i<6;i++)this.actor((i%3-1)*2.1,1+Math.floor(i/3)*2.2,i,'stern',2.8,{expression:u=>u<.459?'nervous':'stern',gestureAt:u=>u>.459+(i%3)*.055});
    this.cloud(-3,6,-4,.8);this.cloud(3,6.5,-5,.7);this.cameraFrom=[4,7.4,20];this.cameraLook=[0,2,0];
  }
  benefits(){
    this.background='#b8dcd5';this.platform();this.factory(0,-2,.85);
    for(let i=0;i<4;i++){
      const c=this.coin(-2.4+i*1.6,4.5,-1,.5);
      this.updates.push((t,u)=>{const q=ease((u-.545-i*.03)/.1);c.visible=q>0;c.scale.setScalar(Math.max(.001,q));c.rotation.z=.12*Math.sin(t+i);c.position.y=4.5+.1*Math.sin(t*2+i);});
    }
    this.actor(-1.4,3,3,'grin',3.2,{expression:u=>u<.3?'neutral':'grin',gestureAt:u=>u>.3&&u<.55});
    this.actor(1.4,3,0,'neutral',3.2,{expression:u=>u<.7?'neutral':'grin',gestureAt:u=>u>.72});
    const phone=this.phone(2.9,2.1,3);phone.scale.setScalar(1.2);
    this.connection([[2.9,3.1,3],[3.7,4.2,.5],[1.7,3.4,-1]],'#56d4cb',.301,.55);
    this.tree(-4,2);this.cameraFrom=[3,6.5,20];this.cameraLook=[0,2.2,0];
  }
  meeting(){
    this.background='#dfd9cb';this.platform('#bec5b3',6);
    this.mesh(new T.CylinderGeometry(2.05,2.05,.2,40),'#a66e45',[0,1.6,0]);this.rod([0,0,0],[0,1.6,0],.5,C.navy);
    this.box(0,1.72,0,2.1,.02,1.6,'#d6e9e9');const model=this.factory(.3,-.1,.24);model.position.y=1.74;
    this.actor(-2.5,1.6,0,'neutral',3.3,{expression:u=>u<.68?'stern':'neutral',gestureAt:u=>u>.68});
    this.actor(2.5,1.6,1,'neutral',3.3,{expression:u=>u<.4?'nervous':'neutral',gestureAt:u=>u>.4&&u<.68});
    this.actor(-1.3,-2.4,2,'grin',3.2,{gestureAt:u=>u>.2&&u<.4});
    const soundIcon=new T.Group();soundIcon.position.set(.75,4,0);this.root.add(soundIcon);
    for(let i=0;i<3;i++){
      const arc=new T.Mesh(new T.TorusGeometry(.2+i*.17,.04,6,20,Math.PI*.8),new T.MeshBasicMaterial({color:C.coral}));
      arc.rotation.z=-Math.PI*.4;soundIcon.add(arc);
    }
    const icons=[this.bolt(-2,4,0,.55),this.drop(-.75,4,0,.6),soundIcon,this.coin(2,4,0,.4)];
    const starts=[.187,.187,.398,.538],scales=[.55,.6,1,1];
    icons.forEach((icon,i)=>this.updates.push((t,u)=>{
      const q=ease((u-starts[i])/.085);icon.visible=q>0;
      icon.scale.setScalar(scales[i]*Math.max(.001,q));
      icon.position.y=4-.65*ease((u-.68)/.14);
    }));
    // Lines visibly connect the proposed safeguards to the shared model; no approval checkmarks.
    this.connection([[-1.5,3.5,0],[-.9,2.7,.3],[0,2.6,0]],'#e9b54d',.68,.5);
    this.connection([[1.5,3.5,0],[.9,2.7,.3],[0,2.6,0]],'#58b8ba',.68,.5);
    this.cameraFrom=[2.5,7.5,20];this.cameraLook=[0,2,0];
  }
  finale(){
    this.background='#e9c9a2';this.platform('#99b27c');this.factory(0,-3,.7);this.house(-3.6,0);this.house(3.6,0,'#cfab8f');
    for(let i=0;i<4;i++)this.actor(-2.4+i*1.6,3.4,i,'neutral',3,{expression:u=>u<.304?'neutral':i%2?'stern':'grin',gestureAt:u=>u>.795+(i%2)*.025});
    for(const x of [-5,5])this.tree(x,2,1.2);this.cloud(-3,6,-5,.8);this.cloud(3,6,-5,.6);
    this.cameraFrom=[5,7.5,21];this.cameraLook=[0,2,0];
  }
  update(t:number,u:number,camera:T.PerspectiveCamera){
    const track=CAMERA_TRACKS[this.id];
    let beatIndex=0;for(let i=1;i<track.length;i++)if(u>=track[i].at)beatIndex=i;
    const beat=track[beatIndex];
    const end=track[beatIndex+1]?.at??1;
    const q=ease((u-beat.at)/Math.max(.001,end-beat.at));
    const position=v(...beat.pos).lerp(v(...beat.to),q);
    const target=v(...beat.look);
    camera.position.copy(position);camera.lookAt(target);camera.updateMatrixWorld();
    for(const update of this.updates)update(t,u,camera);
  }
  dispose(){this.root.traverse((o)=>{if(o instanceof T.Mesh||o instanceof T.Line){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){if('map' in m && m.map instanceof T.Texture)m.map.dispose();m.dispose();}}});}
}
