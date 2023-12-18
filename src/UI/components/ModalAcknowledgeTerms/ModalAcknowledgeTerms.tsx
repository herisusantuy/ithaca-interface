import React, { useEffect, useState, useCallback } from 'react';

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
  children,
  isOpen,
  isLoading,
  onCloseModal,
  onDisconnectWallet,
  onAgreeAndContinue,
}: ModalAcknowledgeTermsProps) => {
  const [terms, setTerms] = useState([
    {
      id: 1,
      name: 'I acknowledge that I have read, understand and agree to the Terms of Use. I understand the risks and disclaimers, and understand that we have no control over your assets or the Ithaca Protocol.',
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
      title='Acknowledge Terms'
      isOpen={isOpen}
      isLoading={isLoading}
      onCloseModal={onCloseModal}
      hideFooter={false}
    >
      <div className={styles.acknowledgeTerms}>
        <p className={styles.title}>
          Check the boxes to confirm your agreement to the <a href='www.google.com'>Terms of Use</a> and{' '}
          <a href='www.google.com'>Privacy Policy</a>:
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
