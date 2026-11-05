import * as T from 'three';
import type { Stage } from './world';

// Original procedural environments. The central story props stay dominant;
// detail decreases with distance and movement is deterministic render time.
const PALETTE = ['#c5b9a3', '#aebfc1', '#b8b0ba', '#cbb59d', '#a7b8a3', '#bcc6c8'];
const trim = '#657e89';

function sky(s: Stage) {
  const horizon = new T.Color(s.background).lerp(new T.Color('#fff7e9'), .17);
  const zenith = new T.Color(s.background).multiplyScalar(.84);
  const material = new T.ShaderMaterial({
    uniforms: { horizon: { value: horizon }, zenith: { value: zenith } },
    vertexShader: 'varying vec3 direction; void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `uniform vec3 horizon; uniform vec3 zenith; varying vec3 direction;
      void main(){
        float h=normalize(direction).y;
        gl_FragColor=vec4(mix(horizon,zenith,smoothstep(-0.04,0.82,h)),1.0);
        #include <colorspace_fragment>
      }`,
    side: T.BackSide, depthWrite: false, fog: false,
  });
  const dome = new T.Mesh(new T.SphereGeometry(120, 24, 12), material);
  s.root.add(dome);
}

function pane(s: Stage, x: number, y: number, z: number, w: number, h: number, parent: T.Object3D, night: boolean) {
  const glass = s.box(x, y, z, w, h, .04, night ? '#e4c890' : '#7698a7', parent, false);
  if (night) {
    glass.material.emissive.set('#e7c891'); glass.material.emissiveIntensity = .35;
  }
  return glass;
}

function building(s: Stage, x: number, z: number, w: number, d: number, h: number, index: number, level = 1, night = false) {
  const group = new T.Group();
  group.position.set(x, 0, z); s.root.add(group);
  const base = new T.Color(PALETTE[index % PALETTE.length]);
  if (level === 2) base.lerp(new T.Color(s.background), .4);
  s.box(0, h / 2, 0, w, h, d, `#${base.getHexString()}`, group, false);
  s.box(0, h + .08, 0, w + .18, .16, d + .18, level === 2 ? '#8fa8ac' : trim, group, false);
  const columns = level === 2 ? 2 : 3;
  const floors = level === 2 ? 2 : Math.max(1, Math.floor(h / 1.6));
  for (let floor = 0; floor < floors; floor++) {
    for (let col = 0; col < columns; col++) {
      pane(s, (col - (columns - 1) / 2) * w / (columns + .5), .9 + floor * 1.45, d / 2 + .035,
        w / (columns + 2.1), .62, group, night && (col + floor + index) % 3 !== 0);
    }
  }
  if (level === 1) {
    s.box(-w * .27, .65, d / 2 + .05, .65, 1.3, .07, trim, group, false);
    // Side windows keep the oblique cameras from seeing blank building walls.
    for (let floor = 0; floor < floors; floor++) {
      for (const along of [-.24, .24]) s.box(w / 2 + .025, .95 + floor * 1.45, d * along, .04, .62, d * .25, '#829fa8', group, false);
    }
    if (index % 3 === 0) {
      s.box(0, h + .33, -.3, w * .35, .5, d * .35, '#91a3a9', group, false);
    } else if (index % 3 === 1) {
      const roof = s.mesh(new T.ConeGeometry(w * .8, .8, 4), '#a28c7c', [0, h + .45, 0], group, false);
      roof.rotation.y = Math.PI / 4; roof.scale.z = d / w;
    }
  }
  return group;
}

function tree(s: Stage, x: number, z: number, scale = 1, muted = false) {
  s.rod([x, 0, z], [x, 2.4 * scale, z], .1 * scale, '#897c67');
  const canopy = s.mesh(new T.IcosahedronGeometry(1, 1), muted ? '#91aaa0' : '#7c9d80', [x, 2.5 * scale, z], s.root, false);
  canopy.scale.set(scale * .8, scale * 1.15, scale * .8);
  return canopy;
}

function fence(s: Stage, x: number, z: number, width: number, height = 1.25) {
  for (let i = 0; i <= Math.floor(width / 1.2); i++) s.rod([x - width / 2 + i * 1.2, 0, z], [x - width / 2 + i * 1.2, height, z], .045, '#6c8188');
  for (const y of [.32, height - .12]) s.rod([x - width / 2, y, z], [x + width / 2, y, z], .035, '#819397');
}

function lamp(s: Stage, x: number, z: number, night: boolean) {
  s.rod([x, 0, z], [x, 3.7, z], .055, '#71868d');
  s.rod([x, 3.7, z], [x + .65, 3.7, z], .055, '#71868d');
  const light = s.box(x + .62, 3.62, z, .6, .14, .4, night ? '#ffdc9a' : '#bdc6bc', s.root, false);
  if (night) {
    light.material.emissive.set('#ffdc9a'); light.material.emissiveIntensity = .5;
    const pool = new T.Mesh(new T.CircleGeometry(1.25, 24), new T.MeshBasicMaterial({ color: '#f2d2a0', transparent: true, opacity: .11, depthWrite: false }));
    pool.position.set(x + .4, .044, z); pool.rotation.x = -Math.PI / 2; s.root.add(pool);
  }
}

function bench(s: Stage, x: number, z: number) {
  for (const dx of [-.7, .7]) {
    s.box(x + dx, .3, z, .13, .6, .65, '#71828a', s.root, false);
    s.box(x + dx, .8, z - .3, .1, 1.1, .12, '#71828a', s.root, false);
  }
  for (const dz of [-.21, 0, .21]) s.box(x, .65, z + dz, 2, .1, .18, '#b1987e', s.root, false);
  for (const y of [.9, 1.18]) s.box(x, y, z - .3, 2, .18, .1, '#b1987e', s.root, false);
}

function car(s: Stage, x: number, z: number, colour = '#7895a2', moving = true) {
  const g = new T.Group(); g.position.set(x, 0, z); s.root.add(g);
  s.box(0, .58, 0, 2.5, .55, 1.18, colour, g, false);
  s.box(-.15, 1.04, 0, 1.35, .58, 1.06, colour, g, false);
  for (const a of [-.45, .2]) s.box(a, 1.09, .55, .5, .35, .04, '#bdd3d5', g, false);
  s.box(1.25, .65, .35, .05, .18, .22, '#eee6ba', g, false);
  const wheels: T.Mesh[] = [];
  for (const a of [-.75, .75]) for (const b of [-.6, .6]) {
    const wheel = s.mesh(new T.CylinderGeometry(.32, .32, .16, 12), '#4d5962', [a, .31, b], g, false);
    wheel.rotation.x = Math.PI / 2; wheels.push(wheel);
  }
  if (moving) s.updates.push(t => { g.position.x = x + Math.min(t, 8) * .58; for (const wheel of wheels) wheel.rotation.y = -t * 1.8; });
  return g;
}

function resident(s: Stage, x: number, z: number, index: number, walking = false, gesture = false) {
  return s.actor(x, z, index, 'neutral', 2.6, {
    background: true, gesture,
    ...(walking ? { walk: { from: [x, z] as [number, number], to: [x + 3.6, z] as [number, number], duration: 8 } } : {}),
  });
}

function street(s: Stage, night: boolean) {
  // The lane runs behind the hero area, not across the main actors' feet.
  s.box(-3, .015, -6.2, 55, .035, 3.1, night ? '#65717d' : '#899294', s.root, false);
  for (const z of [-4.44, -7.96]) {
    s.box(-3, .035, z, 55, .12, .65, '#c3c6ba', s.root, false);
    s.box(-3, .025, z + (z < -6 ? -.7 : .7), 55, .07, .7, '#b7b9ab', s.root, false);
  }
  for (let x = -28; x < 23; x += 3) s.box(x, .042, -6.2, 1.3, .015, .07, '#d9d3b8', s.root, false);
  // A foreground cross-street anchors the lower frame and connects the footpath.
  // Keep traffic in the rear lane so it cannot cross the close-up residents.
  s.box(0,.012,10.4,70,.03,3.6,night?'#52636e':'#899294',s.root,false);
  s.box(0,.025,8.35,70,.08,.5,'#c3c6ba',s.root,false);
  for(let x=-32;x<33;x+=3)s.box(x,.035,10.4,1.3,.015,.07,'#d9d3b8',s.root,false);
  for(let z=9.1;z<12;z+=.55)s.box(0,.037,z,2.5,.018,.26,'#dedccc',s.root,false);
  // Side path and corner gardens give the lower frame context without covering faces.
  for (const x of [-6.4, 6.4]) {
    s.box(x, .018, 2.4, 1.6, .03, 13.6, '#c7c7b5', s.root, false);
    for (const z of [.7, 3.6, 6.5]) {
      s.box(x + (x < 0 ? -.9 : .9), .15, z, .65, .35, 1.2, '#91aa87', s.root, false);
    }
  }
  // Place two low corner planters by their projected positions. The diagonal
  // grid camera needs a different world-space right edge from the town shots.
  const view = new T.PerspectiveCamera(38, 1080 / 1920, .1, 150);
  view.position.set(s.cameraFrom[0] - .65, s.cameraFrom[1] + .25, s.cameraFrom[2] - .9);
  view.lookAt(...s.cameraLook as [number, number, number]); view.updateMatrixWorld();
  for (const screenX of [-.82, .82]) {
    if (s.id === 8 && screenX < 0) continue; // The bench frames this corner.
    let lo = -20, hi = 20;
    for (let step = 0; step < 24; step++) {
      const mid = (lo + hi) / 2;
      if (new T.Vector3(mid, .45, 7).project(view).x < screenX) lo = mid; else hi = mid;
    }
    const x = (lo + hi) / 2;
    s.box(x, .24, 7, .85, .48, .85, night ? '#73858a' : '#99a397', s.root, false);
    s.box(x, .49, 7, .94, .1, .94, '#b6bbaa', s.root, false);
    const shrub = s.mesh(new T.IcosahedronGeometry(.5, 1), night ? '#738b81' : '#7c9e80', [x, .78, 7], s.root, false);
    shrub.scale.set(1, .7, 1);
  }
}

function neighbourhood(s: Stage, night = false) {
  street(s, night);
  const offset = s.id === 4 ? -4 : -1.5;
  // Front row: six distinct, moderately detailed buildings.
  for (let i = 0; i < 6; i++) {
    const x = offset - 13 + i * 4.7;
    building(s, x, -10.1 - (i % 2) * .7, 3.3 + (i % 2) * .6, 3.2, 2.8 + (i % 3) * .5, i, 1, night);
  }
  // Second row has varied apartment heights, spaced behind the first row.
  for (let i = 0; i < 8; i++) building(s, offset - 19 + i * 5.2, -17.5 - (i % 2) * 1.3, 3.5 + (i % 3) * .45, 3.7, 4 + (i % 3) * 1.1, i + 5, 1, night);
  // The distant band is inexpensive and deliberately softer/simpler.
  for (let i = 0; i < 12; i++) building(s, offset - 32 + i * 5.2, -30 - (i % 3) * 2, 4.1, 4.5, 4.4 + (i % 4) * 1.3, i + 13, 2, night);
  for (const [x, z, size] of [[-9,-3.5,1.1],[7,-4,1],[-11,-11,1.2],[3,-12,1],[-8,-19,1.3],[8,-20,1.1]]) tree(s, x + offset, z, size, true);
  for (const x of [-10, 6]) lamp(s, x, -4.4, night);
  bench(s, -6.7, -2.2);
  // These passers-by occupy the rear pavement or outer side paths.
  resident(s, -6.7, -3.8, 10, true);
  resident(s, -4.9, -8.3, 11);
  resident(s, 4.8, -3.7, 12);
  resident(s, -10.7, -8.4, 13);
  if (s.id !== 2) car(s, -6.8, -6.25, night ? '#7f8793' : '#7397a4', true);
}

function construction(s: Stage) {
  fence(s, -7.3, -3.6, 6, 1.15);
  // An open frame and scaffold tell the construction story without extra labels.
  for (const x of [-8, -5.2, -2.4]) for (const z of [-6, -8.8]) s.box(x, 2.5, z, .22, 5, .22, '#8f9da3', s.root, false);
  for (const y of [2.3, 4.9]) {
    s.box(-5.2, y, -7.4, 6.2, .22, 3.1, '#aaa99c', s.root, false);
    for (const x of [-8, -5.2, -2.4]) s.rod([x, 0, -6], [x, y, -8.8], .045, '#849194');
  }
  for (let i = 0; i < 5; i++) s.box(-6.3 + (i % 2) * .85, .23 + Math.floor(i / 2) * .4, .2, .75, .35, 1.5, '#b9aa91', s.root, false);
  // Left-side crane: the large visual stays outside the central speaking area.
  for (const dx of [-.3, .3]) s.rod([-7 + dx, 0, -10], [-7 + dx, 10, -10], .09, '#c6ac75');
  for (let y = .8; y < 9.5; y += .8) s.rod([-7.3, y, -10], [-6.7, y + .65, -10], .055, '#ad956c');
  s.box(-3.9, 10, -10, 8.3, .35, .45, '#bca46d', s.root, false);
  const cable = s.rod([-1.7, 9.9, -10], [-1.7, 5.8, -10], .025, '#727d80');
  const load = s.box(-1.7, 5.55, -10, 1.6, .45, .8, '#a6a7a0', s.root, false);
  s.updates.push(t => {
    const lift = .4 * Math.sin(t * .35);
    load.position.y = 5.55 + lift;
    cable.scale.y = 1 - lift / 4.1; cable.position.y = 7.85 + lift / 2;
  });
  resident(s, -5.8, .6, 16, false, true);
  resident(s, -9.8, -1, 17);
  car(s, 5.8, -6.3, '#baa37a', false);
}

function serverHall(s: Stage) {
  s.box(-4, -.005, -8, 34, .03, 60, '#a5b6b9', s.root, false);
  s.box(-5, 5, -13, 30, 10, .35, '#aebdc4', s.root, false);
  s.box(-16, 5, -5, .3, 10, 16, '#91a6b4', s.root, false);
  for (let x = -18; x <= 8; x += 3) {
    s.box(x, .018, -8, .025, .012, 60, '#c2ced0', s.root, false);
    s.box(x, 5, -12.78, .1, 10, .07, '#96acb6', s.root, false);
  }
  for (let z = -36; z <= 21; z += 2.4) s.box(-4, .018, z, 34, .012, .025, '#c2ced0', s.root, false);
  for (const z of [-4.7, -8, -11]) {
    for (const x of [-10, -7.4, -4.8, -2.2, .4]) {
      s.box(x, 1.7, z, 1.5, 3.4, 1.2, '#5b7384', s.root, false);
      for (let row = 0; row < 6; row++) {
        s.box(x, .45 + row * .45, z + .63, 1.22, .27, .04, '#91a6b0', s.root, false);
        s.box(x + .42, .45 + row * .45, z + .66, .08, .05, .025, '#a5d2bf', s.root, false);
      }
    }
  }
  for (const x of [-11, -6]) {
    s.box(x, 7.5, -6.2, .7, .18, 13, '#8b9da8', s.root, false);
    for (const z of [-10, -6, -2]) s.rod([x, 7.5, z], [x, 9.5, z], .035, '#9daeb6');
  }
  for (const x of [-10, -3, 4]) s.box(x, 8.8, -12.7, 3.6, .2, .12, '#e3e9df', s.root, false);
  s.box(-8.5, .025, 2, 1.4, .03, 12, '#b7c4c6', s.root, false);
  resident(s, -5.2, -5.5, 18, false, true);
  resident(s, -10.5, -1, 19, true);
}

function coolingYard(s: Stage) {
  fence(s, -4.2, -5.9, 3.4, 1.1);
  for (const x of [-4.8, -3.3]) {
    s.mesh(new T.CylinderGeometry(.55, .55, 2.4, 14), '#9fb4b8', [x, 1.2, -5.1], s.root, false);
    s.mesh(new T.CylinderGeometry(.6, .6, .15, 14), '#708e9d', [x, 2.45, -5.1], s.root, false);
  }
  // A low, visible service manifold sits to the right of the main resident.
  s.box(3.1, .1, 4.8, 2, .2, 1.1, '#aaa99b', s.root, false);
  for (const x of [2.55, 3.45]) {
    s.rod([x, .2, 4.8], [x, 1.1, 4.8], .11, '#7898a3');
    s.rod([x, 1.1, 4.8], [x, 1.1, 3.5], .11, '#7898a3');
    const wheel = s.mesh(new T.TorusGeometry(.23, .04, 6, 14), '#ba8467', [x, 1.14, 5.02], s.root, false);
    s.rod([x, 1.14, 4.8], [x, 1.14, 5.02], .045, '#708b96');
    s.rod([x - .18, 1.14, 5.02], [x + .18, 1.14, 5.02], .025, '#ba8467');
    s.rod([x, .96, 5.02], [x, 1.32, 5.02], .025, '#ba8467');
  }
  s.rod([2.55, .45, 4.8], [3.45, .45, 4.8], .11, '#7898a3');
  resident(s, 2.4, 2.7, 20, false, true);
}

function substation(s: Stage) {
  fence(s, -4.4, -5.2, 4.1, 1.05);
  for (const [x, z] of [[-5.2, -4.4], [-3.5, -4.4], [4.4, 4.5]]) {
    s.box(x, .65, z, 1.25, 1.3, 1.1, '#93a2aa', s.root, false);
    for (let i = 0; i < 5; i++) s.box(x - .46 + i * .23, .65, z + .58, .07, 1, .1, '#748b96', s.root, false);
    for (const dx of [-.34, .34]) s.mesh(new T.CylinderGeometry(.09, .12, .4, 8), '#b2c1b8', [x + dx, 1.5, z], s.root, false);
  }
  resident(s, -3.5, -2.9, 21, false, true);
}

function shops(s: Stage) {
  for (const [x, z, colour] of [[-3.65, -1.3, '#8aaca4'], [3.65, -2, '#bd997e']] as const) {
    building(s, x, z, 2.1, 2.1, 3.2, x < 0 ? 0 : 2);
    s.box(x, 1.2, z + 1.1, 1.75, 1.7, .06, '#a8c8c6', s.root, false);
    const awning = s.box(x, 2.3, z + 1.35, 2.5, .16, .8, colour, s.root, false);
    awning.rotation.x = .12;
    for (let k = 0; k < 5; k++) s.box(x - 1 + k * .5, 2.28, z + 1.4, .22, .17, .82, '#d9d8c3', s.root, false);
  }
  bench(s, -1.5, 6.8);
  resident(s, -3.3, .8, 22);
  resident(s, 3.5, .5, 23);
}

function meetingRoom(s: Stage) {
  s.box(0, -.006, -1.5, 25, .035, 22, '#b8b8a9', s.root, false);
  for (let x = -12; x <= 12; x += 2) s.box(x, .018, -1.5, .018, .012, 22, '#a8aaa1', s.root, false);
  for (let z = -11; z <= 9; z += 2) s.box(0, .018, z, 25, .012, .018, '#a8aaa1', s.root, false);
  // An open-front civic room: the rear wall and windows locate the meeting.
  s.box(-1.5, 3.8, -5.5, 22, 7.6, .25, '#b5c2c2', s.root, false);
  s.box(-12, 3.8, -1.8, .25, 7.6, 7.6, '#a3b5b8', s.root, false);
  for (const x of [-8.4, -3.5, 1.4, 6.3]) {
    s.box(x, 4.5, -5.33, 3.6, 3.8, .07, '#7899a8', s.root, false);
    s.box(x, 4.5, -5.27, 3.3, 3.5, .07, '#c2dbdd', s.root, false);
    for (const dx of [-.8, .8]) s.box(x + dx, 3.65, -5.2, .9, 1.7 + (dx < 0 ? .4 : 0), .05, '#a5babc', s.root, false);
    s.box(x, 4.5, -5.12, .08, 3.8, .08, '#8ca3aa', s.root, false);
    s.box(x, 4.5, -5.1, 3.6, .08, .1, '#8ca3aa', s.root, false);
  }
  s.box(-1.5, .55, -5.32, 22, .12, .1, '#8b9fa4', s.root, false);
  for (const x of [-4.9, -3.5, 3.5, 4.9]) {
    s.box(x, .7, -3.6, .82, .15, .85, '#8b9e9f', s.root, false);
    s.box(x, 1.3, -4, .82, 1.1, .12, '#91a7a8', s.root, false);
    for (const dx of [-.3, .3]) s.rod([x + dx, 0, -3.5], [x + dx, .65, -3.5], .035, '#667f88');
  }
  resident(s, -4.7, -1.7, 24);
  resident(s, -3.3, -1.7, 25);
  resident(s, 3.4, -1.7, 26);
  resident(s, 4.8, -1.7, 27, false, true);
  // A quiet side table and papers add functional detail without new claims.
  s.box(-8, 1.4, -.6, 3, .18, 1.2, '#a58e75', s.root, false);
  for (const x of [-9.1, -6.9]) s.rod([x, 0, -.6], [x, 1.3, -.6], .08, '#7b8d91');
  for (let i = 0; i < 3; i++) s.box(-8.7 + i * .7, 1.53, -.5, .5, .05, .7, '#e4dfcc', s.root, false);
  tree(s, -9.3, -3.5, .85, true);
}

export function addEnvironment(s: Stage) {
  sky(s);
  if (s.id === 3) { serverHall(s); return; }
  if (s.id === 9) { meetingRoom(s); return; }
  neighbourhood(s);
  if (s.id === 2) construction(s);
  if (s.id === 4) substation(s);
  if (s.id === 5) coolingYard(s);
  if (s.id === 8) shops(s);
  if (s.id === 6) {
    fence(s, 3, -1.1, 4.2, 1.1);
    lamp(s, -4.8, 2, false);
    resident(s, -3.7, 2.5, 28);
  }
  if (s.id === 7) {
    for (const [x, z, index] of [[-4.1, 2.4, 29], [4.2, 2.8, 30], [-3.8, -1.2, 31], [3.6, -1.5, 32]]) resident(s, x, z, index, false, index === 29);
    fence(s, -6.8, .4, 2.5, .9);
    bench(s, 6.5, .4);
  }
  if (s.id === 10) {
    resident(s, -5.3, .8, 33, false, true);
    resident(s, 5.3, 1, 34);
  }
}
