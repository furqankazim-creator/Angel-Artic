import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { T } from '../ui';
import { useStore } from '../store';
import { colors, soft } from '../theme';

/**
 * Side-view (cross-section) animation of the mouth, like the diagrams speech therapists use.
 * The jaw swings on its hinge, the tongue changes shape point by point, the soft palate lifts or
 * lowers, air flows along a route, and a ring marks where the sound is made.
 */

type Pt = [number, number];
type Route = 'oral' | 'nasal' | 'none';

interface Pose {
  jaw: number; // degrees the lower jaw opens
  tongue: number[]; // y of 7 points on the top of the tongue, back to front
  tipX: number; // x of the tongue tip
  lipOut: number; // how far both lips push forward
  lowerLip: number; // extra raise of the lower lip
  velum: number; // y of the soft palate tip (112 sealed, 152 open to the nose)
}

interface Spec {
  voice: boolean;
  air: boolean;
  route: Route;
  stop?: boolean; // air is held, then released with a pop
  pose: Pose;
  mark: { x: number; y: number; label: string };
  steps: string[];
}

const REST: Pose = { jaw: 5, tongue: [174, 168, 164, 164, 166, 170, 174], tipX: 230, lipOut: 0, lowerLip: 0, velum: 112 };
const P = (o: Partial<Pose>): Pose => ({ ...REST, ...o });

