// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Text, Button, Card, CardBody, HStack, VStack, Box, Badge, BreadcrumbItem, BreadcrumbLink, Link, useMediaQuery, Heading, } from '@chakra-ui/react';
import { MdCreate, } from 'react-icons/md';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { PageBody, } from '../../layouts';
import { PostListTable, NoContent, } from '../../components';
import { RequireAccountDetailAlert, } from '../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../hooks';
// recoil
import { useSetRecoilState, } from 'recoil';
import { RequireLoginPopup, setPopupSelector as setRequireLoginPopupSelector, } from '../../recoil/requireLoginPopup';
// etc
import { AccountAuth, Board, PostList, PostType, } from '../../interfaces';
import { BORDER_RADIUS, MAX_WIDTH, MOBILE_MEDIA_QUERY, } from '../../constants/style';
import NextLink from 'next/link';

const BoardsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [loginState, accountAuth,] = useAccountState();

  const boardId: string = router.query.boardId as string;
  const pageQuery: string = router.query.page as string;

  const PAGE_LIMIT: number = 10;

  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, {
    ssr: true,
    fallback: false,
  });
  const [board, setBoard,] = useState<Board | null>(null);
  const [postList, setPostList,] = useState<PostList | null>(null);
  const [notificationList, setNotificationList,] = useState<PostList | null>(null);

  const [page, setPage,] = useState<number>(1);
  const [showRegisteredAccountAlert, setShowRegisteredAccountAlert,] = useState<boolean>(false);

  const setRequirePopup = useSetRecoilState<RequireLoginPopup>(setRequireLoginPopupSelector);

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
        <HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
          {board && <>
            <Box
              marginLeft={isMobile ? '1rem' : '0'}
            >
              <Heading size='md' fontWeight='semibold'>{board.title}</Heading>
              <Text fontSize='xs'>{board.description}</Text>
            </Box>
            <Link as={NextLink} href={`/boards/${boardId}/posts/create`}>
              <Button
                size='xs'
                variant='outline'
                backgroundColor='white'
                leftIcon={<MdCreate/>}
                marginRight={isMobile ? '1rem' : '0'}
              >
                글 쓰기
              </Button>
            </Link>
          </>}
        </HStack>
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

export default BoardsPage;
