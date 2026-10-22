'use client';

import { useEffect, useRef, useState } from 'react';
import { Radio, ShieldCheck, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

type Phase = 'shown' | 'leaving' | 'hidden';

const STATUS_MESSAGES = [
  'Syncing POS terminal stream',
  'Loading floor telemetry',
  'Verifying operator session',
  'Calibrating safety buffers',
  'Restoring aisle inventory',
];

const TICK_MS = 70;
const LEAVE_TRANSITION_MS = 450;

function progressFor(elapsed: number) {
  return Math.round(Math.min(97, 97 * (1 - Math.exp(-elapsed / 1100))));
}

export function LoadingScreen({
  active,
  label = 'Loading operations',
  minDuration = 900,
  className,
}: {
  active: boolean;
  label?: string;
  minDuration?: number;
  className?: string;
}) {
  const [phase, setPhase] = useState<Phase>('hidden');
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const shownAt = useRef(0);
  const wasActive = useRef(false);

  useEffect(() => {
    if (!active) return;

    wasActive.current = true;
    shownAt.current = Date.now();
    const startedAt = Date.now();

    const tick = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(progressFor(elapsed));
      setMessageIndex(
        Math.floor(elapsed / (TICK_MS * 16)) % STATUS_MESSAGES.length
      );
    }, TICK_MS);

    return () => clearInterval(tick);
  }, [active]);

  useEffect(() => {
    if (active || !wasActive.current) return;

    wasActive.current = false;
    const wait = Math.max(0, minDuration - (Date.now() - shownAt.current));

    const leaveTimer = setTimeout(() => setPhase('leaving'), wait);
    const hideTimer = setTimeout(
      () => setPhase('hidden'),
      wait + LEAVE_TRANSITION_MS
    );

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, [active, minDuration]);

  if (!active && phase === 'hidden') return null;

  const isLeaving = phase === 'leaving';

  return (
    <div
      aria-live="polite"
      aria-busy={!isLeaving}
      aria-label={label}
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#064E3B] text-white overflow-hidden',
        'transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform',
        isLeaving ? '-translate-y-full pointer-events-none' : 'translate-y-0',
        active && 'animate-loader-rise',
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #34D399 0, transparent 45%), radial-gradient(circle at 80% 70%, #6EE7B7 0, transparent 40%)',
        }}
      />

      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <span className="absolute inset-0 rounded-xl border border-white/20 animate-ping [animation-duration:1.6s]" />
          <div className="w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/25 flex items-center justify-center">
            <Store className="w-6 h-6 text-[#34D399]" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="font-heading text-lg font-extrabold tracking-tight">
            OmniStock
          </div>
          <div className="text-xs text-[#A7F3D0] font-medium h-4">
            {STATUS_MESSAGES[messageIndex]}
          </div>
        </div>

        <div className="w-56">
          <div className="h-1 w-full rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#34D399] transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#A7F3D0]">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#34D399]" />
              {label}
            </span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <div className="relative flex items-center gap-1.5 text-[10px] text-[#A7F3D0]/80">
        <ShieldCheck className="w-3 h-3 text-[#34D399]" />
        <span>Telemetry encrypted • 18 aisles instrumented</span>
      </div>
    </div>
  );
}
