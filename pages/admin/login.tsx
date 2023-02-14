import { ChangeEvent, useState, useEffect, useRef, KeyboardEvent, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, CardHeader, Heading, Image, Flex, Spacer, Stack, Input, Button, Container, } from '@chakra-ui/react';
import { MdLogin, } from 'react-icons/md';
import EmptyLayout, { LoginState, } from '../../layouts/EmptyLayout';

import { initializeApp, FirebaseOptions, FirebaseApp, } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth, UserCredential, signInWithEmailAndPassword, } from 'firebase/auth';
import { FirebaseProperties, Account, } from '../../interfaces';
import { BrowserStorage, } from '../../utils';

enum PageState {
  NONE,
  READY,
  REQUEST,
  FAIL,
}

const LoginPage = () => {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [id, setId,] = useState<string>('');
  const [password, setPassword,] = useState<string>('');
  const [state, setState,] = useState<PageState>(PageState.NONE);

  useEffect(() => {
    if (id !== '' && password !== '') {
      setState(PageState.READY);
    } else {
      setState(PageState.NONE);
    }
  }, [id, password,]);

  useEffect(() => {
    if (state === PageState.FAIL) {
      passwordRef.current?.focus();
    }
  }, [state,]);

  const onChangeIdInput = (event: ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
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
    setState(PageState.REQUEST);
    const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;
    const firebaseOptions: FirebaseOptions = {
      projectId: firebaseProperties.projectId,
      apiKey: firebaseProperties.apiKey,
      authDomain: firebaseProperties.authDomain,
    };
    const firebaseApp: FirebaseApp = initializeApp(firebaseOptions);
    const auth: Auth = getAuth(firebaseApp);
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setDefaultLanguage('ko');
    googleAuthProvider.setCustomParameters({
      login_hint: 'user@example.com',
    });

    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, id, password);
      const token: string = await userCredential.user.getIdToken();
      const refreshToken: string = userCredential.user.refreshToken;
      const account: Account = {
        token,
        refreshToken,
      } as Account;
      BrowserStorage.setAccount(account);
      void router.push('/');
    } catch (error) {
      setState(PageState.FAIL);
    }
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
                    isDisabled={state === PageState.REQUEST}
                    onChange={onChangeIdInput}
                  />
                  <Input
                    ref={passwordRef}
                    type='password'
                    placeholder='비밀번호'
                    size='md'
                    isDisabled={state === PageState.REQUEST}
                    isInvalid={state === PageState.FAIL}
                    onChange={onChangePasswordInput}
                    onKeyUp={onKeyUpPasswordInput}
                  />
                </Stack>
                <Button
                  isDisabled={state === PageState.NONE || state === PageState.REQUEST}
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
