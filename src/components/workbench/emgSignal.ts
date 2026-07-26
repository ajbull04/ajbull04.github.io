/**
 * Signal and link models behind the device console demo: a surface-EMG-shaped
 * waveform plus the BLE notification framing used to stream it off the board.
 * Kept free of rendering and React so the behavior can be reasoned about alone.
 */

/** Sum of uniforms — cheap approximation of a normal distribution. */
const gaussian = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;

const BASELINE_NOISE = 0.06;
const MAINS_HUM = 0.012;
const MAINS_HZ = 60;

export class EmgSource {
  private t = 0;
  private burstStart = 0;
  private burstEnd = 0;
  private burstAmp = 0;
  private nextSpontaneous = 2.5;

  constructor(public sampleRateHz: number) {}

  /** Contraction: envelope-shaped burst of high-frequency motor unit activity. */
  flex(amp = 0.8 + Math.random() * 0.2, duration = 0.28 + Math.random() * 0.22) {
    this.burstStart = this.t;
    this.burstEnd = this.t + duration;
    this.burstAmp = amp;
  }

  /** Generate the samples covering `dt` seconds, clamped to one second of catch-up. */
  read(dt: number): Float32Array {
    const count = Math.min(Math.round(dt * this.sampleRateHz), this.sampleRateHz);
    const out = new Float32Array(Math.max(count, 0));
    const step = 1 / this.sampleRateHz;

    for (let i = 0; i < out.length; i++) {
      this.t += step;

      if (this.t > this.nextSpontaneous) {
        this.flex(0.4 + Math.random() * 0.45);
        this.nextSpontaneous = this.t + 0.9 + Math.random() * 1.4;
      }

      let value = gaussian() * BASELINE_NOISE + Math.sin(2 * Math.PI * MAINS_HZ * this.t) * MAINS_HUM;

      if (this.t < this.burstEnd) {
        const progress = (this.t - this.burstStart) / (this.burstEnd - this.burstStart);
        const envelope = Math.sin(Math.PI * progress) ** 0.7;
        value += gaussian() * envelope * this.burstAmp * 1.7;
      }

      out[i] = Math.max(-1, Math.min(1, value));
    }

    return out;
  }
}

export type PacketStatus = "ok" | "crc" | "dropped" | "retx";

export interface PacketEvent {
  id: number;
  seq: number;
  hex: string;
  bytes: number;
  status: PacketStatus;
}

export interface FrameOptions {
  lossRate: number;
  bytesPerPacket: number;
  payload: () => string;
}

export class PacketFramer {
  received = 0;
  crcFail = 0;
  dropped = 0;
  retransmitted = 0;
  bytesTotal = 0;

  private seq = 1;
  private eventId = 1;
  private accumulator = 0;
  private elapsed = 0;
  private pendingRetx: number | null = null;

  constructor(public intervalMs = 20) {}

  get throughputKbPerSecond() {
    return this.elapsed > 0 ? this.bytesTotal / 1024 / this.elapsed : 0;
  }

  tick(dt: number, { lossRate, bytesPerPacket, payload }: FrameOptions): PacketEvent[] {
    this.accumulator += dt * 1000;
    this.elapsed += dt;

    const events: PacketEvent[] = [];
    const interval = this.intervalMs;

    // Cap catch-up so a backgrounded tab can't emit thousands of packets at once.
    let budget = 24;
    while (this.accumulator >= interval && budget-- > 0) {
      this.accumulator -= interval;

      if (this.pendingRetx !== null) {
        const seq = this.pendingRetx;
        this.pendingRetx = null;
        this.received += 1;
        this.retransmitted += 1;
        this.bytesTotal += bytesPerPacket;
        events.push({ id: this.eventId++, seq, hex: payload(), bytes: bytesPerPacket, status: "retx" });
        continue;
      }

      const seq = this.seq++;
      const roll = Math.random();

      if (roll < lossRate) {
        this.dropped += 1;
        this.pendingRetx = seq;
        events.push({ id: this.eventId++, seq, hex: payload(), bytes: 0, status: "dropped" });
        continue;
      }

      if (roll < lossRate + lossRate / 3) {
        this.crcFail += 1;
        this.pendingRetx = seq;
        events.push({ id: this.eventId++, seq, hex: payload(), bytes: bytesPerPacket, status: "crc" });
        continue;
      }

      this.received += 1;
      this.bytesTotal += bytesPerPacket;
      events.push({ id: this.eventId++, seq, hex: payload(), bytes: bytesPerPacket, status: "ok" });
    }

    return events;
  }
}

/** Int16-encode the tail of the sample window the way the firmware packs a notification. */
export const hexFromSamples = (samples: Float32Array, count = 4) => {
  const bytes: string[] = [];
  for (let i = Math.max(0, samples.length - count); i < samples.length; i++) {
    const encoded = Math.round(samples[i] * 32767) & 0xffff;
    bytes.push(encoded.toString(16).padStart(4, "0"));
  }
  return bytes.join(" ").toUpperCase();
};
