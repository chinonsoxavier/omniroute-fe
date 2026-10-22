import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ProductThumb({
  src,
  alt,
  department,
  size = 40,
  className,
  rounded = 'rounded-md',
}: {
  src?: string;
  alt: string;
  department: string;
  size?: number;
  className?: string;
  rounded?: string;
}) {
  if (!src) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          'bg-[#064E3B] text-emerald-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs',
          rounded,
          className
        )}
      >
        {department.slice(0, 3).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn(
        'object-cover border border-[#E2E8F0] bg-white shrink-0',
        rounded,
        className
      )}
    />
  );
}

export function SupplierThumb({
  src,
  alt,
  size = 32,
  className,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn(
        'object-cover rounded-lg border border-[#E2E8F0] bg-white shrink-0',
        className
      )}
    />
  );
}
