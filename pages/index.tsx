// react
import { useEffect, useState, } from 'react';
import { VStack, } from '@chakra-ui/react';
import { MainLayout, } from '../layouts';
import { useIricomAPI, } from '../hooks';
// etc
import { Board, } from '../interfaces';
import BoardPostPreview from '../components/BoardPostPreview';

const IndexPage = () => {
  const iricomAPI = useIricomAPI();

  const [boardList, setBoardList,] = useState<Board[] | null>(null);

  useEffect(() => {
    void iricomAPI.getBoardList(0, 20, true)
      .then(boardList => {
        setBoardList(boardList.boards);
      });
  }, []);

  return (
    <MainLayout>
      <VStack alignItems='stretch' spacing='1rem' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' maxWidth='60rem'>
        {boardList && boardList.map((board, index) =>
          <BoardPostPreview board={board} key={index}/>)
        }
      </VStack>
    </MainLayout>
  );
};

export default IndexPage;
