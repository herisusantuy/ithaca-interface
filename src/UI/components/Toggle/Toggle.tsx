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

  // Get switch styles from toggle state
  const getSwitchStyle = () => (state === 'right' ? `${styles.switch} ${styles.isActive}` : styles.switch);

  return (
    <div className={styles.toggle} onClick={handleToggle}>
      {leftLabel && <p>{leftLabel}</p>}
      <div className={getSwitchStyle()}>
        <div className={styles.slider}></div>
      </div>
      {rightLabel && <p>{rightLabel}</p>}
    </div>
  );
};

export default Toggle;
