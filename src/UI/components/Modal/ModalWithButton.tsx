// Package import
import { ReactNode, useState } from 'react';

// Components import
import Button from '@/UI/components/Button/Button';
import Modal from '@/UI/components/Modal/Modal';

type ModalButtonProps = {
  title: string;
  btnText: string;
  children?: ReactNode;
  isLoading: boolean;
  onSubmitOrder: () => void;
};

const ModalWithButton = ({ title, btnText, children, isLoading, onSubmitOrder }: ModalButtonProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOnClick = () => {
    setShowModal(!showModal);
  };
  const handleSubmit = () => {
    onSubmitOrder();
    setShowModal(false);
  };
  return (
    <>
      <Button title={title} onClick={handleOnClick}>
        {btnText}
      </Button>
      <Modal
        title='Manage Funds'
        isOpen={showModal}
        isLoading={isLoading}
        onCloseModal={() => setShowModal(false)}
        onSubmitOrder={handleSubmit}
      >
        {children}
      </Modal>
    </>
  );
};

export default ModalWithButton;
