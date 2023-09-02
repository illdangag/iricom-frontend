// reacts
import { useEffect, } from 'react';
import { GetServerSideProps, GetServerSidePropsResult, } from 'next/types';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '../layouts';
import BoardPostPreview from '../components/BoardPostPreview';
// etc
import { Account, Board, PostList, PostType, TokenInfo, } from '../interfaces';
import { BORDER_RADIUS, MAX_WIDTH, } from '../constants/style';
import iricomAPI from '../utils/iricomAPI';
import { getTokenInfoByCookies, } from '../utils';
// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../recoil';

type BoardPostList = {
  board: Board,
  postList: PostList,
}

type Props = {
  boardPostListList: BoardPostList[],
  account: Account | null,
}

const IndexPage = (props: Props) => {
  const boardPostListList: BoardPostList[] = props.boardPostListList;
  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
  }, []);

  return (
    <MainLayout>
      <PageBody>
        <VStack
          align='stretch'
          spacing='1rem'
          maxWidth={MAX_WIDTH}
        >
          {boardPostListList && boardPostListList.map((boardPostList, index) => {
            return <Card
              key={index}
              width='100%'
              shadow={{ base: 'none', md: 'sm', }}
              borderRadius={{ base: '0', md: BORDER_RADIUS, }}
            >
              <CardBody>
                <BoardPostPreview board={boardPostList.board} postList={boardPostList.postList} key={index}/>
              </CardBody>
            </Card>;
          })}
        </VStack>
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result: GetServerSidePropsResult<any> = {
    props: {},
  };

  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo !== null) {
    result.props.account = await iricomAPI.getMyAccount(tokenInfo);
  } else {
    result.props.account = null;
  }

  const boardList: Board[] = (await iricomAPI.getBoardList(tokenInfo, 0, 20, true)).boards;
  const boardPostListList: BoardPostList[] = [];
  for (const board of boardList) {
    const postList: PostList = await iricomAPI.getPostList(board.id, 0, 5, PostType.POST);
    boardPostListList.push({
      board: board,
      postList: postList,
    } as BoardPostList);
  }
  result.props.boardPostListList = JSON.parse(JSON.stringify(boardPostListList));

  return result;
};

export default IndexPage;
