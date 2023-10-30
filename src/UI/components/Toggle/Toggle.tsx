// Packages
import { useState } from 'react';

// Styles
import styles from './Toggle.module.scss';

// Types
type ToggleProps = {
  leftLabel?: string;
  rightLabel?: string;
  defaultState?: 'left' | 'right';
  onChange?: (state: 'left' | 'right') => void;
};

const Toggle = ({ leftLabel = '', rightLabel = '', defaultState = 'left', onChange }: ToggleProps) => {
  // Toggle state
  const [state, setState] = useState(defaultState);

  // Handle the toggle
  const handleToggle = () => {
    const newState = state === 'left' ? 'right' : 'left';
    setState(newState);
    if (onChange) onChange(newState);
  };

  // Get label styles from toggle state
  const getLabelStyle = (position: 'left' | 'right') => (state === position ? styles.isActive : '');

  // Get switch styles from toggle state
  const getSwitchStyle = () => (state === 'right' ? styles.slide : '');

  return (
    <div className={styles.toggle} onClick={handleToggle}>
      {leftLabel && <p className={getLabelStyle('left')}>{leftLabel}</p>}
      <div className={styles.switch}>
        <div className={getSwitchStyle()}></div>
      </div>
      {rightLabel && <p className={getLabelStyle('right')}>{rightLabel}</p>}
    </div>
  );
};

export default Toggle;
