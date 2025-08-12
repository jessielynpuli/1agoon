import { cn } from '@/lib/utils';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-lg font-semibold", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 100"
        className="h-16 w-auto text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M40 80 V 60 L 60 40 L 100 40 L 140 40 L 160 60 V 80" />
        <path d="M80 80 V 60 H 120 V 80" />
        <path d="M60 40 L 100 20 L 140 40" />
        <circle cx="60" cy="40" r="3" fill="currentColor" />
        <circle cx="80" cy="40" r="3" fill="currentColor" />
        <circle cx="100" cy="40" r="3" fill="currentColor" />
        <circle cx="120" cy="40" r="3" fill="currentColor" />
        <circle cx="140" cy="40" r="3" fill="currentColor" />
        <circle cx="100" cy="20" r="3" fill="currentColor" />
      </svg>
      <span className="text-4xl font-bold tracking-[0.2em] text-primary">
        1agoon
      </span>
    </div>
  );
}
