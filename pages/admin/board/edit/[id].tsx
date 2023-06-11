// react
import { ChangeEvent, useState, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Button, Card, Checkbox, FormControl, FormHelperText, FormLabel, Input, Textarea, VStack,
  useToast, CardBody, CardFooter, useMediaQuery, Box, Heading, Text, HStack, } from '@chakra-ui/react';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { NotExistBoardAlert, } from '../../../../components/alerts';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, Board, } from '../../../../interfaces';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../../../constants/style';

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

  const id = router.query.id as string;
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, { ssr: true, fallback: false, });
  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [board, setBoard,] = useState<Board | null>(null);
  const [title, setTitle,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');
  const [enabled, setEnabled,] = useState<boolean>(false);
  const [showAlert, setShowAlert,] = useState<boolean>(false);

  useEffect(() => {
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
      .catch(() => {
        setShowAlert(true);
      });
  }, [id,]);

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

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <PageBody>
        {board && <HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
          <Box marginLeft={isMobile ? '1rem' : '0'}>
            <Heading size='md' fontWeight='semibold'>{board.title}</Heading>
            <Text fontSize='xs'>{board.description}</Text>
          </Box>
        </HStack>}
        <Card
          shadow={isMobile ? 'none' : 'sm'}
          borderRadius={isMobile ? '0' : BORDER_RADIUS}
        >
          <CardBody>
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
          </CardBody>
          <CardFooter justifyContent='flex-end'>
            <Button isDisabled={pageState !== PageState.VALID} onClick={onClickEdit}>수정</Button>
          </CardFooter>
        </Card>
      </PageBody>
      {<NotExistBoardAlert isOpen={showAlert} onClose={onCloseAlert}/>}
    </MainLayout>
  );
};

export default AdminBoardEditIdPage;
