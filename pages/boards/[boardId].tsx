// react
import { useState, } from 'react';
import { useRouter, } from 'next/router';
import { Badge, Card, CardBody, useMediaQuery, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { PageBody, } from '../../layouts';
import { NoContent, PostListTable, } from '../../components';
import { RequireAccountDetailAlert, } from '../../components/alerts';
import { useAccountState, } from '../../hooks';
// recoil
import { useSetRecoilState, } from 'recoil';
import { RequireLoginPopup, setPopupSelector as setRequireLoginPopupSelector, } from '../../recoil/requireLoginPopup';
// etc
import { AccountAuth, Board, PostList, PostType, } from '../../interfaces';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../constants/style';
import BoarderHeader from '../../components/BoardHeader';
import { GetServerSideProps, } from 'next/types';
import iricomAPI from '../../utils/iricomAPI';

const PAGE_LIMIT: number = 10;
const NOTIFICATION_PAGE_LIMIT: number = 5;

type Props = {
  board: Board,
  postList: PostList,
  notificationList: PostList,
};

const BoardsPage = (props: Props) => {
  const router = useRouter();
  const [loginState, accountAuth,] = useAccountState();

  const boardId: string = router.query.boardId as string;

  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, { ssr: true, fallback: false, });

  const board = Object.assign(new Board(), props.board as Board);
  const postList = Object.assign(new PostList(), props.postList as PostList);
  const notificationList = Object.assign(new PostList(), props.notificationList as PostList);

  const [page, setPage,] = useState<number>(1);
  const [showRegisteredAccountAlert, setShowRegisteredAccountAlert,] = useState<boolean>(false);

  const setRequirePopup = useSetRecoilState<RequireLoginPopup>(setRequireLoginPopupSelector);

  const onClickCreatePost = () => {
    if (loginState === LoginState.LOGOUT) {
      setRequirePopup({
        isShow: true,
        message: '글을 쓰기 위해서는 로그인이 필요합니다.',
        successURL: `/boards/${boardId}/posts/create`,
      });
    } else if (accountAuth === AccountAuth.UNREGISTERED_ACCOUNT) {
      setShowRegisteredAccountAlert(true);
    } else {
      void router.push(`/boards/${boardId}/posts/create`);
    }
  };

  const onCloseRegisteredAccountDetailAlert = () => {
    setShowRegisteredAccountAlert(false);
  };

  const onClickPagination = (page: number) => {
    setPage(page);
    void router.push(`/boards/${boardId}?page=${page}`);
  };

  return (
    <MainLayout loginState={LoginState.ANY}>
      <PageBody>
        {/* 게시판 헤더 */}
        {board && <BoarderHeader board={board} isShowCreateButton={true}/>}
        {/* 게시물 목록 */}
        <VStack alignItems='stretch'>
          {/* 공지 사항 목록 */}
          {notificationList && notificationList.total > 0 && <Card
            shadow={isMobile ? 'none' : 'sm'}
            borderRadius={isMobile ? '0' : BORDER_RADIUS}
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
            shadow={isMobile ? 'none' : 'sm'}
            borderRadius={isMobile ? '0' : BORDER_RADIUS}
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
  const boardId: string = context.query.boardId as string;
  const pageQuery: string | undefined = context.query.page as string;
  const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
  const skip: number = PAGE_LIMIT * (page - 1);
  const limit: number = PAGE_LIMIT;

  const board: Board = await iricomAPI.getBoard(boardId);
  const postList: PostList = await iricomAPI.getPostList(boardId, skip, limit, PostType.POST);
  const notificationList: PostList = await iricomAPI.getPostList(boardId, 0, NOTIFICATION_PAGE_LIMIT, PostType.NOTIFICATION);

  return {
    props: {
      board: JSON.parse(JSON.stringify(board)),
      postList: JSON.parse(JSON.stringify(postList)),
      notificationList: JSON.parse(JSON.stringify(notificationList)),
    },
  };
};

export default BoardsPage;
