// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, HStack, VStack, Alert, AlertIcon, Text, Box, Heading, Breadcrumb, BreadcrumbItem, BreadcrumbLink, } from '@chakra-ui/react';
import { MdCreate, } from 'react-icons/md';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { PostListTable, } from '../../components';
import { RequireAccountDetailAlert, RequireLoginAlert, } from '../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../hooks';
// etc
import { AccountAuth, Board, PostList, PostType, } from '../../interfaces';

const BoardsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [loginState, accountAuth,] = useAccountState();

  const boardId: string = router.query.boardId as string;
  const pageQuery: string = router.query.page as string;

  const PAGE_LIMIT: number = 10;

  const [board, setBoard,] = useState<Board | null>(null);
  const [postList, setPostList,] = useState<PostList | null>(null);
  const [notificationList, setNotificationList,] = useState<PostList | null>(null);

  const [page, setPage,] = useState<number>(1);
  const [showLoginAlert, setShowLoginAlert,] = useState<boolean>(false);
  const [showRegisteredAccountAlert, setShowRegisteredAccountAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
      setPage(page);

      void initBoard(boardId);
      void initPostList(boardId, page);
      void initNotificationList(boardId);
    }
  }, [router.isReady, pageQuery,]);

  const initBoard = async (boardId: string) => {
    const board: Board = await iricomAPI.getBoard(boardId);
    setBoard(board);
  };

  const initPostList = async (boardId: string, page: number) => {
    const postList: PostList = await iricomAPI.getPostList(boardId, PAGE_LIMIT * (page - 1), PAGE_LIMIT, PostType.POST);
    setPostList(postList);
  };

  const initNotificationList = async (boardId: string) => {
    const notificationList: PostList = await iricomAPI.getPostList(boardId, 0, 5, PostType.NOTIFICATION);
    setNotificationList(notificationList);
  };

  const onClickCreatePost = () => {
    if (loginState === LoginState.LOGOUT) {
      setShowLoginAlert(true);
    } else if (accountAuth === AccountAuth.UNREGISTERED_ACCOUNT) {
      setShowRegisteredAccountAlert(true);
    } else {
      void router.push(`/boards/${boardId}/posts/create`);
    }
  };

  const onCloseLoginAlert = () => {
    setShowLoginAlert(false);
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
      {/* 게시판 헤더 */}
      <Card shadow='none' borderRadius='0'>
        {board && <CardBody paddingTop='.6rem' paddingBottom='.6rem'>
          <HStack justifyContent='space-between'>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>이리콤</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href='#'>{board.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Button size='xs' variant='outline' backgroundColor='gray.50' leftIcon={<MdCreate/>} onClick={onClickCreatePost}>글 쓰기</Button>
          </HStack>
        </CardBody>}
      </Card>
      {/* 게시물 목록 */}
      <VStack alignItems='stretch' spacing='0'>
        {/* 공지 사항 목록 */}
        {notificationList && notificationList.total > 0 && <Card shadow='none' borderRadius='0'>
          <CardBody paddingTop='0'>
            <PostListTable
              postList={notificationList}
              page={1}
              isShowPagination={false}
              isShowPostState={false}
            />
          </CardBody>
        </Card>}
        {/* 게시물 목록 */}
        <Box paddingTop='1rem'>
          <Card shadow='none' borderRadius='0'>
            <CardBody>
              {postList && postList.total === 0 && <>
                <Alert status='info' borderRadius='.375rem'>
                  <Text>게시판에 게시물이 없습니다.</Text>
                </Alert>
              </>}
              {postList && postList.total > 0 && <PostListTable
                postList={postList}
                page={page}
                isShowPostState={false}
                onClickPagination={onClickPagination}
              />}
            </CardBody>
          </Card>
        </Box>
      </VStack>
      <RequireLoginAlert
        text='글을 쓰기 위해서는 로그인이 필요합니다.'
        successURL={`/boards/${boardId}/posts/create`}
        isOpen={showLoginAlert}
        onClose={onCloseLoginAlert}
      />
      <RequireAccountDetailAlert
        text='글을 쓰기 위해서는 계정 정보 등록이 필요합니다.'
        isOpen={showRegisteredAccountAlert}
        onClose={onCloseRegisteredAccountDetailAlert}
      />
    </MainLayout>
  );
};

export default BoardsPage;
