import { ToastItemProp, generateTestData } from '@/UI/constants/toast';
import Button from '../Button/Button';
import Toast from './Toast';
import { useState } from 'react';
import Flex from '@/UI/layouts/Flex/Flex';

const ToastTest = () => {
  const [position, setPosition] = useState('top-right');
  const [type, setType] = useState('success');
  const [toastList, setToastList] = useState<ToastItemProp[]>([]);

  const showToast = (position: string, type: string = 'info') => {
    setToastList([...toastList, ...generateTestData()]);
    setPosition(position);
    setType(type);
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
      <Toast toastList={toastList} type={type} position={position} />
    </Flex>
  );
};

export default ToastTest;
