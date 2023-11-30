// Styles
import styles from './Instructions.module.scss';


const DigitalInstructions = () => {
  return (
    <div className={styles.container}>
      <p>
        A Digital Call Option pays off if underlying asset price ends up above a certain level at expiry, while a Digital Put Option pays off if underlying asset price ends up below a certain level at expiry. Bet on whether the market will finish above or below your defined level and get paid accordingly.
      </p>
    </div>
  );
};

export default DigitalInstructions;