export const MOUTH: Record<string, Spec> = {
  p: { voice: false, air: true, route: 'oral', stop: true, pose: P({ jaw: 0, lowerLip: -5 }), mark: { x: 268, y: 130, label: 'Lips together' }, steps: ['Close your lips', 'Pop them open with a puff of air'] },
  b: { voice: true, air: false, route: 'oral', stop: true, pose: P({ jaw: 0, lowerLip: -5 }), mark: { x: 268, y: 130, label: 'Lips together' }, steps: ['Close your lips', 'Voice on, pop them open'] },
  m: { voice: true, air: false, route: 'nasal', pose: P({ jaw: 0, lowerLip: -5, velum: 152 }), mark: { x: 268, y: 130, label: 'Lips together' }, steps: ['Close your lips', 'Hum through your nose'] },
  t: { voice: false, air: true, route: 'oral', stop: true, pose: P({ jaw: 6, tongue: [176, 164, 142, 122, 108, 102, 102], tipX: 228 }), mark: { x: 226, y: 100, label: 'Tongue tip taps the bumpy ridge' }, steps: ['Tongue tip up behind top teeth', 'Tap down with a puff of air'] },
  d: { voice: true, air: false, route: 'oral', stop: true, pose: P({ jaw: 6, tongue: [176, 164, 142, 122, 108, 102, 102], tipX: 228 }), mark: { x: 226, y: 100, label: 'Tongue tip taps the bumpy ridge' }, steps: ['Tongue tip up behind top teeth', 'Tap down, voice on'] },
  n: { voice: true, air: false, route: 'nasal', pose: P({ jaw: 6, tongue: [176, 164, 142, 122, 108, 102, 102], tipX: 228, velum: 152 }), mark: { x: 226, y: 100, label: 'Tongue tip on the ridge' }, steps: ['Tongue tip up behind top teeth', 'Hum through your nose'] },
  k: { voice: false, air: true, route: 'oral', stop: true, pose: P({ jaw: 9, tongue: [166, 126, 98, 100, 132, 160, 172], tipX: 222 }), mark: { x: 134, y: 98, label: 'Back of tongue touches the soft roof' }, steps: ['Back of tongue lifts to the roof', 'Drop it with a puff of air'] },
  g: { voice: true, air: false, route: 'oral', stop: true, pose: P({ jaw: 9, tongue: [166, 126, 98, 100, 132, 160, 172], tipX: 222 }), mark: { x: 134, y: 98, label: 'Back of tongue touches the soft roof' }, steps: ['Back of tongue lifts to the roof', 'Drop it, voice on'] },
  f: { voice: false, air: true, route: 'oral', pose: P({ jaw: 4, lowerLip: -16 }), mark: { x: 252, y: 132, label: 'Top teeth on bottom lip' }, steps: ['Top teeth rest on bottom lip', 'Blow air out'] },
  v: { voice: true, air: true, route: 'oral', pose: P({ jaw: 4, lowerLip: -16 }), mark: { x: 252, y: 132, label: 'Top teeth on bottom lip' }, steps: ['Top teeth rest on bottom lip', 'Buzz your voice'] },
  s: { voice: false, air: true, route: 'oral', pose: P({ jaw: 2, tongue: [174, 162, 142, 124, 112, 116, 130], tipX: 224 }), mark: { x: 222, y: 112, label: 'Tiny gap: air hisses through' }, steps: ['Teeth close together', 'Tongue behind them, hiss'] },
  z: { voice: true, air: true, route: 'oral', pose: P({ jaw: 2, tongue: [174, 162, 142, 124, 112, 116, 130], tipX: 224 }), mark: { x: 222, y: 112, label: 'Tiny gap: air buzzes through' }, steps: ['Teeth close together', 'Tongue behind them, buzz'] },
  r: { voice: true, air: false, route: 'oral', pose: P({ jaw: 7, lipOut: 5, tongue: [174, 152, 124, 112, 122, 136, 146], tipX: 214 }), mark: { x: 196, y: 120, label: 'Tongue bunches up, touches nothing' }, steps: ['Lips round a little', 'Tongue bunched back, growl'] },
  l: { voice: true, air: false, route: 'oral', pose: P({ jaw: 7, tongue: [176, 170, 156, 138, 118, 106, 102], tipX: 228 }), mark: { x: 226, y: 100, label: 'Tongue tip on the ridge' }, steps: ['Tongue tip touches behind top teeth', 'Let your voice sing'] },
  sh: { voice: false, air: true, route: 'oral', pose: P({ jaw: 4, lipOut: 9, tongue: [174, 158, 134, 116, 112, 126, 142], tipX: 214 }), mark: { x: 206, y: 112, label: 'Lips pushed out, air hushes through' }, steps: ['Push your lips out', 'Teeth close, say shhh'] },
  ch: { voice: false, air: true, route: 'oral', stop: true, pose: P({ jaw: 4, lipOut: 8, tongue: [174, 160, 138, 118, 108, 112, 124], tipX: 220 }), mark: { x: 220, y: 106, label: 'Tongue taps, then slides to shhh' }, steps: ['Tongue taps like /t/', 'Slide into shhh'] },
  th: { voice: false, air: true, route: 'oral', pose: P({ jaw: 5, tongue: [174, 168, 160, 154, 150, 146, 142], tipX: 254 }), mark: { x: 250, y: 134, label: 'Tongue tip peeks between teeth' }, steps: ['Tongue tip between your teeth', 'Blow softly'] },
  h: { voice: false, air: true, route: 'oral', pose: P({ jaw: 8 }), mark: { x: 138, y: 160, label: 'A warm breath from the throat' }, steps: ['Open your mouth a little', 'Breathe out a warm breath'] },
  w: { voice: true, air: false, route: 'oral', pose: P({ jaw: 5, lipOut: 10, tongue: [172, 140, 112, 118, 142, 160, 172], tipX: 220 }), mark: { x: 270, y: 128, label: 'Lips round, back of tongue up' }, steps: ['Round your lips', 'Open them as your voice starts'] },
  y: { voice: true, air: false, route: 'oral', pose: P({ jaw: 4, tongue: [176, 160, 134, 108, 104, 122, 150], tipX: 222 }), mark: { x: 188, y: 104, label: 'Middle of the tongue lifts near the roof' }, steps: ['Smile and lift the middle of your tongue', 'Let your voice slide'] },
  ng: { voice: true, air: false, route: 'nasal', pose: P({ jaw: 9, tongue: [166, 126, 98, 100, 132, 160, 172], tipX: 222, velum: 152 }), mark: { x: 134, y: 98, label: 'Back of tongue touches the soft roof' }, steps: ['Back of tongue lifts to the soft roof', 'Hum through your nose'] },
  j: { voice: true, air: true, route: 'oral', stop: true, pose: P({ jaw: 4, lipOut: 5, tongue: [174, 160, 138, 118, 108, 112, 124], tipX: 220 }), mark: { x: 220, y: 106, label: 'Tongue taps, then buzzes' }, steps: ['Tongue taps like /d/', 'Slide into a buzzy shh'] },
  st: { voice: false, air: true, route: 'oral', stop: true, pose: P({ jaw: 2, tongue: [174, 162, 142, 124, 112, 116, 130], tipX: 224 }), mark: { x: 222, y: 108, label: 'Hiss, then tap' }, steps: ['Hiss like a snake: sss', 'Tap your tongue up: t'] },
  zh: { voice: true, air: true, route: 'oral', pose: P({ jaw: 4, lipOut: 9, tongue: [174, 158, 134, 116, 112, 126, 142], tipX: 214 }), mark: { x: 206, y: 112, label: 'Lips out, air buzzes through' }, steps: ['Push your lips out', 'Teeth close, buzz zhh'] },
  dh: { voice: true, air: true, route: 'oral', pose: P({ jaw: 5, tongue: [174, 168, 160, 154, 150, 146, 142], tipX: 254 }), mark: { x: 250, y: 134, label: 'Tongue tip peeks between teeth' }, steps: ['Tongue tip between your teeth', 'Buzz your voice'] },
};

