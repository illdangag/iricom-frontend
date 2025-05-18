// react
import { ChangeEvent, useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, FormControl, FormLabel, Heading, HStack, Input, useToast, VStack, } from '@chakra-ui/react';

import { PageBody, } from '@root/layouts';
import MainLayout from '@root/layouts/MainLayout';
import { PageTitle, } from '@root/components';
import { useIricom, } from '@root/hooks';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, IricomError, IricomGetServerSideProps, PersonalMessageList, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';

enum PageState {
  INVALID,
  VALID,
  REQUEST,
  SUCCESS,
  FAIL,
}

type Props = {
  account: Account,
  unreadPersonalMessageList: PersonalMessageList,
}

const InfoEditPage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);

  const router = useRouter();

  const iricomAPI = useIricom();
  const toast = useToast();

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [nickname, setNickname,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');

  useEffect(() => {
    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
    setNickname(account.nickname);
    setDescription(account.description);
    setPageState(PageState.VALID);
  }, []);

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

      if (typeof router.query.redirect === 'string') {
        void router.push(decodeURIComponent(router.query.redirect));
      } else {
        void router.push('/info');
      }
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

export const getServerSideProps: GetServerSideProps = async (context: IricomGetServerSideProps) => {
  const tokenInfo: TokenInfo | null = context.req.data.tokenInfo;

  if (tokenInfo === null) {
    return {
      props: {},
      redirect: {
        statusCode: 307,
        destination: '/login?success=/info/edit',
      },
    };
  }

  return {
    props: {},
  };
};

export default InfoEditPage;
