'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingScreen } from '@/components/ui/loading-screen';

export function RouteLoader({ minDuration = 700 }: { minDuration?: number }) {
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setActive(true);
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setActive(false), 120);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <LoadingScreen active={active} minDuration={minDuration} label="Loading module" />
  );
}
