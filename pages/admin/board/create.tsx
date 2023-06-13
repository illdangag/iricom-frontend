// react
import { ChangeEvent, useState, } from 'react';
import { useRouter, } from 'next/router';
import { VStack, Card, Input, FormControl, FormLabel, FormHelperText, Checkbox, Textarea, CardBody, CardFooter,
  Button, useToast, } from '@chakra-ui/react';
import { PageBody, } from '../../../layouts';
import MainLayout, { LoginState, } from '../../../layouts/MainLayout';
import useIricomAPI from '../../../hooks/useIricomAPI';
// etc
import { AccountAuth, } from '../../../interfaces';
import { BORDER_RADIUS, } from '../../../constants/style';
import { PageTitle, } from '../../../components';

enum PageState {
  READY,
  PRE_REQUEST,
  REQUEST,
  SUCCESS,
  FAIL,
}

const AdminBoardCreatePage = () => {
  const router = useRouter();
  const toast = useToast();
  const iricomAPI = useIricomAPI();

  const [pageState, setPageState,] = useState<PageState>(PageState.READY);
  const [title, setTitle,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');
  const [enabled, setEnabled,] = useState<boolean>(false);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (value.length > 0) {
      setPageState(PageState.PRE_REQUEST);
    } else {
      setPageState(PageState.READY);
    }
    setTitle(value);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onChangeEnabled = (event: ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
  };

  const onClickCreate = () => {
    setPageState(PageState.REQUEST);
    void iricomAPI.createBoard(title, description, enabled)
      .then(() => {
        setPageState(PageState.SUCCESS);
        toast({
          title: '게시판을 생성하였습니다.',
          status: 'success',
          duration: 3000,
        });
        void router.push('/admin/board');
      })
      .catch(() => {
        setPageState(PageState.FAIL);
        toast({
          title: '게시판 생성에 실패하였습니다.',
          status: 'error',
          duration: 3000,
        });
      });
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <PageBody>
        <PageTitle
          title='게시판 생성'
          descriptions={['새로운 게시판을 생성합니다.',]}
        />
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <VStack spacing='1rem'>
              <FormControl isRequired>
                <FormLabel>제목</FormLabel>
                <Input autoFocus value={title} onChange={onChangeTitle}/>
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea placeholder='설명을 입력해주세요.' value={description} onChange={onChangeDescription}/>
              </FormControl>
              <FormControl>
                <Checkbox defaultChecked={false} checked={enabled} onChange={onChangeEnabled}>활성화</Checkbox>
                <FormHelperText>비활성화 게시판은 사용자에게 나타나지 않으며, 게시물 작성 및 댓글 작성이 불가능합니다.</FormHelperText>
              </FormControl>
            </VStack>
          </CardBody>
          <CardFooter justifyContent='flex-end'>
            <Button
              isDisabled={pageState === PageState.READY || pageState === PageState.REQUEST}
              isLoading={pageState === PageState.REQUEST}
              onClick={onClickCreate}
            >
              생성
            </Button>
          </CardFooter>
        </Card>
      </PageBody>
    </MainLayout>
  );
};

export default AdminBoardCreatePage;
