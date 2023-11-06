// Packages
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

// Components
import Button from '@/UI/components/Button/Button';
import Loader from '@/UI/components/Loader/Loader';
import ModalClose from '@/UI/components/Icons/ModalClose';

// Styles
import styles from './Modal.module.scss';

// Animation
const animatedModal = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.3,
      type: 'spring',
      damping: 25,
      stiffness: 250,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
};

// Types
type ModalProps = {
  children: React.ReactNode;
  title: string;
  onCloseModal: () => void;
  onSubmitOrder: () => void;
  isLoading: boolean;
  isOpen: boolean;
};

const Modal = ({ children, title, onCloseModal, onSubmitOrder, isLoading, isOpen }: ModalProps) => {

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('is-active');
    } else {
      document.body.classList.remove('is-active');
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseModal();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.body.classList.remove('is-active');
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onCloseModal]);

  const modalContent = (
    <motion.div
      className={styles.modalBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onCloseModal()}
    >
      <motion.div
        onClick={(e: React.MouseEvent<Element, Event>) => e.stopPropagation()}
        className={styles.modal}
        variants={animatedModal}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        <div className={styles.modalHeader}>
          <h4 className={styles.modalTitle}>{title}</h4>
          <Button onClick={onCloseModal} className={styles.buttonClose} title='Click to close modal'>
            <ModalClose />
          </Button>
        </div>
        <div className={styles.modalContent}>{children}</div>
        <div className={styles.modalFooter}>
          <Button
            className={`${styles.confirmButton} ${isLoading ? styles.buttonLoading : ''}`}
            onClick={onSubmitOrder}
            title='Click to confirm'
          >
            {isLoading ? <Loader /> : 'Confirm'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(
    <AnimatePresence initial={true} mode='wait'>
      {isOpen && modalContent}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
