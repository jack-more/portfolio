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

    // Create smooth, steady white noise for soft blowing
    const bufferSize = 4 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate smooth pink noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    // Create noise source
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Gentle lowpass for smooth, airy sound
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3000;
    lowpass.Q.value = 0.3;

    // Second lowpass for extra smoothness
    const lowpass2 = ctx.createBiquadFilter();
    lowpass2.type = 'lowpass';
    lowpass2.frequency.value = 2500;
    lowpass2.Q.value = 0.2;

    // Gentle highpass to remove very low rumble
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 150;
    highpass.Q.value = 0.3;

    // Gain for noise
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.25;

    // Connect noise chain - no bandpass, just smooth filtering
    noise.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(lowpass2);
    lowpass2.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start();

    // Add soft, subtle crackles
    const createCrackle = () => {
      if (!audioContextRef.current || !gainNodeRef.current) return;

      const crackleCtx = audioContextRef.current;
      const crackleGain = crackleCtx.createGain();

      // Softer, shorter crackles
      const duration = 0.005 + Math.random() * 0.015;
      const volume = 0.04 + Math.random() * 0.08;

      const crackleBuffer = crackleCtx.createBuffer(1, crackleCtx.sampleRate * duration, crackleCtx.sampleRate);
      const crackleData = crackleBuffer.getChannelData(0);

      for (let i = 0; i < crackleData.length; i++) {
        const env = Math.exp(-i / (crackleData.length * 0.1));
        crackleData[i] = (Math.random() * 2 - 1) * env;
      }

      const crackleSource = crackleCtx.createBufferSource();
      crackleSource.buffer = crackleBuffer;

      // Bandpass for softer crackle tone
      const crackleBP = crackleCtx.createBiquadFilter();
      crackleBP.type = 'bandpass';
      crackleBP.frequency.value = 3000 + Math.random() * 2000;
      crackleBP.Q.value = 1;

      crackleGain.gain.value = volume;

      crackleSource.connect(crackleBP);
      crackleBP.connect(crackleGain);
      crackleGain.connect(masterGain);

      crackleSource.start();
      crackleSource.stop(crackleCtx.currentTime + duration);

      // Longer intervals for less frequent crackles
      const nextInterval = 100 + Math.random() * 600;
      setTimeout(createCrackle, nextInterval);
    };

    setTimeout(createCrackle, 800);

    oscillatorsRef.current = [];

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
