"""Rebuild original narration, original synthesized score and mix. No paid APIs.
Run from repo root: .venv/bin/python production/data-centres/build_audio.py
Dependencies: edge-tts, numpy, scipy; ffmpeg and ffprobe on PATH.
"""
import asyncio
import hashlib
import json
import math
import subprocess
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile
import edge_tts

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = ROOT / 'public/data-centres'
OUT.mkdir(parents=True, exist_ok=True)
SR, FPS, TOTAL = 48000, 30, 65.0
VOICE = 'en-GB-RyanNeural'
TEXTS = [
'The cloud has a neighbour problem. Online, it feels weightless. On your street, it can look like this.',
'Data centres power our digital lives. But the race to build more, especially for AI, is meeting resistance.',
'The International Energy Agency expects their global electricity demand to roughly double from twenty twenty-five to twenty thirty.',
'For neighbours, the question is closer to home. Can the grid cope? And who pays for new power lines?',
'Cooling can need water, too. How much depends on the technology and location. In dry regions, that matters.',
'Some neighbours also worry about noise from cooling equipment and backup generators.',
'From Mexico to South Africa, communities have demanded clearer answers about water, electricity, and what gets built beside them.',
'Supporters point to investment, tax revenue, and useful digital services. But promised benefits do not settle every local concern.',
'A better bargain means transparent resource use, noise controls, fair infrastructure costs, and residents involved before construction starts.',
'People are asking a simple question. If the future is moving into our neighbourhood, do we get a say?',
]

def run(*args):
    return subprocess.run(list(map(str, args)), check=True, capture_output=True, text=True)

def write(path, data):
    wavfile.write(path, SR, (np.clip(data, -1, 1) * 32767).astype(np.int16))

async def narrate(i, text, sem):
    key = hashlib.sha256((VOICE + '+12%' + text).encode()).hexdigest()[:12]
    mp3 = HERE / f'voice_{i:02}_{key}.mp3'
    meta = mp3.with_suffix('.json')
    if not mp3.exists() or not meta.exists():
        async with sem:
            boundaries = []
            try:
                with mp3.open('wb') as f:
                    async for event in edge_tts.Communicate(text, VOICE, rate='+12%', boundary='WordBoundary').stream():
                        if event['type'] == 'audio': f.write(event['data'])
                        elif event['type'] == 'WordBoundary': boundaries.append(event)
                meta.write_text(json.dumps(boundaries))
            except Exception:
                mp3.unlink(missing_ok=True)
                raise
    pcm = HERE / f'voice_{i:02}_raw.wav'
    run('ffmpeg', '-y', '-v', 'error', '-i', mp3, '-ar', SR, '-ac', '1', pcm)
    sr, samples = wavfile.read(pcm)
    return pcm, samples.astype(np.float64) / 32768, json.loads(meta.read_text())

