// Packages
import { MouseEvent, ReactNode } from 'react';

// Styles
import styles from './Button.module.scss';

// Types
type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  size?: 'sm' | 'lg';
  title: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'icon' | 'dropdown' | 'link' | 'clear'; // Update after other other components are complete
  disabled?: boolean;
};

const Button = ({
  children,
  className,
  onClick,
  role = 'button',
  size = 'lg',
  title,
  type = 'button',
  variant = 'primary',
  disabled,
}: ButtonProps) => {
  // Get button classes based on size and variant props
  const getButtonClass = () => {
    const classList = [styles.btn, styles[`btn--${size}`], styles[`btn--${variant}`]];
    if (className) classList.push(className);
    return classList.join(' ');
  };

  return (
    <button
      role={role}
      type={type}
      className={getButtonClass()}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
