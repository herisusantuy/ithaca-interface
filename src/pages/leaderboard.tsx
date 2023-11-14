// Components
import Meta from '@/UI/components/Meta/Meta';
import Card from '@/UI/components/Card/Card';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Flex from '@/UI/layouts/Flex/Flex';
import { LEADERBOARD_CARDS } from '@/UI/constants/leaderboard';

const Leaderboard = () => {
  return (
    <>
      <Meta />
      <Main>
        <Container>
          <h1>Leaderboard</h1>
          <Flex>
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
