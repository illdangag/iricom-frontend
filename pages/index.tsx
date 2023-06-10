// react
import { useEffect, useState, } from 'react';
import { Card, CardBody, useMediaQuery, VStack, } from '@chakra-ui/react';
import { MainLayout, } from '../layouts';
import { useIricomAPI, } from '../hooks';
// etc
import { Board, } from '../interfaces';
import BoardPostPreview from '../components/BoardPostPreview';
import { MOBILE_MEDIA_QUERY, MAX_WIDTH, BORDER_RADIUS, } from '../constants/style';

const IndexPage = () => {
  const iricomAPI = useIricomAPI();

  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, {
    ssr: true,
    fallback: false,
  });

  const [boardList, setBoardList,] = useState<Board[] | null>(null);

  useEffect(() => {
    void iricomAPI.getBoardList(0, 20, true)
      .then(boardList => {
        setBoardList(boardList.boards);
      });
  }, []);

  return (
    <MainLayout>
      {/*<VStack alignItems='stretch' spacing='1rem' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' maxWidth='60rem'>*/}
      <VStack
        alignItems='stretch'
        spacing='1rem'
        marginLeft={isMobile ? '0' : 'auto'}
        marginRight={isMobile ? '0' : 'auto'}
        paddingLeft={isMobile ? '0' : '1rem'}
        paddingRight={isMobile ? '0' : '1rem'}
        maxWidth={MAX_WIDTH}
      >
        {boardList && boardList.map((board, index) =>
          <Card width='100%' shadow={isMobile ? 'none' : 'sm'} borderRadius={isMobile ? '0' : BORDER_RADIUS}>
            <CardBody>
              <BoardPostPreview board={board} key={index}/>
            </CardBody>
          </Card>)}
      </VStack>
    </MainLayout>
  );
};

export default IndexPage;
