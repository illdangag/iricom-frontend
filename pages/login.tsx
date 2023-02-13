import { useState, } from 'react';
import { Flex, Spacer, Container, Card, CardHeader, CardBody, Image, Center, Heading, Button, } from '@chakra-ui/react';
import { FcGoogle, } from 'react-icons/fc';

import { initializeApp, FirebaseOptions, FirebaseApp, } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, UserCredential, } from 'firebase/auth';
import { Account, FirebaseProperties, } from '../interfaces';
import { BrowserStorage, } from '../utils';

const LoginPage = () => {
  const [isLogin, setLogin,] = useState<boolean>(false);

  const onClickSignInGoogle = async () => {
    setLogin(true);
    let account: Account;
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
      const userCredential: UserCredential = await signInWithPopup(auth, googleAuthProvider);
      const token: string = await userCredential.user.getIdToken();
      const refreshToken: string = userCredential.user.refreshToken;
      account = {
        token,
        refreshToken,
      };
    } catch (error) {
      setLogin(false);
    }

    if (account) {
      BrowserStorage.setAccount(account);
    }
  };

  return (
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
              <Button leftIcon={<FcGoogle/>} onClick={onClickSignInGoogle} isDisabled={isLogin}>Google 계정으로 계속하기</Button>
            </Center>
          </CardBody>
        </Card>
      </Container>
      <Spacer/>
    </Flex>
  );
};

export default LoginPage;
