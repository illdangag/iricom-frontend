// react
import { Button, ButtonGroup, Box, } from '@chakra-ui/react';
import { MainLayout, } from '../layouts';
import useIricomAPI from '../hooks/useIricomAPI';
// store
import { useRecoilValue, useSetRecoilState, } from 'recoil';
import testCountAtom, { increaseTestCount, } from '../recoil/testCount';

const IndexPage = () => {
  const iricomAPI = useIricomAPI();

  const testCount = useRecoilValue(testCountAtom);
  const setIncreaseTestCount = useSetRecoilState(increaseTestCount);

  const onClickIncreaseButton = () => {
    setIncreaseTestCount(100);
  };

  const onClickBoardList = () => {
    void iricomAPI.getBoardList(0, 20, null);
  };

  return (
    <MainLayout>
      <Box>
        <div>{testCount?.count}</div>
        <ButtonGroup variant='outline' spacing={6}>
          <Button colorScheme='blue' onClick={onClickIncreaseButton}>increase</Button>
          <Button onClick={onClickBoardList}>GET BOARD LIST</Button>
        </ButtonGroup>
      </Box>
    </MainLayout>
  );
};

export default IndexPage;
