// react
import { ChangeEvent, useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Button, Card, CardBody, CardFooter, Checkbox, FormControl, FormHelperText, FormLabel, Input, Textarea, useToast, VStack, } from '@chakra-ui/react';

import { PageBody, } from '@root/layouts';
import MainLayout from '@root/layouts/MainLayout';
import useIricom from '@root/hooks/useIricom';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import { PageTitle, } from '@root/components';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';

enum PageState {
  READY,
  PRE_REQUEST,
  REQUEST,
  SUCCESS,
  FAIL,
}

type Props = {
  account: Account | null,
}

const AdminBoardCreatePage = (props: Props) => {
  const router = useRouter();
  const toast = useToast();
  const iricomAPI = useIricom();

  const [pageState, setPageState,] = useState<PageState>(PageState.READY);
  const [title, setTitle,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');
  const [enabled, setEnabled,] = useState<boolean>(false);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
  }, []);

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
        void router.push('/admin');
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
    <MainLayout>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      notFound: true,
    };
  }

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  if (account.auth !== AccountAuth.SYSTEM_ADMIN) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      account,
    },
  };
};

export default AdminBoardCreatePage;
