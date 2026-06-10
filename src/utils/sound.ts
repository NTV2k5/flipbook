/**
 * Synthesizes a realistic page-flipping sound using the Web Audio API.
 * This avoids needing to download and host static MP3 assets, and runs fully client-side.
 */
export const playPageFlipSound = () => {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // 1. Create a White Noise Buffer to simulate the paper friction
    const duration = 0.35; // seconds
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // Create Audio Nodes
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // 2. Bandpass filter to shape the friction frequency (representing paper rubbing)
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = "bandpass";
    
    // Sweep the center frequency down slightly to simulate the speed change of a turning page
    filterNode.frequency.setValueAtTime(900, ctx.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + duration);
    filterNode.Q.setValueAtTime(4, ctx.currentTime); // Resonance

    // 3. Gain node to control the volume envelope (Attack-Decay)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    
    // Quick rise (attack) to mimic initial snap/lift
    gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.06);
    // Exponential falloff (decay) to mimic the page landing
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Connect nodes: Source -> Filter -> Gain -> Output
    noiseNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play
    noiseNode.start();
    noiseNode.stop(ctx.currentTime + duration);

    // Safely close the context after playback finishes to free audio threads
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, (duration + 0.1) * 1000);
  } catch (error) {
    console.warn("Audio Context playback failed or was blocked by browser autoplay policy:", error);
  }
};
