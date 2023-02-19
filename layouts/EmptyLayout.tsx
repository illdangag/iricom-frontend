import { ReactNode, useEffect, useState, } from 'react';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { useToast, } from '@chakra-ui/react';
import { AccountAuth, SessionInfo, } from '../interfaces';
import { BrowserStorage, } from '../utils';
import { useSetRecoilState, } from 'recoil';
import sessionInfoAtom from '../recoil/sessionInfo';

enum LoginState {
  LOGIN,
  LOGOUT,
  ANY,
}

type Props = {
  children?: ReactNode,
  title?: string,
  loginState?: LoginState,
  auth?: AccountAuth,
};

const EmptyLayout = ({
  children,
  title = 'Welcome | iricom',
  loginState = LoginState.ANY,
  auth = null,
}: Props) => {
  const router = useRouter();
  const toast = useToast();

  const setSessionInfo = useSetRecoilState<SessionInfo>(sessionInfoAtom);
  const [isValid, setValid,] = useState<boolean>(false);

  useEffect(() => {
    const sessionInfo: SessionInfo = BrowserStorage.getSessionInfo();
    setSessionInfo(sessionInfo);
  }, []);

  useEffect(() => {
    const sessionInfo: SessionInfo | null = BrowserStorage.getSessionInfo();
    if (loginState === LoginState.ANY
      || loginState === LoginState.LOGIN && sessionInfo !== null
      || loginState === LoginState.LOGOUT && sessionInfo === null) {

      if (auth !== null) {
        if (sessionInfo === null) {
          toast({
            title: '권한이 없는 페이지 입니다.',
            status: 'error',
            duration: 3000,
          });
        } else {
          const accountAuth: AccountAuth = sessionInfo.myInformation.account.auth;
          if (auth === AccountAuth.ACCOUNT && (accountAuth === null)
            || auth === AccountAuth.BOARD_ADMIN && accountAuth === AccountAuth.ACCOUNT
            || auth === AccountAuth.SYSTEM_ADMIN && accountAuth !== AccountAuth.SYSTEM_ADMIN) {
            toast({
              title: '권한이 없는 페이지 입니다.',
              status: 'error',
              duration: 3000,
            });
            void router.push('/');
          }
        }
      }

      setValid(true);
    } else if (loginState === LoginState.LOGIN) {
      void router.push('/login');
    } else {
      void router.push('/');
    }
  }, [loginState,]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {isValid && children}
    </>
  );
};

export { LoginState, };
export type { Props, };
export default EmptyLayout;