async def main():
    locked = json.loads((HERE/'timeline.json').read_text()) if (HERE/'timeline.json').exists() else None
    takes = await asyncio.gather(*(narrate(i+1, t, asyncio_sem) for i,t in enumerate(TEXTS)))
    raw_duration = sum(len(t[1]) / SR for t in takes)
    gap, lead, tail = .20, .12, .88
    factor = raw_duration / (TOTAL - gap*9 - lead-tail)
    print(f'Raw narration {raw_duration:.3f}s; tempo factor {factor:.5f}', flush=True)
    voice = np.zeros(round(TOTAL*SR))
    cursor = round(lead*SR)
    scenes, words = [], []
    for i, ((pcm, raw_samples, boundaries), text) in enumerate(zip(takes, TEXTS)):
        local_factor = (len(raw_samples)/SR) / locked['segments'][i]['voiceDuration'] if locked else factor
        adjusted = HERE / f'voice_{i+1:02}.wav'
        run('ffmpeg', '-y', '-v', 'error', '-i', pcm, '-af', f'atempo={local_factor:.8f}', '-ar', SR, '-ac', '1', adjusted)
        _, s = wavfile.read(adjusted)
        s = s.astype(np.float64) / 32768
        if locked:
            cursor = round(locked['segments'][i]['voiceStart']*SR)
            expected = round(locked['segments'][i]['voiceDuration']*SR)
            s = np.pad(s,(0,max(0,expected-len(s))))[:expected]
        voice[cursor:cursor+len(s)] += s
        start = cursor / SR
        scenes.append({'id':i+1, 'voiceStart':start, 'voiceDuration':len(s)/SR, 'text':text})
        for word in boundaries:
            words.append({'word':word['text'], 's':start + word['offset']/1e7/local_factor, 'e':start+(word['offset']+word['duration'])/1e7/local_factor})
        cursor += len(s) + round(gap*SR)
    # Boundaries fall in the pause before the next narration, frame aligned.
    cuts = [0] + [round((s['voiceStart']-gap/2)*FPS) for s in scenes[1:]] + [round(TOTAL*FPS)]
    for i, s in enumerate(scenes):
        s.update(start=cuts[i]/FPS,duration=(cuts[i+1]-cuts[i])/FPS,a=cuts[i],b=cuts[i+1])
    timeline = {'fps':FPS,'totalDuration':TOTAL,'durationInFrames':round(TOTAL*FPS),'voice':VOICE,'tempoFactor':factor,'segments':scenes}
    (HERE/'timeline.json').write_text(json.dumps(timeline,indent=2))
    (HERE/'words.json').write_text(json.dumps(words,indent=2))
    voice *= .72 / max(.01,np.max(np.abs(voice)))
    write(OUT/'voice.wav',np.column_stack([voice,voice]))
    print(json.dumps(timeline,indent=2),flush=True)

    # An original restrained electronic score: F minor, 104 BPM, plucked mallets,
    # soft pad, sine bass and a sparse brushed pulse. All synthesized locally.
    rng = np.random.default_rng(46251)
    N = len(voice)
    music = np.zeros((N,2))
    sfx = np.zeros((N,2))
    beat = 60/104
    def add(buffer, x, time, gain=1, pan=0):
        a = round(time*SR)
        if a >= N: return
        if a < 0: x=x[-a:]; a=0
        b=min(N,a+len(x)); x=x[:b-a]*gain
        buffer[a:b,0]+=x*math.sqrt((1-pan)/2)
        buffer[a:b,1]+=x*math.sqrt((1+pan)/2)
    def note(midi,dur,kind='pluck'):
        t=np.arange(round(dur*SR))/SR
        hz=440*2**((midi-69)/12)
        if kind=='pluck':
            x=(np.sin(2*np.pi*hz*t)+.23*np.sin(2*np.pi*2*hz*t)+.07*np.sin(2*np.pi*3*hz*t))*np.exp(-t*4.5)
            x*=np.minimum(1,t/.008)
        elif kind=='bass':
            x=(np.sin(2*np.pi*hz*t)+.15*np.sin(2*np.pi*hz*2*t))*np.minimum(1,t/.03)*np.minimum(1,(dur-t)/.12)
        else:
            x=(np.sin(2*np.pi*hz*t)+.3*np.sin(2*np.pi*hz*1.002*t))*np.minimum(1,t/.25)*np.minimum(1,(dur-t)/.5)
        return x
    chords = [[53,56,60],[49,53,56],[51,55,58],[48,51,55]]
    melody_degrees = [0,2,4,2, 1,4,2,1, 0,3,5,3, 2,1,4,2]
    scale=[65,67,68,70,72,73,75]
    bars=math.ceil(TOTAL/(4*beat))
    for bar in range(bars):
        t=bar*4*beat
        chord=chords[bar%4]
        # Thin the score under the noise and resource concerns, then resolve.
        section=.7 if 19<t<45 else 1
        for k,n in enumerate(chord):
            add(music,note(n,4*beat+.2,'pad'),t,.017*section,(k-1)*.45)
        for q in [0,2]:
            add(music,note(chord[0]-12,beat*1.3,'bass'),t+q*beat,.065*section)
        for k in range(4):
            degree=melody_degrees[(bar*4+k)%16]
            add(music,note(scale[degree],.75),t+(k+.5)*beat,.037*section,(-1 if k%2 else 1)*.25)
        for k in [0,2]:
            tt=np.arange(round(.13*SR))/SR
            kick=np.sin(2*np.pi*(52*tt+7*(1-np.exp(-tt*35))))*np.exp(-tt*32)
            add(music,kick,t+k*beat,.055*section)
        for k in [1,3]:
            tt=np.arange(round(.07*SR))/SR
            noise=rng.normal(size=len(tt)); noise=signal.lfilter([1,-1],[1],noise)
            add(music,noise*np.exp(-tt*70),t+k*beat,.006*section,.15)
    # Quiet cut accents and illustrative resource sounds, below narration.
    for s in scenes:
        tt=np.arange(round(.17*SR))/SR
        swoosh=signal.lfilter([.03]*12,[1],rng.normal(size=len(tt)))*np.sin(np.pi*tt/.17)**2
        add(sfx,swoosh,s['start'],.14,-.25)
    water_t=scenes[4]['start']+1
    for i in range(5):
        tt=np.arange(round(.15*SR))/SR
        drip=np.sin(2*np.pi*(1100*tt-1800*tt**2))*np.exp(-tt*35)
        add(sfx,drip,water_t+i*.43,.035,.35)
    noise_s=scenes[5]
    tt=np.arange(round(noise_s['duration']*SR))/SR
    fan=(np.sin(2*np.pi*96*tt)+.5*np.sin(2*np.pi*192*tt))*.009
    fan*=np.minimum(1,tt/.4)*np.minimum(1,(len(tt)/SR-tt)/.5)
    add(sfx,fan,noise_s['start'],1)
    env=signal.lfilter([1/2400]*2400,[1],voice**2)
    duck=np.clip(1-np.sqrt(env)*5,.35,1)
    music*=duck[:,None]*10**(3/20) # documented +3 dB music adjustment
    sfx*=10**(-6/20) # documented -6 dB effects adjustment
    fade=np.minimum(1,np.arange(N)/SR/.6)*np.minimum(1,(N-np.arange(N))/SR/1.1)
    music*=fade[:,None]; sfx*=fade[:,None]
    premix=np.column_stack([voice,voice])+music+sfx
    write(HERE/'music.wav',music)
    write(HERE/'sfx.wav',sfx)
    write(HERE/'premix.wav',premix)
    result=run('ffmpeg','-hide_banner','-i',HERE/'premix.wav','-af','loudnorm=I=-16:TP=-1.2:LRA=8:print_format=json','-f','null','-')
    data=json.JSONDecoder().raw_decode(result.stderr[result.stderr.rfind('{'):])[0]
    filt=f"loudnorm=I=-16:TP=-1.2:LRA=8:measured_I={data['input_i']}:measured_TP={data['input_tp']}:measured_LRA={data['input_lra']}:measured_thresh={data['input_thresh']}:offset={data['target_offset']}:linear=true:print_format=json"
    mastered=run('ffmpeg','-y','-hide_banner','-i',HERE/'premix.wav','-af',filt,'-ar',SR,'-c:a','pcm_s24le',OUT/'mix.wav')
    (HERE/'audio-report.json').write_text(json.dumps({'normalizationAnalysis':data,'masteringLog':mastered.stderr,'seed':46251,'bpm':104,'music':'original synthesized F minor score','voice':VOICE},indent=2))
    run('ffmpeg', '-y', '-v', 'error', '-i', OUT/'mix.wav', '-c:a', 'libmp3lame', '-q:a', '2', OUT/'mix.mp3')
    print('Audio complete:',OUT/'mix.wav',flush=True)

asyncio_sem = asyncio.Semaphore(3)
if __name__ == '__main__': asyncio.run(main())
