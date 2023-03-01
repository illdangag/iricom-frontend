// react
import { useEffect, useState, useRef, } from 'react';
import { useRouter, } from 'next/router';
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Button, HStack, Text, } from '@chakra-ui/react';
import { MdCreate, } from 'react-icons/md';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { useAccountState, useIricomAPI, } from '../../hooks';
// etc
import { Post, PostList, } from '../../interfaces';

const BoardsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [ loginState, ] = useAccountState();
  const loginCancelRef = useRef();

  const { boardId, } = router.query;

  const [postList, setPostList,] = useState<Post[] | null>(null);
  const [showLoginAlert, setShowLoginAlert,] = useState<boolean>(false);

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

  const onClick = () => {
    if (loginState === LoginState.LOGIN) {
      void router.push(`/boards/${boardId}/posts/create`);
    } else {
      setShowLoginAlert(true);
    }
  };

  const onCloseLoginAlert = () => {
    setShowLoginAlert(false);
  };

  const onClickLoginPage = () => {
    void router.push('/login?success=' + encodeURIComponent(`/boards/${boardId}/posts/create`));
  };

  const requiredLogin = <AlertDialog
    motionPreset='slideInBottom'
    size='xs'
    leastDestructiveRef={loginCancelRef}
    onClose={onCloseLoginAlert}
    isOpen={showLoginAlert}
    isCentered
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>저런!</AlertDialogHeader>
      <AlertDialogCloseButton/>
      <AlertDialogBody>
        <Text>글을 쓰기 위해서는 로그인이 필요합니다.</Text>
        <Text>로그인 페이지로 이동 하시겠습니까?</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={loginCancelRef} onClick={onClickLoginPage}>
          로그인 페이지로 이동
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;

  return (
    <MainLayout loginState={LoginState.ANY}>
      <HStack justifyContent='flex-end'>
        <Button size='sm' variant='outline' backgroundColor='gray.50' leftIcon={<MdCreate/>} onClick={onClick}>글 쓰기</Button>
      </HStack>
      {requiredLogin}
    </MainLayout>
  );
};

export default BoardsPage;
