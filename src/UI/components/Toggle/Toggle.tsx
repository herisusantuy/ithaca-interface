// Styles
import styles from './Toggle.module.scss';

// Types
type ToggleProps = {};

const Toggle = ({}: ToggleProps) => {
  return (
    <div className={styles.toggle}>
      <p>Toggle</p>
    </div>
  );
};

export default Toggle;
