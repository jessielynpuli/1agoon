import { cn } from '@/lib/utils';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-lg font-semibold", className)}>
      {/* Replace the SVG with an image */}
      <img
        src="/images/1agoon-LOGO-GREEN.png"
        alt="Asenso Logo"
        className="h-20.0011 w-auto"
      />
    </div>
  );
}
