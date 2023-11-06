// Components
import Meta from '@/UI/components/Meta/Meta';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import CollateralPanel from '@/UI/components/CollateralPanel/CollateralPanel';
// import OrderPanel from '@/UI/components/OrderPanel/OrderPanel';

const Dashboard = () => {
  return (
    <>
      <Meta />
      <Main>
        <Container>
          <CollateralPanel/>
          {/* <OrderPanel /> */}
        </Container>
      </Main>
    </>
  );
};

export default Dashboard;
