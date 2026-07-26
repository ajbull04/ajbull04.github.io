import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, Pause, Play, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsVisible } from "@/hooks/useIsVisible";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EmgSource, PacketFramer, hexFromSamples, type PacketEvent } from "./emgSignal";

const WINDOW_SECONDS = 2.5;
const NOTIFY_INTERVAL_MS = 20;
const SAMPLE_RATES = [200, 500, 1000] as const;
const CLEAN_LOSS_RATE = 0.004;
const LOSSY_LOSS_RATE = 0.07;
const LOG_LENGTH = 7;

const LINK_STEPS = ["SCANNING", "CONNECTING", "BONDED", "STREAMING"] as const;
type LinkState = (typeof LINK_STEPS)[number];

interface Stats {
  rssi: number;
  received: number;
  crcFail: number;
  dropped: number;
  retransmitted: number;
  throughput: number;
}

const STATUS_LABEL: Record<PacketEvent["status"], string> = {
  ok: "ok",
  crc: "crc fail",
  dropped: "dropped",
  retx: "retx",
};

const DeviceConsole = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useIsVisible(wrapperRef);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [link, setLink] = useState<LinkState>("SCANNING");
  const [paused, setPaused] = useState(false);
  const [lossy, setLossy] = useState(false);
  const [sampleRate, setSampleRate] = useState<number>(500);
  const [log, setLog] = useState<PacketEvent[]>([]);
  const [stats, setStats] = useState<Stats>({
    rssi: -52,
    received: 0,
    crcFail: 0,
    dropped: 0,
    retransmitted: 0,
    throughput: 0,
  });

  const sourceRef = useRef<EmgSource | null>(null);
  const framerRef = useRef<PacketFramer | null>(null);
  const bufferRef = useRef<Float32Array>(new Float32Array(Math.round(500 * WINDOW_SECONDS)));
  const logRef = useRef<PacketEvent[]>([]);
  const rssiRef = useRef(-52);
  const lossyRef = useRef(false);
  const colorsRef = useRef({ trace: "#c8321a", grid: "rgba(0,0,0,0.06)", plate: "#e8e6e2" });

  useEffect(() => {
    lossyRef.current = lossy;
  }, [lossy]);

  const bytesPerPacket = Math.round((sampleRate * NOTIFY_INTERVAL_MS) / 1000) * 2 + 4;

  const appendSamples = useCallback((samples: Float32Array) => {
    const buffer = bufferRef.current;
    if (samples.length === 0) return;
    if (samples.length >= buffer.length) {
      buffer.set(samples.subarray(samples.length - buffer.length));
      return;
    }
    buffer.copyWithin(0, samples.length);
    buffer.set(samples, buffer.length - samples.length);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    const { trace, grid, plate } = colorsRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = plate;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let s = 0; s <= WINDOW_SECONDS; s += 0.5) {
      const x = Math.round((s / WINDOW_SECONDS) * width) + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let f = 0; f <= 4; f++) {
      const y = Math.round((f / 4) * height) + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    const buffer = bufferRef.current;
    const mid = height / 2;
    const amplitude = height / 2 - 8;

    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const start = Math.floor((x / width) * buffer.length);
      const end = Math.max(start + 1, Math.floor(((x + 1) / width) * buffer.length));
      let min = 1;
      let max = -1;
      for (let i = start; i < end; i++) {
        const value = buffer[i];
        if (value < min) min = value;
        if (value > max) max = value;
      }
      const top = mid - max * amplitude;
      const bottom = mid - min * amplitude;
      ctx.moveTo(x + 0.5, top);
      ctx.lineTo(x + 0.5, Math.max(bottom, top + 0.7));
    }
    ctx.strokeStyle = trace;
    ctx.lineWidth = 1;
    ctx.stroke();
  }, []);

  // Resolve theme colors once so the canvas stays in sync with the CSS tokens.
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const hsl = (token: string) => `hsl(${styles.getPropertyValue(token).trim()})`;
    colorsRef.current = {
      trace: hsl("--coral"),
      grid: `hsl(${styles.getPropertyValue("--ink").trim()} / 0.08)`,
      plate: hsl("--paper-deep"),
    };
  }, []);

  useEffect(() => {
    sourceRef.current = new EmgSource(sampleRate);
    framerRef.current = new PacketFramer(NOTIFY_INTERVAL_MS);
    bufferRef.current = new Float32Array(Math.round(sampleRate * WINDOW_SECONDS));
    logRef.current = [];
    setLog([]);
  }, [sampleRate]);

  // Connection handshake plays once when the console mounts.
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setLink("CONNECTING"), 650),
      window.setTimeout(() => setLink("BONDED"), 1250),
      window.setTimeout(() => setLink("STREAMING"), 1750),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  // Static single frame when motion is reduced: same waveform, no animation loop.
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const source = new EmgSource(sampleRate);
    bufferRef.current = new Float32Array(Math.round(sampleRate * WINDOW_SECONDS));
    source.flex(0.9);
    appendSamples(source.read(0.8));
    source.flex(0.55);
    appendSamples(source.read(1.7));
    draw();
  }, [appendSamples, draw, prefersReducedMotion, sampleRate]);

  useEffect(() => {
    if (prefersReducedMotion || paused || !isVisible || link !== "STREAMING") return;
    const source = sourceRef.current;
    const framer = framerRef.current;
    if (!source || !framer) return;

    let frame = 0;
    let last = performance.now();
    let lastFlush = last;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.25);
      last = now;

      appendSamples(source.read(dt));
      const events = framer.tick(dt, {
        lossRate: lossyRef.current ? LOSSY_LOSS_RATE : CLEAN_LOSS_RATE,
        bytesPerPacket,
        payload: () => hexFromSamples(bufferRef.current),
      });
      // 50 notifications a second is unreadable: sample the healthy ones, keep every fault.
      const notable = events.filter((event) => event.status !== "ok" || event.seq % 12 === 0);
      if (notable.length) {
        logRef.current = [...notable.reverse(), ...logRef.current].slice(0, LOG_LENGTH);
      }
      draw();

      if (now - lastFlush > 140) {
        lastFlush = now;
        rssiRef.current = Math.max(-71, Math.min(-43, rssiRef.current + (Math.random() - 0.5) * 1.6));
        setStats({
          rssi: rssiRef.current,
          received: framer.received,
          crcFail: framer.crcFail,
          dropped: framer.dropped,
          retransmitted: framer.retransmitted,
          throughput: framer.throughputKbPerSecond,
        });
        setLog(logRef.current);
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [appendSamples, bytesPerPacket, draw, isVisible, link, paused, prefersReducedMotion]);

  const readouts = [
    { label: "Notify interval", value: `${NOTIFY_INTERVAL_MS} ms` },
    { label: "Sample rate", value: `${sampleRate} Hz` },
    { label: "Payload", value: `${bytesPerPacket} B` },
    { label: "RSSI", value: `${stats.rssi.toFixed(0)} dBm` },
    { label: "Throughput", value: `${stats.throughput.toFixed(1)} kB/s` },
    { label: "Packets", value: stats.received.toLocaleString() },
    { label: "CRC failures", value: `${stats.crcFail}` },
    { label: "Dropped / retx", value: `${stats.dropped} / ${stats.retransmitted}` },
  ];

  return (
    <div ref={wrapperRef} className="border border-ink/15 bg-card/50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 px-5 py-3">
        <p className="label-mono text-foreground">nRF52 · emg-node-04</p>
        <div className="flex flex-wrap items-center gap-4">
          {LINK_STEPS.map((step) => {
            const reached = LINK_STEPS.indexOf(step) <= LINK_STEPS.indexOf(link);
            return (
              <span key={step} className="flex items-center gap-2">
                <span className={cn("h-2 w-2", reached ? "bg-primary" : "bg-ink/20")} />
                <span className={cn("label-mono", step === link ? "text-primary" : "text-muted-foreground/70")}>
                  {step}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="flex items-baseline justify-between">
            <p className="label-mono text-muted-foreground">EMG channel 1 · ±2.4 mV</p>
            <p className="label-mono text-muted-foreground">{WINDOW_SECONDS}s window</p>
          </div>
          <canvas
            ref={canvasRef}
            aria-label="Simulated surface EMG waveform streaming over BLE"
            className="mt-2 h-56 w-full border border-ink/10 sm:h-72"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onPointerDown={() => sourceRef.current?.flex()}
              className="flex items-center gap-2 bg-ink px-4 py-2.5 font-display text-sm font-semibold text-paper transition-colors hover:bg-primary"
            >
              <Zap className="h-3.5 w-3.5" />
              Flex
            </button>
            <button
              type="button"
              onClick={() => setLossy((value) => !value)}
              aria-pressed={lossy}
              className={cn(
                "label-mono border px-4 py-2.5 transition-colors",
                lossy
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-ink/25 text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              Inject packet loss
            </button>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className="label-mono flex items-center gap-2 border border-ink/25 px-4 py-2.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              {paused ? "Resume" : "Pause"}
            </button>
            <div className="flex items-center gap-2">
              <span className="label-mono text-muted-foreground">Rate</span>
              {SAMPLE_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSampleRate(rate)}
                  aria-pressed={sampleRate === rate}
                  className={cn(
                    "label-mono border px-3 py-2 transition-colors",
                    sampleRate === rate
                      ? "border-primary text-primary"
                      : "border-ink/20 text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {rate}
                </button>
              ))}
            </div>
          </div>

          {prefersReducedMotion && (
            <p className="label-mono mt-4 text-muted-foreground">
              Reduced motion is on — showing a captured frame instead of the live stream.
            </p>
          )}
        </div>

        <div className="space-y-6">
          <dl className="divide-y divide-ink/10 border-t border-ink/20">
            {readouts.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="label-mono text-muted-foreground">{row.label}</dt>
                <dd className="font-mono text-sm text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="label-mono flex items-center gap-2 border-t border-ink/20 pt-3 text-muted-foreground">
              <Activity className="h-3 w-3" />
              Notification frames
            </p>
            <ul className="mt-2 space-y-1">
              {log.length === 0 && <li className="font-mono text-xs text-muted-foreground">waiting for link…</li>}
              {log.map((entry) => (
                <li key={entry.id} className="flex items-baseline justify-between gap-3 font-mono text-xs">
                  <span className="text-muted-foreground">#{entry.seq.toString().padStart(5, "0")}</span>
                  <span className="truncate text-foreground/80">{entry.hex}</span>
                  <span className={cn(entry.status === "ok" ? "text-muted-foreground" : "text-primary")}>
                    {STATUS_LABEL[entry.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConsole;
