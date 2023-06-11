// react
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, useMediaQuery, VStack, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '../layouts';
// etc
import { Board, PostList, PostType, } from '../interfaces';
import BoardPostPreview from '../components/BoardPostPreview';
import { BORDER_RADIUS, MAX_WIDTH, MOBILE_MEDIA_QUERY, } from '../constants/style';
import iricomAPI from '../utils/iricomAPI';

type BoardPostList = {
  board: Board,
  postList: PostList,
}

type Props = {
  boardPostListList: BoardPostList[],
}

const IndexPage = (props: Props) => {
  const boardPostListList: BoardPostList[] = props.boardPostListList;
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, { ssr: true, fallback: false, });

  return (
    <MainLayout>
      <PageBody>
        <VStack
          alignItems='stretch'
          spacing='1rem'
          maxWidth={MAX_WIDTH}
        >
          {boardPostListList && boardPostListList.map((boardPostList, index) =>
            <Card
              key={index}
              width='100%'
              shadow={isMobile ? 'none' : 'sm'}
              borderRadius={isMobile ? '0' : BORDER_RADIUS}
            >
              <CardBody>
                <BoardPostPreview board={boardPostList.board} postList={boardPostList.postList} key={index}/>
              </CardBody>
            </Card>)}
        </VStack>
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const boardList: Board[] = (await iricomAPI.getBoardList(0, 20, true)).boards;
  const boardPostListList: BoardPostList[] = [];
  for (const board of boardList) {
    const postList: PostList = await iricomAPI.getPostList(board.id, 0, 5, PostType.POST);
    boardPostListList.push({
      board: board,
      postList: postList,
    } as BoardPostList);
  }

  return {
    props: {
      boardPostListList: JSON.parse(JSON.stringify(boardPostListList)),
    },
  };
};

export default IndexPage;
