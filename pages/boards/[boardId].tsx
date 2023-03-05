// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Button, HStack, } from '@chakra-ui/react';
import { MdCreate, } from 'react-icons/md';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { RequireLoginAlert, RequireAccountDetailAlert, } from '../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../hooks';
// etc
import { AccountAuth, Post, PostList, } from '../../interfaces';

const BoardsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [loginState, accountAuth,] = useAccountState();

  const { boardId, } = router.query;

  const [postList, setPostList,] = useState<Post[] | null>(null);
  const [showLoginAlert, setShowLoginAlert,] = useState<boolean>(false);
  const [showRegisteredAccountAlert, setShowRegisteredAccountAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (typeof boardId === 'string') {
      void init(boardId);
    } else {
      // TODO 잘못된 요청 처리
    }
  }, []);

  const init = async (boardId: string) => {
    const postList: PostList = await iricomAPI.getPostList(boardId, 0, 20, null);
    setPostList(postList.posts);
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

  return (
    <MainLayout loginState={LoginState.ANY}>
      <HStack justifyContent='flex-end'>
        <Button size='sm' variant='outline' backgroundColor='gray.50' leftIcon={<MdCreate/>} onClick={onClickCreatePost}>글 쓰기</Button>
      </HStack>
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
