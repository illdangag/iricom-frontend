import { ReactNode, useEffect, useState, } from 'react';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { AccountAuth, TokenInfo, } from '../interfaces';
import { useIricomAPI, } from '../hooks';
import tokenInfoAtom from '../recoil/tokenInfo';
import { useRecoilState, } from 'recoil';
import { BrowserStorage, } from '../utils';

enum LoginState {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ANY = 'ANY',
}

type Props = {
  children?: ReactNode,
  title?: string,
  loginState?: LoginState,
  auth?: AccountAuth,
};

const EmptyLayout = ({
  children, title = 'Welcome | iricom',
  loginState = LoginState.ANY,
  auth = null,
}: Props) => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const [tokenInfo, setTokenInfo,] = useRecoilState<TokenInfo | null>(tokenInfoAtom);
  const [isValid, setValid,] = useState<boolean>(false);

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (loginState === LoginState.ANY
        || (loginState === LoginState.LOGIN && storageTokenInfo !== null)
        || (loginState === LoginState.LOGOUT && storageTokenInfo === null)) {
      setValid(true);
    } else {
      void router.push('/');
    }

    if ((tokenInfo === null && storageTokenInfo !== null) // 로그아웃 상태에서 로그인 한 경우
        || tokenInfo !== null && storageTokenInfo !== null && (tokenInfo.token !== storageTokenInfo.token)) { // 토큰이 갱신된 경우
      setTokenInfo(storageTokenInfo);
      void iricomAPI.getMyAccountInfo(storageTokenInfo)
        .then(myAccountInfo => {
          console.log(myAccountInfo);
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
