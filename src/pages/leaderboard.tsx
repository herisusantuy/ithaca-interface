// Constants
import { LEADERBOARD_CARDS } from '@/UI/constants/leaderboard';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Flex from '@/UI/layouts/Flex/Flex';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Card from '@/UI/components/Card/Card';

const Leaderboard = () => {
  return (
    <>
      <Meta />
      <Main>
        <Container margin='mb-15'>
          <h1>Leaderboard</h1>
          <Flex direction='row-space-between' gap='gap-15'>
            {LEADERBOARD_CARDS.map((data, index) => (
              <Card key={index} {...data} />
            ))}
          </Flex>
        </Container>
      </Main>
    </>
  );
};

export default Leaderboard;
