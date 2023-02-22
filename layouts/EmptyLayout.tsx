import { ReactNode, useEffect, useState, } from 'react';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { AccountAuth, TokenInfo, } from '../interfaces';
import { useIricomAPI, } from '../hooks';
import tokenInfoAtom from '../recoil/tokenInfo';
import { useRecoilState, } from 'recoil';
import { BrowserStorage, } from '../utils';

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
  const iricomAPI = useIricomAPI();

  const [tokenInfo, setTokenInfo,] = useRecoilState<TokenInfo | null>(tokenInfoAtom);
  const [isValid, setValid,] = useState<boolean>(false);

  useEffect(() => {
    const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    setTokenInfo(tokenInfo);
  }, []);

  useEffect(() => {
    if (loginState === LoginState.ANY
      || (loginState === LoginState.LOGIN && tokenInfo !== null)
      || (loginState === LoginState.LOGOUT && tokenInfo === null)) {
      setValid(true);
    } else {
      void router.push('/');
    }
  }, [loginState,]);

  useEffect(() => {
    if (tokenInfo !== null) {
      void iricomAPI.getMyAccountInfo()
        .then(myInformation => {
          console.log(myInformation);
        });
    }
  }, []);

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
