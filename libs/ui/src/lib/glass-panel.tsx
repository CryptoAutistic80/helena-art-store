import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import styles from './glass-panel.module.css';

export interface GlassPanelProps extends PropsWithChildren {
  tone?: 'default' | 'accent';
  className?: string;
}

export const GlassPanel = ({ tone = 'default', className, children }: GlassPanelProps) => (
  <div className={clsx(styles.panel, tone === 'accent' && styles.panelAccent, className)}>{children}</div>
);
