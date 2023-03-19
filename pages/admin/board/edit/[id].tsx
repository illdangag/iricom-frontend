// react
import { ChangeEvent, useState, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Button, Card, Checkbox, FormControl, FormHelperText, FormLabel, Input, Textarea, VStack,
  useToast, CardBody, CardFooter, Breadcrumb, BreadcrumbItem, BreadcrumbLink, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { NotExistBoardAlert, } from '../../../../components/alerts';
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

  const id = router.query.id as string;

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
      <Card shadow='none' borderRadius='0' marginBottom='1rem'>
        <CardBody>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>이리콤</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/board'>게시판 설정</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/board/edit'>수정</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              {board && <BreadcrumbLink href={`/admin/board/edit/${id}`}>{board.title}</BreadcrumbLink>}
            </BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>
      <VStack alignItems='stretch' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' spacing='1rem' maxWidth='60rem'>
        <Card shadow='none'>
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
      </VStack>
      {<NotExistBoardAlert isOpen={showAlert} onClose={onCloseAlert}/>}
    </MainLayout>
  );
};

export default AdminBoardEditIdPage;