const ROUTES: Record<Exclude<Route, 'none'>, Pt[]> = {
  oral: [[98, 186], [130, 150], [186, 132], [236, 132], [292, 134]],
  nasal: [[98, 186], [108, 130], [124, 84], [190, 64], [270, 70], [304, 98]],
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const mixPose = (to: Pose, t: number): Pose => ({
  jaw: lerp(REST.jaw, to.jaw, t),
  tongue: REST.tongue.map((y, i) => lerp(y, to.tongue[i], t)),
  tipX: lerp(REST.tipX, to.tipX, t),
  lipOut: lerp(REST.lipOut, to.lipOut, t),
  lowerLip: lerp(REST.lowerLip, to.lowerLip, t),
  velum: lerp(REST.velum, to.velum, t),
});

const TX = [98, 124, 152, 180, 204, 222];
function tonguePath(p: Pose) {
  const pts: Pt[] = [...TX.map((x, i) => [x, p.tongue[i]] as Pt), [p.tipX, p.tongue[6]]];
  // Catmull-Rom to cubic Bezier for a smooth tongue surface.
  let d = `M ${pts[0][0]} 232 L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  const tip = pts[pts.length - 1];
  d += ` C ${tip[0] + 3} ${tip[1] + 8}, ${tip[0] - 4} ${tip[1] + 20}, ${tip[0] - 16} ${tip[1] + 30} L ${tip[0] - 30} 232 Z`;
  return d;
}

function along(route: Pt[], u: number): Pt {
  const lens = route.slice(1).map((p, i) => Math.hypot(p[0] - route[i][0], p[1] - route[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = u * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) { const k = d / lens[i]; return [lerp(route[i][0], route[i + 1][0], k), lerp(route[i][1], route[i + 1][1], k)]; }
    d -= lens[i];
  }
  return route[route.length - 1];
}

const CYCLE = 4200;
const SKIN = '#FFD9B8';
const SKIN_EDGE = '#E9B592';
const ROSE = '#F7A7B6';
const CAVITY = '#C95B78';
const TONGUE = '#FF7B93';
const LIP = '#F0668A';

export function MouthAnim({ soundId, still }: { soundId: string; still?: boolean }) {
  const { s } = useStore();
  const spec = MOUTH[soundId] ?? MOUTH.s;
  const freeze = still || s.settings.calm;
  const [clock, setClock] = useState(freeze ? 1500 : 0);

  useEffect(() => {
    if (freeze) { setClock(1500); return; }
    let raf = 0;
    const t0 = Date.now();
    const loop = () => { setClock((Date.now() - t0) % CYCLE); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [soundId, freeze]);

  // Timeline: 0-800 move in, 800-2800 hold, 2800-3500 move out, then rest.
  let a = 0;
  let airOn = false;
  if (clock < 800) a = ease(clock / 800);
  else if (clock < 2800) { a = 1; airOn = true; }
  else if (clock < 3500) a = 1 - ease((clock - 2800) / 700);
  if (spec.stop) {
    // Hold with no air, then a quick release that lets the air burst out.
    if (clock >= 800 && clock < 1900) airOn = false;
    if (clock >= 1900 && clock < 2150) { a = 1 - ease((clock - 1900) / 250) * 0.8; airOn = true; }
    if (clock >= 2150 && clock < 2800) { a = 0.2; airOn = true; }
  }
  if (freeze) { a = 1; airOn = true; }

  const pose = mixPose(spec.pose, a);
  const pulse = 0.5 + 0.5 * Math.sin(clock / 130);
  const flow = (clock % 900) / 900;
  const route = spec.route === 'none' ? null : ROUTES[spec.route];
  const jaw = pose.jaw;
  const lipX = pose.lipOut;
  const showMark = a > 0.85 || freeze;

  return (
    <View style={{ alignItems: 'center', gap: 10 }}>
      <View style={{ width: 300, height: 280, borderRadius: 24, backgroundColor: '#FFF1D6', overflow: 'hidden' }}>
        <Svg width={300} height={280} viewBox="40 0 280 280">
          <Defs>
            <LinearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#FF93A8" /><Stop offset="1" stopColor={TONGUE} /></LinearGradient>
            <LinearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor="#B24A68" /><Stop offset="1" stopColor={CAVITY} /></LinearGradient>
            <ClipPath id="head"><Path d="M 70 262 L 70 60 C 90 14, 210 2, 262 40 C 272 50, 274 62, 280 72 C 292 84, 312 98, 308 106 C 304 112, 292 112, 284 114 L 270 118 L 262 176 C 268 192, 262 222, 240 232 L 205 272 Z" /></ClipPath>
          </Defs>

          {/* head, neck and nose */}
          <Path d="M 70 280 L 70 60 C 90 14, 210 2, 262 40 C 272 50, 274 62, 280 72 C 292 84, 312 98, 308 106 C 304 112, 292 112, 284 114 L 270 118 L 262 176 C 268 192, 262 222, 240 232 L 205 280 Z" fill={SKIN} stroke={SKIN_EDGE} strokeWidth={2} />
          {/* nasal cavity */}
          <Path d="M 238 98 C 270 92, 298 100, 296 106 C 270 108, 244 106, 238 104 C 200 82, 160 70, 126 82 C 112 90, 112 98, 124 100 C 170 84, 210 92, 238 104 Z" fill="#FFE3EA" />
          {/* mouth + throat cavity */}
          <Path d="M 250 106 C 210 92, 160 90, 128 98 L 98 112 L 92 250 L 238 250 L 252 150 Z" fill="url(#cg)" />
          {/* hard palate (roof) */}
          <Path d="M 252 100 C 212 84, 160 82, 128 92 L 128 100 C 160 94, 212 96, 250 112 Z" fill={ROSE} />
          {/* tongue */}
          <Path d={tonguePath(pose)} fill="url(#tg)" />
          {/* soft palate (velum) */}
          <Path d={`M 132 94 C 120 96, 106 102, 100 ${pose.velum - 6} C 98 ${pose.velum + 4}, 108 ${pose.velum + 8}, 114 ${pose.velum} C 122 108, 130 104, 140 100 Z`} fill={ROSE} />
          {/* throat back wall */}
          <Path d="M 92 112 L 88 250" stroke="#A8415E" strokeWidth={4} />

          {/* lower jaw swings on its hinge */}
          <G transform={`rotate(${jaw} 118 146)`}>
            <Path d="M 112 204 L 226 204 L 232 166 L 246 152 L 262 150 L 266 186 C 262 214, 240 226, 214 262 L 120 280 L 108 280 Z" fill={SKIN} stroke={SKIN_EDGE} strokeWidth={2} />
            <Rect x={232} y={138} width={13} height={34} rx={4} fill="#fff" stroke="#E6DDEB" strokeWidth={1.5} />
            <G transform={`translate(${lipX * 0.6} ${pose.lowerLip - 4})`}>
              <Path d="M 238 134 C 258 126, 280 132, 282 148 C 282 166, 262 172, 242 162 Z" fill={LIP} />
            </G>
          </G>
          {/* upper teeth and upper lip */}
          <Rect x={232} y={98} width={13} height={36} rx={4} fill="#fff" stroke="#E6DDEB" strokeWidth={1.5} />
          <Path d={`M 246 96 C ${268 + lipX} 92, ${286 + lipX} 104, ${280 + lipX} 124 C ${272 + lipX} 134, ${254 + lipX} 134, 242 128 Z`} fill={LIP} />

          {/* voice box */}
          <G>
            <Circle cx={93} cy={196} r={9} fill={spec.voice ? '#FFC93C' : '#EAD9C9'} />
            {spec.voice && [0, 1, 2].map((i) => (
              <Circle key={i} cx={93} cy={196} r={11 + i * 7 + pulse * 3} fill="none" stroke="#FFC93C" strokeWidth={2} opacity={0.75 - i * 0.2} />
            ))}
          </G>

          {/* air */}
          {airOn && route && spec.air && [0, 1, 2, 3, 4].map((i) => {
            const u = (flow + i / 5) % 1;
            const [x, y] = along(route, u);
            return <Circle key={i} cx={x} cy={y} r={5 - u * 2} fill="#4D96FF" opacity={Math.sin(Math.PI * u) * 0.9} />;
          })}
          {airOn && route && !spec.air && spec.route === 'nasal' && [0, 1, 2].map((i) => {
            const [x, y] = along(route, (flow + i / 3) % 1);
            return <Circle key={i} cx={x} cy={y} r={4} fill="#FFC93C" opacity={0.7} />;
          })}

          {/* where the sound is made */}
          {showMark && (
            <G>
              <Circle cx={spec.mark.x} cy={spec.mark.y} r={11 + pulse * 5} fill="none" stroke="#06D6A0" strokeWidth={3.5} />
              <Circle cx={spec.mark.x} cy={spec.mark.y} r={3} fill="#06D6A0" />
            </G>
          )}

        </Svg>
        <View style={{ position: 'absolute', left: 10, bottom: 8, right: 10, alignItems: 'center' }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
            <T k="caption" style={{ textAlign: 'center' }}>🟢 {spec.mark.label}</T>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ backgroundColor: spec.voice ? soft.sunny : soft.sky, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
          <T k="caption">{spec.voice ? '🟡 Voice ON (feel your throat buzz)' : '🤫 Voice OFF'}</T>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ backgroundColor: soft.sky, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
          <T k="caption">{spec.route === 'nasal' ? '👃 Air goes out the nose' : spec.air ? '💨 Air goes out the mouth' : '🔇 Little air'}</T>
        </View>
      </View>
      {spec.steps.map((st, i) => (
        <T key={i} k="bodyBold" color={colors.ink}>{i + 1}. {st}</T>
      ))}
    </View>
  );
}
