import React, { useState } from 'react';

// Components
import Button from '@/UI/components/Button/Button';
import Modal from '@/UI/components/Modal/Modal';
import CheckBox from '@/UI/components/CheckBox/CheckBox';

// Styles
import styles from './ModalAcknowledgeTerms.module.scss';

// Types
type ModalAcknowledgeTermsProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  isLoading?: boolean;
  onCloseModal: () => void;
  onDisconnectWallet?: () => void;
  onAgreeAndContinue?: () => void;
};

const ModalAcknowledgeTerms = ({
  isOpen,
  isLoading,
  onCloseModal,
  onDisconnectWallet,
  onAgreeAndContinue,
}: ModalAcknowledgeTermsProps) => {
  const [terms, setTerms] = useState([
    {
      id: 1,
      name: 'I acknowledge that I have thoroughly read, reviewed and understood the General Terms and Conditions of Use and Privacy Policy provided by the Sapiens Foundation and that I agree with them. I acknowledge that these terms govern my use of Sapiens Foundation’s offering.\nFurthermore, I recognize the inherent volatility and risk associated with digital asset transactions, including but not limited to market fluctuations, regulatory changes, and technological uncertainty. I agree and understand that Sapiens Foundation shall not be held liable for any losses that I may incur due to such risks inherent in dealing with digital assets.',
      isChecked: false,
    },
    {
      id: 2,
      name: 'I am not a resident, citizen or company incorporated in any restricted region.',
      isChecked: false,
    },
  ]);

  const handleOnChangeCheckBox = (id: number) => {
    const updateTerms = terms.map(term => {
      return {
        ...term,
        isChecked: term.id === id ? !term.isChecked : term.isChecked,
      };
    });
    setTerms(updateTerms);
  };

  const disabledButton = () => terms.some(term => term.isChecked == false);

  return (
    <Modal
      title='Acknowledge Terms & Conditions'
      isOpen={isOpen}
      isLoading={isLoading}
      onCloseModal={onCloseModal}
      hideFooter={false}
      showCloseIcon={false}
    >

      <div className={styles.acknowledgeTerms}>
        <p className={styles.title}>
          Check the boxes to confirm your agreement with the {' '}
          <a href='/term' target='_blank'>
          General Terms & Conditions of Use
          </a>{' '}
          and{' '}
          <a href='/privacy' target='_blank'>
            Privacy Policy
          </a>
          :
        </p>
        {terms.map(term => (
          <CheckBox
            key={term.id}
            label={term.name}
            checked={term.isChecked}
            labelClassName={styles.labelCheckBox}
            className={styles.checkBox}
            onChange={() => handleOnChangeCheckBox(term.id)}
          />
        ))}

        <div className={styles.buttonContainer}>
          <Button
            title='Disconnect Wallet'
            variant='outline'
            onClick={onDisconnectWallet}
            size='sm'
            className={styles.button}
          >
            Disconnect Wallet
          </Button>
          <Button
            title='Agree and Continue'
            variant='primary'
            onClick={onAgreeAndContinue}
            size='sm'
            className={`${styles.button} ${styles.primaryButton}`}
            disabled={disabledButton()}
          >
            Agree and Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAcknowledgeTerms;
