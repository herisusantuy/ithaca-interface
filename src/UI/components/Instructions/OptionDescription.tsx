// Styles
import styles from './Instructions.module.scss';


const OptionInstructions = () => {
  return (
    <div className={styles.container}>
      <p>
      A Call Option is a contract allowing a user to buy an asset at a fixed price at contract expiry, while a Put Option provides the user with the right to sell. Reserve a future sale or purchase without any commitment to follow up on the reservation.
      </p>
    </div>
  );
};

export default OptionInstructions;
