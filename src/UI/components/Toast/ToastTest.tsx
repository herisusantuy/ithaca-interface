// Load packages
import { useState } from 'react';

// Load components
import Button from '@/UI/components/Button/Button';
import Toast from './Toast';
import Flex from '@/UI/layouts/Flex/Flex';

// Load constants
import { ToastItemProp, generateTestData } from '@/UI/constants/toast';

const ToastTest = () => {
  const [toastList, setToastList] = useState<ToastItemProp[]>([]);
  const [position, setPosition] = useState<string>('top-right');

  const showToast = (position: string, type: string = 'info') => {
    setToastList([...toastList, ...generateTestData(position, type)]);
    setPosition(position);
  };

  return (
    <Flex direction='row-space-around' margin='mb-32'>
      <Button title='Click to perform action' onClick={() => showToast('top-right')} size='sm'>
        show Toast(Top-right)
      </Button>
      <Button title='Click to perform action' onClick={() => showToast('top-left')} size='sm'>
        show Toast(Top-left)
      </Button>
      <Button
        title='Click to perform action'
        onClick={() => showToast('bottom-right', 'error')}
        size='sm'
        variant='secondary'
      >
        show Toast(bottom-right)
      </Button>
      <Button title='Click to perform action' onClick={() => showToast('bottom-left', 'success')} size='sm'>
        show Toast(bottom-left)
      </Button>
      <Toast toastList={toastList} position={position} />
    </Flex>
  );
};

export default ToastTest;
