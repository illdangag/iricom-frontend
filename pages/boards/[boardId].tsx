// react
import { useEffect, useRef, useState, } from 'react';
import { useRouter, } from 'next/router';
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, HStack, Text, } from '@chakra-ui/react';
import { MdCreate, } from 'react-icons/md';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { useAccountState, useIricomAPI, } from '../../hooks';
// etc
import { AccountAuth, Post, PostList, } from '../../interfaces';

const BoardsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [ loginState, accountAuth, ] = useAccountState();
  const loginCancelRef = useRef();
  const registeredAccountDetailCancelRef = useRef();

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

  const onClickLoginPage = () => {
    void router.push('/login?success=' + encodeURIComponent(`/boards/${boardId}/posts/create`));
  };

  const onClickRegisteredAccountDetailPage = () => {
    // TODO
    setShowRegisteredAccountAlert(false);
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

  const requiredAccountDetail = <AlertDialog
    motionPreset='slideInBottom'
    size='sm'
    leastDestructiveRef={registeredAccountDetailCancelRef}
    onClose={onCloseRegisteredAccountDetailAlert}
    isOpen={showRegisteredAccountAlert}
    isCentered
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>저런!</AlertDialogHeader>
      <AlertDialogCloseButton/>
      <AlertDialogBody>
        <Text>글을 쓰기 위해서는 계정 정보 등록이 필요합니다.</Text>
        <Text>계정 정보 등록 페이지로 이동 하시겠습니까?</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={registeredAccountDetailCancelRef} onClick={onClickRegisteredAccountDetailPage}>
          계정 등록 페이지로 이동
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;

  return (
    <MainLayout loginState={LoginState.ANY}>
      <HStack justifyContent='flex-end'>
        <Button size='sm' variant='outline' backgroundColor='gray.50' leftIcon={<MdCreate/>} onClick={onClickCreatePost}>글 쓰기</Button>
      </HStack>
      {requiredLogin}
      {requiredAccountDetail}
    </MainLayout>
  );
};

export default BoardsPage;
