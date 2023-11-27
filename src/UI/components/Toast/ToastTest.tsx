// Load components
import Button from '@/UI/components/Button/Button';
import Toast from './Toast';
import Flex from '@/UI/layouts/Flex/Flex';

// Load constants
import { generateTestData } from '@/UI/constants/toast';
import useToast from '@/UI/hooks/useToast';

const ToastTest = () => {
  const {toastList, position, showToast} = useToast();
  return (
    <Flex direction='row-space-around' margin='mb-32'>
      <Button title='Click to perform action' onClick={() => showToast(generateTestData()[0], 'top-right')} size='sm'>
        show Toast(Top-right)
      </Button>
      <Button title='Click to perform action' onClick={() => showToast(generateTestData()[0], 'top-left')} size='sm'>
        show Toast(Top-left)
      </Button>
      <Button
        title='Click to perform action'
        onClick={() => showToast(generateTestData()[0], 'bottom-right')}
        size='sm'
        variant='secondary'
      >
        show Toast(bottom-right)
      </Button>
      <Button title='Click to perform action' onClick={() => showToast(generateTestData()[0], 'bottom-left')} size='sm'>
        show Toast(bottom-left)
      </Button>
      <Toast toastList={toastList} position={position} />
    </Flex>
  );
};

export default ToastTest;
