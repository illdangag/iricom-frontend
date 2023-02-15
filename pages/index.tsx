import { Button, ButtonGroup, Box, } from '@chakra-ui/react';
import { EmptyLayout, Header, } from '../layouts';

import { useRecoilValue, useSetRecoilState, } from 'recoil';
import testCountAtom, { increaseTestCount, } from '../recoil/testCount';

const IndexPage = () => {
  const testCount = useRecoilValue(testCountAtom);
  const setIncreaseTestCount = useSetRecoilState(increaseTestCount);

  const onClickIncreaseButton = () => {
    setIncreaseTestCount(100);
  };

  return (
    <EmptyLayout>
      <Header/>
      <Box>
        <div>{testCount?.count}</div>
        <ButtonGroup variant='outline' spacing={6}>
          <Button colorScheme='blue' onClick={onClickIncreaseButton}>increase</Button>
        </ButtonGroup>
      </Box>
    </EmptyLayout>
  );
};

export default IndexPage;
