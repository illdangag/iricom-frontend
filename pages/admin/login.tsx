// react
import { ChangeEvent, KeyboardEvent, useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Button, Card, CardBody, CardHeader, Container, Flex, Heading, Image, Input, Spacer, Stack, useToast, } from '@chakra-ui/react';
import { MdLogin, } from 'react-icons/md';

import { EmptyLayout, } from '@root/layouts';
import { useEmailAuth, } from '@root/hooks';
import { TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';

enum PageState {
  READY,
  PRE_REQUEST,
  REQUEST,
  SUCCESS,
  FAIL,
}

const LoginPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [authState, requestEmailAuth,] = useEmailAuth();

  const [email, setEmail,] = useState<string>('');
  const [password, setPassword,] = useState<string>('');
  const [pageState, setPageState,] = useState<PageState>(PageState.READY);

  useEffect(() => {
    if (email !== '' && password !== '') {
      setPageState(PageState.PRE_REQUEST);
    } else {
      setPageState(PageState.READY);
    }
  }, [email, password,]);

  useEffect(() => {
    if (authState === 'success') {
      setPageState(PageState.SUCCESS);
      toast({
        title: '로그인 되었습니다.',
        status: 'success',
        duration: 3000,
      });

      const success = router.query.success;
      if (typeof success === 'string') {
        window.location.replace(decodeURIComponent(success));
      } else {
        window.location.replace('/');
      }

    } else if (authState === 'fail') {
      setPageState(PageState.FAIL);
    }
  }, [authState,]);

  const onChangeEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onKeyUpPasswordInput = (event: KeyboardEvent) => {
    if (event.code === 'Enter') {
      void login();
    }
  };

  const onClickLogin = () => {
    void login();
  };

  const login = async () => {
    setPageState(PageState.REQUEST);
    void requestEmailAuth(email, password);
  };

  return (
    <EmptyLayout>
      <Flex flexDirection='column' height='100%'>
        <Spacer/>
        <Container>
          <Card maxWidth='32rem' marginLeft='auto' marginRight='auto'>
            <CardHeader>
              <Flex alignItems='flex-end'>
                <Image src='/static/images/login_logo.png' width='4rem' alt='login logo'/>
                <Spacer/>
                <Heading size='md' color='gray.600'>관리자 로그인</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <Stack spacing={6}>
                <Stack spacing={2}>
                  <Input
                    autoFocus
                    placeholder='아이디'
                    size='md'
                    isDisabled={pageState === PageState.REQUEST}
                    onChange={onChangeEmailInput}
                  />
                  <Input
                    type='password'
                    placeholder='비밀번호'
                    size='md'
                    isDisabled={pageState === PageState.REQUEST}
                    isInvalid={pageState === PageState.FAIL}
                    onChange={onChangePasswordInput}
                    onKeyUp={onKeyUpPasswordInput}
                  />
                </Stack>
                <Button
                  isLoading={pageState === PageState.REQUEST}
                  isDisabled={pageState !== PageState.PRE_REQUEST}
                  leftIcon={<MdLogin/>}
                  onClick={onClickLogin}
                >
                  로그인
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Container>
        <Spacer/>
      </Flex>
    </EmptyLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
