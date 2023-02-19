import { Button, ButtonGroup, Box, } from '@chakra-ui/react';
import { MainLayout, } from '../layouts';

import { useRecoilValue, useSetRecoilState, } from 'recoil';
import testCountAtom, { increaseTestCount, } from '../recoil/testCount';

import { BrowserStorage, } from '../utils';
import { getBoardList, } from '../utils/IricomAPI';
import { SessionInfo, } from '../interfaces';

const IndexPage = () => {
  const testCount = useRecoilValue(testCountAtom);
  const setIncreaseTestCount = useSetRecoilState(increaseTestCount);

  const onClickIncreaseButton = () => {
    setIncreaseTestCount(100);
  };

  const onClickBoardList = () => {
    const sessionInfo: SessionInfo = BrowserStorage.getSessionInfo();
    void getBoardList(sessionInfo.tokenInfo, 0, 20, null)
      .catch(error => {
        console.log(error);
      });
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
