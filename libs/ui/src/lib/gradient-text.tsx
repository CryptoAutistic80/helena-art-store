import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import styles from './gradient-text.module.css';

export interface GradientTextProps extends PropsWithChildren {
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const GradientText = ({ as: Component = 'span', className, children }: GradientTextProps) => (
  <Component className={clsx(styles.text, className)}>{children}</Component>
);
