import { ChangeEvent, useState, useEffect, KeyboardEvent, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, CardHeader, Heading, Image, Flex, Spacer, Stack, Input, Button, Container, } from '@chakra-ui/react';
import { MdLogin, } from 'react-icons/md';
import EmptyLayout, { LoginState, } from '../../layouts/EmptyLayout';

import { useEmailAuth, } from '../../hooks';
import { Account, } from '../../interfaces';
import { BrowserStorage, } from '../../utils';
import { useSetRecoilState, } from 'recoil';
import accountAtom from '../../recoil/account';

enum PageState {
  READY,
  PRE_REQUEST,
  REQUEST,
  SUCCESS,
  FAIL,
}

const LoginPage = () => {
  const router = useRouter();
  const [authState, token, refreshToken, requestEmailAuth,] = useEmailAuth();
  const [email, setEmail,] = useState<string>('');
  const [password, setPassword,] = useState<string>('');
  const [pageState, setPageState,] = useState<PageState>(PageState.READY);
  const setAccount = useSetRecoilState(accountAtom);

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
      const account: Account = {
        token,
        refreshToken,
      };
      BrowserStorage.setAccount(account);
      setAccount(account);
      void router.push('/');
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
    <EmptyLayout loginState={LoginState.LOGOUT}>
      <Flex flexDirection='column' height='100%'>
        <Spacer/>
        <Container>
          <Card maxWidth='32rem'>
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

export default LoginPage;
