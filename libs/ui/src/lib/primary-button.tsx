import clsx from 'clsx';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './primary-button.module.css';

export interface PrimaryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
    PropsWithChildren {
  className?: string;
  icon?: React.ReactNode;
}

export const PrimaryButton = ({ children, icon, className, ...buttonProps }: PrimaryButtonProps) => (
  <button type="button" {...buttonProps} className={clsx(styles.button, className)}>
    <span>{children}</span>
    {icon ? <span className={styles.icon}>{icon}</span> : null}
  </button>
);
