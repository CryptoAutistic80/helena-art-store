import type { PropsWithChildren, ReactNode } from 'react';

function mergeClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export type GlassCardProps = PropsWithChildren<{
  className?: string;
  footer?: ReactNode;
}>;

export function GlassCard({ className, children, footer }: GlassCardProps) {
  return (
    <div
      className={mergeClasses(
        'rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-purple-500/20 backdrop-blur-xl',
        'transition duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-purple-500/40',
        className
      )}
    >
      <div className="space-y-4 text-sm text-white/80">{children}</div>
      {footer ? <div className="mt-6 text-xs text-white/60">{footer}</div> : null}
    </div>
  );
}

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={mergeClasses('space-y-3 text-white', align === 'center' ? 'text-center' : undefined)}
    >
      {eyebrow ? (
        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm text-white/70 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export interface AccentLinkProps {
  href: string;
  children: ReactNode;
}

export function AccentLink({ href, children }: AccentLinkProps) {
  return (
    <a
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:bg-white/20"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span aria-hidden>→</span>
    </a>
  );
}
