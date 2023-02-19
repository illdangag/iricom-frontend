import { useState, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, CardHeader, Center, Container, Flex, Heading, Image, Spacer, useToast, } from '@chakra-ui/react';
import { FcGoogle, } from 'react-icons/fc';
import EmptyLayout, { LoginState, } from '../layouts/EmptyLayout';

import { useGoogleAuth, } from '../hooks';
import { SessionInfo, } from '../interfaces';
import { getMyAccountInfo, } from '../utils/IricomAPI';

import { BrowserStorage, } from '../utils';
import { useSetRecoilState, } from 'recoil';
import sessionInfoAtom from '../recoil/sessionInfo';

enum PageState {
  READY,
  REQUEST,
  SUCCESS,
  FAIL,
}

const LoginPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [authState, tokenInfo, requestGoogleAuth,] = useGoogleAuth();

  const setSessionInfo = useSetRecoilState<SessionInfo>(sessionInfoAtom);
  const [pageState, setPageState,] = useState<PageState>(PageState.READY);

  useEffect(() => {
    if (authState === 'success') {
      setPageState(PageState.SUCCESS);
      void getMyAccountInfo(tokenInfo)
        .then(myInformation => {
          const sessionInfo: SessionInfo = {
            tokenInfo,
            myInformation,
          };
          setSessionInfo(sessionInfo);
          BrowserStorage.setSessionInfo(sessionInfo);
          toast({
            title: '로그인 되었습니다.',
            status: 'success',
            duration: 3000,
          });
          void router.push('/');
        });
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
