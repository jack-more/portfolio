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

    // Harmonized hum - chord-based drone
    // Using a major chord with octaves for warm, harmonious sound
    const chordTones = [
      // Root (C)
      { freq: 130.81, gain: 0.12 },   // C3
      { freq: 261.63, gain: 0.08 },   // C4

      // Major third (E)
      { freq: 164.81, gain: 0.07 },   // E3
      { freq: 329.63, gain: 0.05 },   // E4

      // Perfect fifth (G)
      { freq: 196.00, gain: 0.08 },   // G3
      { freq: 392.00, gain: 0.04 },   // G4

      // Octave reinforcement
      { freq: 523.25, gain: 0.025 },  // C5 (soft high)
    ];

    chordTones.forEach(({ freq, gain }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      // Very slight detuning for warmth
      osc.detune.value = (Math.random() - 0.5) * 4;

      oscGain.gain.value = gain;
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      oscillatorsRef.current.push(osc);
    });

    // Add gentle beating/shimmer with slightly detuned doubles
    const shimmerTones = [
      { freq: 130.81, gain: 0.04, detune: 2 },
      { freq: 196.00, gain: 0.03, detune: -2 },
      { freq: 261.63, gain: 0.025, detune: 3 },
    ];

    shimmerTones.forEach(({ freq, gain, detune }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune;

      oscGain.gain.value = gain;
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      oscillatorsRef.current.push(osc);
    });

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
