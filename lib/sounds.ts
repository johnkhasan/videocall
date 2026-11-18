// Web Audio API Sound Effects for FaceTime Web (Join, Leave, End Call)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a pleasant, warm ascending chime when a participant joins the room
 */
export function playJoinSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Tone 1: C5 (523.25Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(523.25, now);

  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.2);

  // Tone 2: G5 (783.99Hz) - bright pleasant chime
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(783.99, now + 0.09);

  gain2.gain.setValueAtTime(0, now + 0.09);
  gain2.gain.linearRampToValueAtTime(0.22, now + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc2.start(now + 0.09);
  osc2.stop(now + 0.5);
}

/**
 * Play a soft, subtle descending chime when someone leaves the room
 */
export function playLeaveSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Tone 1: E5 (659.25Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(659.25, now);

  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.15, now + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.18);

  // Tone 2: D4 (293.66Hz)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(392.0, now + 0.08);

  gain2.gain.setValueAtTime(0, now + 0.08);
  gain2.gain.linearRampToValueAtTime(0.16, now + 0.11);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc2.start(now + 0.08);
  osc2.stop(now + 0.4);
}

/**
 * Play FaceTime style hangup / end call double tone
 */
export function playEndCallSound(): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    if (!ctx) {
      resolve();
      return;
    }

    const now = ctx.currentTime;

    // Pip 1: 480Hz
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(480, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.11);

    // Pip 2: 360Hz
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(360, now + 0.13);

    gain2.gain.setValueAtTime(0, now + 0.13);
    gain2.gain.linearRampToValueAtTime(0.18, now + 0.145);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.13);
    osc2.stop(now + 0.35);

    setTimeout(() => {
      resolve();
    }, 320);
  });
}
