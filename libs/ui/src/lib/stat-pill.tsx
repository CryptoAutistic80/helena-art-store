import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import styles from './stat-pill.module.css';

export interface StatPillProps extends PropsWithChildren {
  value: string;
  className?: string;
}

export const StatPill = ({ value, children, className }: StatPillProps) => (
  <span className={clsx(styles.pill, className)}>
    <span className={styles.value}>{value}</span>
    <span>{children}</span>
  </span>
);
