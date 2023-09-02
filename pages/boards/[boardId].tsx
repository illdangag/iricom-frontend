// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, GetServerSidePropsResult, } from 'next/types';
import { Badge, Card, CardBody, VStack, } from '@chakra-ui/react';

import { PageBody, } from '../../layouts';
import MainLayout from '../../layouts/MainLayout';
import { NoContent, PostListTable, BoardTitle, } from '../../components';
import { RequireAccountDetailAlert, } from '../../components/alerts';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../recoil';

// etc
import { Account, Board, PostList, PostType, TokenInfo, } from '../../interfaces';
import { BORDER_RADIUS, } from '../../constants/style';
import iricomAPI from '../../utils/iricomAPI';
import { getTokenInfoByCookies, } from '../../utils';

const PAGE_LIMIT: number = 10;
const NOTIFICATION_PAGE_LIMIT: number = 5;

type Props = {
  account: Account | null,
  board: Board,
  postList: PostList,
  notificationList: PostList,
};

const BoardsPage = (props: Props) => {
  const router = useRouter();

  const boardId: string = router.query.boardId as string;

  const board = Object.assign(new Board(), props.board as Board);
  const postList = Object.assign(new PostList(), props.postList as PostList);
  const notificationList = Object.assign(new PostList(), props.notificationList as PostList);

  const [page, setPage,] = useState<number>(1);
  const [showRegisteredAccountAlert, setShowRegisteredAccountAlert,] = useState<boolean>(false);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
  }, []);

  const onCloseRegisteredAccountDetailAlert = () => {
    setShowRegisteredAccountAlert(false);
  };

  const onClickPagination = (page: number) => {
    setPage(page);
    void router.push(`/boards/${boardId}?page=${page}`);
  };

  return (
    <MainLayout>
      <PageBody>
        {/* 게시판 헤더 */}
        {board && <BoardTitle board={board} isShowCreateButton={true}/>}
        {/* 게시물 목록 */}
        <VStack align='stretch'>
          {/* 공지 사항 목록 */}
          {notificationList && notificationList.total > 0 && <Card
            shadow={{ base: 'none', md: 'sm', }}
            borderRadius={{ base: '0', md: BORDER_RADIUS, }}
          >
            <CardBody>
              <Badge fontSize='1rem' colorScheme='purple' marginBottom='0.5rem'>공지사항</Badge>
              <PostListTable
                postList={notificationList}
                page={1}
                isShowPagination={false}
                isShowPostState={false}
              />
            </CardBody>
          </Card>}
          {/* 게시물 목록 */}
          {postList && postList.total > 0 && <Card
            shadow={{ base: 'none', md: 'sm', }}
            borderRadius={{ base: '0', md: BORDER_RADIUS, }}
          >
            <CardBody>
              <PostListTable
                postList={postList}
                page={page}
                isShowPostState={false}
                onClickPagination={onClickPagination}
              />
            </CardBody>
          </Card>}
          {postList && postList.total === 0 && <>
            <NoContent message='게시물이 존재하지 않습니다.'/>
          </>}
        </VStack>
      </PageBody>
      <RequireAccountDetailAlert
        text='글을 쓰기 위해서는 계정 정보 등록이 필요합니다.'
        isOpen={showRegisteredAccountAlert}
        onClose={onCloseRegisteredAccountDetailAlert}
      />
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

  const boardId: string = context.query.boardId as string;
  const pageQuery: string | undefined = context.query.page as string;

  const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
  const skip: number = PAGE_LIMIT * (page - 1);
  const limit: number = PAGE_LIMIT;

  const board: Board = await iricomAPI.getBoard(tokenInfo, boardId);
  const postList: PostList = await iricomAPI.getPostList(boardId, skip, limit, PostType.POST);
  const notificationList: PostList = await iricomAPI.getPostList(boardId, 0, NOTIFICATION_PAGE_LIMIT, PostType.NOTIFICATION);

  result.props.board = JSON.parse(JSON.stringify(board));
  result.props.postList = JSON.parse(JSON.stringify(postList));
  result.props.notificationList = JSON.parse(JSON.stringify(notificationList));

  return result;
};

export default BoardsPage;
