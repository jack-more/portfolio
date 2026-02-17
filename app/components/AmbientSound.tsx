'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    // Create master gain node
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Create wind/breath-like blowing sound using filtered noise
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate pink-ish noise (softer than white noise)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    // Create noise source
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Bandpass filter to shape wind sound
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 800;
    bandpass.Q.value = 0.5;

    // Lowpass for smoothness
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 2000;
    lowpass.Q.value = 0.7;

    // Highpass to remove rumble
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 200;
    highpass.Q.value = 0.5;

    // Gain for noise
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.35;

    // Connect noise chain
    noise.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start();

    // Add subtle LFO modulation for natural wind variation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // Very slow modulation
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();

    // Add a soft tonal undertone
    const toneOsc = ctx.createOscillator();
    const toneGain = ctx.createGain();
    toneOsc.type = 'sine';
    toneOsc.frequency.value = 220;
    toneGain.gain.value = 0.03;
    toneOsc.connect(toneGain);
    toneGain.connect(masterGain);
    toneOsc.start();

    // Add satisfying crackles like a fireplace/vinyl
    const createCrackle = () => {
      if (!audioContextRef.current || !gainNodeRef.current) return;

      const crackleCtx = audioContextRef.current;
      const crackleGain = crackleCtx.createGain();

      // Random crackle characteristics
      const duration = 0.01 + Math.random() * 0.03;
      const volume = 0.08 + Math.random() * 0.15;

      // Create a short burst of filtered noise for crackle
      const crackleBuffer = crackleCtx.createBuffer(1, crackleCtx.sampleRate * duration, crackleCtx.sampleRate);
      const crackleData = crackleBuffer.getChannelData(0);

      for (let i = 0; i < crackleData.length; i++) {
        // Sharp attack, quick decay envelope
        const env = Math.exp(-i / (crackleData.length * 0.15));
        crackleData[i] = (Math.random() * 2 - 1) * env;
      }

      const crackleSource = crackleCtx.createBufferSource();
      crackleSource.buffer = crackleBuffer;

      // Highpass to make it crispy
      const crackleHP = crackleCtx.createBiquadFilter();
      crackleHP.type = 'highpass';
      crackleHP.frequency.value = 2000 + Math.random() * 3000;

      crackleGain.gain.value = volume;

      crackleSource.connect(crackleHP);
      crackleHP.connect(crackleGain);
      crackleGain.connect(masterGain);

      crackleSource.start();
      crackleSource.stop(crackleCtx.currentTime + duration);

      // Schedule next crackle with random interval
      const nextInterval = 50 + Math.random() * 400;
      setTimeout(createCrackle, nextInterval);
    };

    // Start crackles after a short delay
    setTimeout(createCrackle, 500);

    oscillatorsRef.current.push(toneOsc, lfo);

    setIsInitialized(true);
  }, []);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    if (!isInitialized) {
      initAudio();
    }

    const ctx = audioContextRef.current;
    const gainNode = gainNodeRef.current;

    if (!ctx || !gainNode) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    // Smooth fade in/out
    const currentTime = ctx.currentTime;
    gainNode.gain.cancelScheduledValues(currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);

    if (newIsPlaying) {
      // Fade in over 2 seconds
      gainNode.gain.linearRampToValueAtTime(1, currentTime + 2);
    } else {
      // Fade out over 1 second
      gainNode.gain.linearRampToValueAtTime(0, currentTime + 1);
    }
  }, [isPlaying, isInitialized, initAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '1.5px solid #000',
        background: isPlaying ? '#000' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        marginLeft: '12px',
        flexShrink: 0,
      }}
      aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
      title={isPlaying ? 'Mute' : 'Ambient Sound'}
    >
      {isPlaying ? (
        // Sound on icon (speaker with waves)
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#fff" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        // Sound off icon (speaker with x)
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#000" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      )}
    </button>
  );
}
