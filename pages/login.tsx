// react
import { useState, useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, CardHeader, Center, Container, Flex, Heading, Image, Spacer, useToast, } from '@chakra-ui/react';
import { FcGoogle, } from 'react-icons/fc';
import { EmptyLayout, } from '@root/layouts';
import { useGoogleAuth, } from '@root/hooks';

// etc
import { TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';

enum PageState {
  READY,
  REQUEST,
  SUCCESS,
  FAIL,
}

const LoginPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [authState, requestGoogleAuth,] = useGoogleAuth();
  const [pageState, setPageState,] = useState<PageState>(PageState.READY);

  const { success, } = router.query;

  useEffect(() => {
    if (authState === 'success') {
      setPageState(PageState.SUCCESS);
      toast({
        title: '로그인 되었습니다.',
        status: 'success',
        duration: 3000,
      });

      if (typeof success === 'string') {
        void router.replace(decodeURIComponent(success));
      } else {
        void router.replace('/');
      }
    } else if (authState === 'fail') {
      setPageState(PageState.FAIL);
    }
  }, [authState,]);

  const onClickSignInGoogle = () => {
    setPageState(PageState.REQUEST);
    void requestGoogleAuth();
  };

  return (
    <EmptyLayout>
      <Flex flexDirection='column' height='100%'>
        <Spacer/>
        <Container>
          <Card maxWidth='32rem' marginLeft='auto' marginRight='auto'>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo !== null) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } else {
    return {
      props: {},
    };
  }
};

export default LoginPage;
