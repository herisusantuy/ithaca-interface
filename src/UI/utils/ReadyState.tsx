import React from 'react';
import { useAppStore } from '../lib/zustand/store';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';

// Components
import Loader from '@/UI/components/Loader/Loader';

const ReadyState: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isLoading } = useAppStore();

  return !isLoading ? (
    children
  ) : (
    <Main>
      <Container size='loader'>
        <Loader />
      </Container>
    </Main>
  );
};

export default ReadyState;
