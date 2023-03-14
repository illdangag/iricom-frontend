// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, HStack, VStack, } from '@chakra-ui/react';
import { MdCreate, } from 'react-icons/md';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { PostListTable, } from '../../components';
import { RequireLoginAlert, RequireAccountDetailAlert, } from '../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../hooks';
// etc
import { AccountAuth, PostList, } from '../../interfaces';

const BoardsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [loginState, accountAuth,] = useAccountState();

  const boardId: string = router.query.boardId as string;
  const pageQuery: string = router.query.page as string;

  const PAGE_LIMIT: number = 10;

  const [postList, setPostList,] = useState<PostList | null>(null);
  const [page, setPage,] = useState<number>(1);
  const [showLoginAlert, setShowLoginAlert,] = useState<boolean>(false);
  const [showRegisteredAccountAlert, setShowRegisteredAccountAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
      setPage(page);
      void initPostList(boardId, page);
    }
  }, [router.isReady, pageQuery,]);

  const initPostList = async (boardId: string, page: number) => {
    const postList: PostList = await iricomAPI.getPostList(boardId, PAGE_LIMIT * (page - 1), PAGE_LIMIT, null);
    setPostList(postList);
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
      <VStack alignItems='stretch'>
        <HStack justifyContent='flex-end'>
          <Button size='sm' variant='outline' backgroundColor='gray.50' leftIcon={<MdCreate/>} onClick={onClickCreatePost}>글 쓰기</Button>
        </HStack>
        <Card shadow='none'>
          <CardBody>
            {postList && <PostListTable
              postList={postList}
              page={page}
              isShowPostState={false}
              onClickPagination={onClickPagination}
            />}
          </CardBody>
        </Card>
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
