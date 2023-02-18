import { useState, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, CardHeader, Center, Container, Flex, Heading, Image, Spacer, } from '@chakra-ui/react';
import { FcGoogle, } from 'react-icons/fc';
import EmptyLayout, { LoginState, } from '../layouts/EmptyLayout';
import { useGoogleAuth, } from '../hooks';
import { Account, } from '../interfaces';
import { BrowserStorage, } from '../utils';
import { useSetRecoilState, } from 'recoil';
import accountAtom from '../recoil/account';

enum PageState {
  READY,
  REQUEST,
  SUCCESS,
  FAIL,
}

const LoginPage = () => {
  const router = useRouter();
  const [authState, token, refreshToken, requestGoogleAuth,] = useGoogleAuth();
  const [pageState, setPageState,] = useState<PageState>(PageState.READY);
  const setAccount = useSetRecoilState(accountAtom);

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

  const onClickSignInGoogle = () => {
    setPageState(PageState.REQUEST);
    void requestGoogleAuth();
  };

  return (
    <EmptyLayout loginState={LoginState.LOGOUT}>
      <Flex flexDirection='column' height='100%'>
        <Spacer/>
        <Container>
          <Card maxWidth='32rem'>
            <CardHeader>
              <Flex flexDirection='column' align='center'>
                <Image src='/static/images/login_logo.png' width='8rem' alt='login logo'/>
                <Heading size='xl' color='gray.600'>이리콤</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <Center>
                <Button
                  leftIcon={<FcGoogle/>}
                  onClick={onClickSignInGoogle}
                  isDisabled={pageState === PageState.REQUEST || pageState === PageState.SUCCESS}
                  isLoading={pageState === PageState.REQUEST}
                >
                  Google 계정으로 계속하기
                </Button>
              </Center>
            </CardBody>
          </Card>
        </Container>
        <Spacer/>
      </Flex>
    </EmptyLayout>
  );
};

export default LoginPage;
