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

const ModalWithButton = (props: ModalButtonProps) => {
  const { isLoading, onSubmitOrder } = props;
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
      <Button title={props.title} onClick={handleOnClick}>
        {props.btnText}
      </Button>
      <Modal
        title='Manage Funds'
        isOpen={showModal}
        isLoading={isLoading}
        onCloseModal={() => setShowModal(false)}
        onSubmitOrder={handleSubmit}
      >
        {props.children}
      </Modal>
    </>
  );
};

export default ModalWithButton;
