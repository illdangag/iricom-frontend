// react
import { ChangeEvent, useState, useRef, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Button, Card, Checkbox, Container, FormControl, FormHelperText, FormLabel, Heading, HStack, Input, Textarea, VStack,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody,
  AlertDialogFooter, useToast, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, Board, } from '../../../../interfaces';

enum PageState {
  INVALID,
  VALID,
  REQUEST,
  SUCCESS,
  FAIL,
}

const AdminBoardEditIdPage = () => {
  const router = useRouter();
  const toast = useToast();
  const iriconAPI = useIricomAPI();
  const alertCancelRef = useRef();

  const { id, } = router.query;

  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [board, setBoard,] = useState<Board | null>(null);
  const [title, setTitle,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');
  const [enabled, setEnabled,] = useState<boolean>(false);
  const [showAlert, setShowAlert,] = useState<boolean>(false);

  const onMount = () => {
    if (typeof id !== 'string') {
      // TODO path parameter가 올바르지 않은 경우
      return;
    }

    void iriconAPI.getBoard(id)
      .then(board => {
        setTitle(board.title);
        setDescription(board.description);
        setEnabled(board.enabled);
        setBoard(board);
      })
      .catch(error => {
        // TODO 예외 처리
        console.log(error);
        setShowAlert(true);
      });
  };

  useEffect(() => {
    if (board === null || title.length === 0) {
      setPageState(PageState.INVALID);
    } else {
      setPageState(PageState.VALID);
    }
  }, [board, title,]);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onChangeEnabled = (event: ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
  };

  const onClickEdit = () => {
    // TODO 수정 버튼 선택시 게시판 정보 수정 확인 과정
    updateBoard();
  };

  const updateBoard = () => {
    setPageState(PageState.REQUEST);

    const updateBoard: Board = {
      id: board.id,
      title: title,
      description: description,
      enabled: enabled,
    };

    void iriconAPI.updateBoard(updateBoard)
      .then(_board => {
        setPageState(PageState.SUCCESS);
        toast({
          title: '게시판을 수정하였습니다.',
          status: 'success',
          duration: 3000,
        });
        void router.push('/admin/board');
      })
      .catch(_error => {
        setPageState(PageState.FAIL);
      });
  };

  const onCloseAlert = () => {
    setShowAlert(false);
  };

  const notExistBoardAlert = <AlertDialog
    motionPreset='slideInBottom'
    size='xs'
    leastDestructiveRef={alertCancelRef}
    onClose={onCloseAlert}
    isOpen={showAlert}
    isCentered
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>저런!</AlertDialogHeader>
      <AlertDialogCloseButton/>
      <AlertDialogBody>
        존재하지 않는 게시판입니다.
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={alertCancelRef} onClick={onCloseAlert}>
          닫기
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN} onMount={onMount}>
      <VStack>
        <Container width='100%' maxWidth='none' margin='0' padding='0'>
          <Heading as='h1' size='sm'>게시판 수정</Heading>
        </Container>
        <Card width='100%' padding='0.8rem' shadow='none'>
          <VStack spacing='1.8rem'>
            <FormControl isRequired>
              <FormLabel>제목</FormLabel>
              <Input autoFocus value={title} onChange={onChangeTitle} isDisabled={board === null || pageState === PageState.REQUEST}/>
            </FormControl>
            <FormControl>
              <FormLabel>설명</FormLabel>
              <Textarea placeholder='설명을 입력해주세요.' value={description} onChange={onChangeDescription} isDisabled={board === null || pageState === PageState.REQUEST}/>
            </FormControl>
            <FormControl>
              {board === null && <Checkbox isDisabled>활성화</Checkbox>}
              {board !== null && <Checkbox defaultChecked={board.enabled} checked={true} onChange={onChangeEnabled} isDisabled={pageState === PageState.REQUEST}>활성화</Checkbox>}
              <FormHelperText>비활성화 게시판은 사용자에게 나타나지 않으며, 게시물 작성 및 댓글 작성이 불가능합니다.</FormHelperText>
            </FormControl>
          </VStack>
          <HStack marginTop='1rem' justifyContent='flex-end'>
            <Button isDisabled={pageState !== PageState.VALID} onClick={onClickEdit}>수정</Button>
          </HStack>
        </Card>
      </VStack>
      {notExistBoardAlert}
    </MainLayout>
  );
};

export default AdminBoardEditIdPage;
