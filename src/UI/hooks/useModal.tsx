// Packages
import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    document.body.classList.add('is-active');
    setIsOpen(true);
  };

  const closeModal = () => {
    document.body.classList.remove('is-active');
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
