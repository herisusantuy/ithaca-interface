// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Button.module.scss';

// Types
type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  role?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  title: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon' | 'dropdown' | 'link' | 'tab';
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
    let classList = [styles.btn, styles[`btn--${size}`], styles[`btn--${variant}`]];
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
