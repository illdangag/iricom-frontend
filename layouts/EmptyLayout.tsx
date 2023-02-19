import { ReactNode, useState, useEffect, } from 'react';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { SessionInfo, } from '../interfaces';
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
};

const EmptyLayout = ({
  children,
  title = 'Welcome | iricom',
  loginState = LoginState.ANY,
}: Props) => {
  const router = useRouter();

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
