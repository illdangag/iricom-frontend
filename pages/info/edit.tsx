// react
import { ChangeEvent, useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, FormControl, FormLabel, Heading, HStack, Input, VStack, useToast, } from '@chakra-ui/react';

import { PageBody, } from '@root/layouts';
import MainLayout from '@root/layouts/MainLayout';
import { PageTitle, } from '@root/components';
import { useIricomAPI, } from '@root/hooks';

// store
import { useRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, IricomError, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';

enum PageState {
  INVALID,
  VALID,
  REQUEST,
  SUCCESS,
  FAIL,
}

type Props = {
  account: Account | null,
}

const InfoEditPage = (props: Props) => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const toast = useToast();

  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [nickname, setNickname,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');

  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);
    setNickname(props.account.nickname);
    setDescription(props.account.description);
    setPageState(PageState.VALID);
  }, [router.isReady,]);


  const onChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onClickSave = async () => {
    setPageState(PageState.REQUEST);
    try {
      const account: Account = await iricomAPI.updateMyAccountInfo(nickname, description);
      setAccount(account);
      toast({
        title: '저장 하였습니다.',
        status: 'success',
        duration: 3000,
      });
      void router.push('/info');
    } catch (error) {
      const iricomError: IricomError = error as IricomError;
      const message: string = iricomError.message;
      toast({
        title: message,
        status: 'error',
        duration: 3000,
      });
      setPageState(PageState.FAIL);
    }
  };

  return (
    <MainLayout>
      <PageBody>
        <PageTitle
          title='내 정보 수정'
          descriptions={['닉네임 및 설명을 수정합니다',]}
        />
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardHeader>
            <HStack justifyContent='flex-start' height='2rem'>
              <Heading size='sm' color='gray.600'>{account ? account.email : ''}</Heading>
              {account && account.auth === AccountAuth.SYSTEM_ADMIN && <Badge>시스템 관리자</Badge>}
              {account && account.auth === AccountAuth.BOARD_ADMIN && <Badge>게시판 관리자</Badge>}
            </HStack>
          </CardHeader>
          <CardBody alignItems='stretch' paddingTop='0'>
            <VStack alignItems='stretch'>
              <FormControl>
                <FormLabel>닉네임</FormLabel>
                <Input autoFocus value={nickname} isDisabled={pageState === PageState.REQUEST} onChange={onChangeNickname}/>
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Input value={description} isDisabled={pageState === PageState.REQUEST} onChange={onChangeDescription}/>
              </FormControl>
            </VStack>
          </CardBody>
          <CardFooter justifyContent='flex-end' padding='0 0.8rem 0.8rem 0.8rem'>
            <ButtonGroup>
              <Button isDisabled={pageState === PageState.INVALID || pageState === PageState.REQUEST} onClick={onClickSave}>저장</Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const props : any = {};

  if (tokenInfo === null) {
    return {
      props: {},
      redirect: {
        statusCode: 307,
        destination: '/login?success=/info/edit',
      },
    };
  } else {
    props.account = await iricomAPI.getMyAccount(tokenInfo);
  }

  return {
    props: {
      ...props,
    },
  };
};

export default InfoEditPage;
