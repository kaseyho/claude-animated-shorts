import * as T from 'three';
import { Pen, bodyFront, bodySide, Outfit, Expr } from '../../../templates/bridge/toon';
import { addEnvironment } from './environment';

const INK = '#252940';
const C = { teal:'#429b9c', navy:'#384861', blue:'#5489ae', coral:'#dc805e', cream:'#f4ddac', grass:'#99b887', dark:'#34354b', gold:'#edbe59' };
const v = (x=0,y=0,z=0) => new T.Vector3(x,y,z);
const ease = (t:number) => { t=Math.max(0,Math.min(1,t)); return t*t*(3-2*t); };
const mat = (color:string) => new T.MeshLambertMaterial({color});

type Update = (t:number,u:number,camera:T.PerspectiveCamera)=>void;
type ActorOptions = {
  background?: boolean;
  gesture?: boolean;
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
    const canvas=document.createElement('canvas');canvas.width=options.background?180:360;canvas.height=options.background?300:600;
    const ctx=canvas.getContext('2d')!;const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
    const g=new T.Group();g.position.set(x,0,z);this.root.add(g);
    const mesh=new T.Mesh(new T.PlaneGeometry(height*.6,height),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.DoubleSide,alphaTest:.04}));mesh.position.y=height*.5;g.add(mesh);
    const shadow=new T.Mesh(new T.CircleGeometry(height*.18,24),new T.MeshBasicMaterial({color:'#465268',transparent:true,opacity:.18,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.scale.y=.4;shadow.position.y=.035;g.add(shadow);
    const outfit:Outfit={jacket:[C.teal,C.coral,'#8273af',C.gold][index%4],pants:'#4c5269',boots:INK,hat:'hair',hair:['#523c35','#2d2934','#81533e','#50464a'][index%4],skin:['#f5d4b4','#bd885e','#e8b58d','#835742'][index%4]};
    this.updates.push((t,u,cam)=>{
      const walk=options.walk;
      if(walk){const q=Math.min(1,Math.max(0,t/walk.duration));g.position.set(walk.from[0]+(walk.to[0]-walk.from[0])*q,0,walk.from[1]+(walk.to[1]-walk.from[1])*q);}
      ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/600,canvas.height/1000);
      const blink=((t+index*.6)%3.8)<.13;
      if(walk){
        if(walk.to[0]<walk.from[0]){ctx.translate(600,0);ctx.scale(-1,1);}
        bodySide(new Pen(ctx),outfit,{mode:t<walk.duration?'march':'stand',phase:t*.72+index*.17,stride:.45,stomp:.25,expr,seed:index+16,blink});
      } else {
        bodyFront(new Pen(ctx),outfit,{mode:'stand',expr,seed:index+16,blink,headTilt:2*Math.sin(t*1.7+index),wave:options.gesture||(!options.background&&(this.id===7||this.id===9))?.14*Math.sin(t*2+index):undefined});
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
  phone(x:number,y:number,z:number){const g=new T.Group();g.position.set(x,y,z);this.root.add(g);this.box(0,0,0,.68,1.15,.12,INK,g);this.box(0,0,.075,.55,.91,.02,'#c8f4f0',g,false);for(let k=0;k<3;k++){this.box(-.08+k*.07,.22-k*.22,.095,.31,.12,.02,[C.teal,C.coral,C.blue][k],g,false);}this.cloud(x,y+1.35,z,.22);return g;}
  hook(){this.background='#c4e2e6';this.platform();this.house(-4,-1);this.tree(4,2);this.actor(-.4,3.6,0,'neutral',3.4);this.phone(.65,2.3,3.8);const f=this.factory(0,-2,1.1);this.updates.push((t)=>{const q=ease((t-3.6)/1);f.position.y=-4.5*(1-q);});this.cloud(-3,6,-4,.8);this.cameraFrom=[4,5.2,18];this.cameraLook=[0,2,0];}
  buildout(){
    this.background='#c3dfe5';this.platform();this.factory(0,-2);
    for(let i=0;i<3;i++){
      const f=this.factory(-3.7+i*3.7,2.4,.45);
      this.updates.push((t)=>{
        const q=ease((t-.5-i*.65)/.7);
        // Hide waiting buildings and grow the whole model. Squashing only Y
        // collapsed roof/fan faces into the same depth and caused white flicker.
        f.visible=q>0;
        f.scale.setScalar(.45*Math.max(.001,q));
      });
    }
    this.actor(-1.7,4.1,2,'shock',3.2);this.actor(1.1,4.1,1,'stern',2.9);this.cloud(-3,6,-4,.9);this.cameraFrom=[3,10,25];this.cameraLook=[0,1.8,0];
  }
  power(){this.background='#adcbd9';this.platform('#b3c8ca',6);for(const [x,z] of [[-2,0],[0,-1],[2,-2]])this.rack(x,z,.85);for(let i=0;i<8;i++){const b=this.bolt(-3+(i%4)*2,4+Math.floor(i/4)*1.5,0,.6);this.updates.push((t,u)=>{const q=i<4?1:ease((u-.43)*4);b.scale.setScalar(.6*q);b.position.y=4+Math.floor(i/4)*1.5+.12*Math.sin(t*2+i);});}this.actor(1.5,3,0,'shock',2.8);this.cameraFrom=[8,7,19];this.cameraLook=[0,2.6,0];}
  pylon(x:number,z:number){for(const a of [-1,1])this.rod([x+a*.8,0,z],[x+a*.25,5,z],.09,C.navy);for(let j=0;j<4;j++){this.rod([x-.75+j*.1,j*1.2,z],[x+.65-j*.1,(j+1)*1.2,z],.05,C.navy);this.rod([x+.75-j*.1,j*1.2,z],[x-.65+j*.1,(j+1)*1.2,z],.05,C.navy);}this.box(x,4.2,z,2.8,.15,.2,C.navy);}
  grid(){this.platform();this.house(-3,1);this.factory(2,-2,.7);this.pylon(-2,-2);this.pylon(3,2);for(const dx of [-.8,.8])this.rod([-2+dx,4.3,-2],[3+dx,4.3,2],.025,INK);this.actor(0,4,1,'nervous',3);for(let i=0;i<4;i++){const c=this.coin(-1.1+i*.7,3.5,4,.35);this.updates.push((t)=>{c.position.y=3.5+.13*Math.sin(t*2+i);c.rotation.z=t*.3;});}this.cameraFrom=[10,10,23];this.cameraLook=[0,2.1,0];}
  water(){this.background='#e7d4bb';this.platform('#d7c3a1');this.factory(2,-2,.7);const tank=this.mesh(new T.CylinderGeometry(1.3,1.3,2.7,32),'#88afba',[-2,1.35,0]);this.mesh(new T.CylinderGeometry(1.34,1.34,.15,32),C.navy,[-2,2.8,0]);this.rod([-2,1,0],[2,1,0],.18,C.blue);this.rod([2,1,0],[2,1,-2],.18,C.blue);for(let i=0;i<4;i++){const d=this.drop(-3.5+i*1.3,4.2,-.5,.7);this.updates.push((t)=>d.position.y=4.2+.18*Math.sin(t*1.7+i));}for(let i=0;i<3;i++){const pulse=this.sphere(0,1,.2,.11,'#b8eff4');this.updates.push((t)=>{pulse.position.x=-2+((t*.6+i/3)%1)*4;});}this.actor(0,3.7,2,'nervous',3.2);this.house(-4,-3,C.cream,.75);this.cameraFrom=[5,7,21];this.cameraLook=[0,2.2,0];}
  noise(){this.background='#b9dce0';this.platform();this.house(-2,1,'#b8b7ce',1.3);this.factory(2,-3,.9);this.actor(-1,4,2,'stern',3.3);for(let i=0;i<3;i++){const m=new T.Mesh(new T.TorusGeometry(1+i*.5,.065,8,36,Math.PI*.8),mat('#df9365'));m.position.set(1,2.6,1.5);m.rotation.z=-Math.PI*.4;this.root.add(m);this.updates.push((t)=>{m.scale.setScalar(.8+((t*.5+i*.3)%1)*.6);(m.material as T.Material).transparent=true;(m.material as T.MeshLambertMaterial).opacity=.25+.55*(1-((t*.5+i*.3)%1));});}this.cameraFrom=[3,6.5,22];this.cameraLook=[0,2,0];}
  global(){this.background='#adcbd6';this.platform('#c3c5ad');this.factory(0,-3,.65);this.house(-4,-1,C.coral,.8);this.house(4,-1,C.cream,.8);for(let i=0;i<6;i++)this.actor((i%3-1)*2.1,1+Math.floor(i/3)*2.2,i,'stern',2.8);this.cloud(-3,6,-4,.8);this.cloud(3,6.5,-5,.7);this.cameraFrom=[4,8,21];this.cameraLook=[0,2,0];}
  benefits(){this.background='#c9dfdb';this.platform();this.factory(0,-2,.85);for(let i=0;i<4;i++){const c=this.coin(-2.4+i*1.6,4.5,-1,.5);this.updates.push((t)=>{c.rotation.z=.12*Math.sin(t+i);c.position.y=4.5+.15*Math.sin(t*2+i);});}this.actor(-1.4,3,3,'grin',3.2);this.actor(1.4,3,0,'neutral',3.2);this.phone(2.9,2.1,3);this.tree(-4,2);this.cameraFrom=[3,6.5,21];this.cameraLook=[0,2.2,0];}
  meeting(){this.background='#dfd9cb';this.platform('#c9c8b5',6);const table=this.mesh(new T.CylinderGeometry(2.05,2.05,.2,40),'#b98963',[0,1.6,0]);this.rod([0,0,0],[0,1.6,0],.5,C.navy);this.box(0,1.72,0,2.1,.02,1.6,'#d6e9e9');const model=this.factory(.3,-.1,.24);model.position.y=1.74;this.actor(-2.5,1.6,0,'neutral',3.3);this.actor(2.5,1.6,1,'neutral',3.3);this.actor(-1.3,-2.4,2,'grin',3.2);this.bolt(-1.5,4,0,.65);this.drop(0,4,0,.7);this.coin(1.5,4,0,.45);this.cameraFrom=[2.5,8,21];this.cameraLook=[0,2,0];}
  finale(){this.background='#edcfad';this.platform('#a9bc92');this.factory(0,-3,.7);this.house(-3.6,0);this.house(3.6,0,'#d8bba5');for(let i=0;i<4;i++)this.actor(-2.4+i*1.6,3.4,i,i%2?'neutral':'grin',3);for(const x of [-5,5])this.tree(x,2,1.2);this.cloud(-3,6,-5,.8);this.cloud(3,6,-5,.6);this.cameraFrom=[5,7.5,22];this.cameraLook=[0,2,0];}
  update(t:number,u:number,camera:T.PerspectiveCamera){
    const [x,y,z]=this.cameraFrom;
    const position=v(x-1.3*u,y+.25*Math.sin(u*Math.PI),z-1.8*u);
    const target=v(...this.cameraLook);
    if(this.id===1){const k=ease((t-3.4)/1.25);position.lerpVectors(v(1.2,3.6,10.5-t*.12),position,k);target.lerpVectors(v(.1,2.1,3.3),target,k);}
    if(this.id===10){const k=ease((u-.35)/.65);position.lerp(v(1.4,4.9,15.5),k);target.lerp(v(0,1.8,2.5),k);}
    camera.position.copy(position);camera.lookAt(target);camera.updateMatrixWorld();
    for(const update of this.updates)update(t,u,camera);
  }
  dispose(){this.root.traverse((o)=>{if(o instanceof T.Mesh||o instanceof T.LineSegments){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){if('map' in m && m.map instanceof T.Texture)m.map.dispose();m.dispose();}}});}
}
