// Components
import Meta from '@/UI/components/Meta/Meta';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';

const Index = () => {
  return (
    <>
      <Meta />
      <Main>
        <Container>
          <TradingLayout isLite={true}/>
          <p>Stories page</p>
        </Container>
      </Main>
    </>
  );
};

export default Index;
