// react
import { ReactNode, useEffect, useState, } from 'react';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { useIricomAPI, } from '../hooks';
// etc
import { AccountAuth, MyAccountInfo, TokenInfo, } from '../interfaces';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import { tokenInfoAtom, myAccountInfoAtom, } from '../recoil';

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
  const [myAccountInfo, setMyAccountInfo,] = useRecoilState<MyAccountInfo | null>(myAccountInfoAtom);
  const [isValid, setValid,] = useState<boolean>(false);

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();

    if ((tokenInfo === null && storageTokenInfo !== null) // 로그아웃 상태에서 로그인 한 경우
        || tokenInfo !== null && storageTokenInfo !== null && (tokenInfo.token !== storageTokenInfo.token)) { // 토큰이 갱신된 경우
      setTokenInfo(storageTokenInfo);
      void iricomAPI.getMyAccountInfo(storageTokenInfo)
        .then(myAccountInfo => {
          setMyAccountInfo(myAccountInfo);
        });
    }
  }, []);

  useEffect(() => {
    let isValid: boolean = true;

    // 페이지 권한에 따른 접근
    if (auth !== null && myAccountInfo === null) {
      isValid = false;
    } else if (auth === AccountAuth.SYSTEM_ADMIN
        && myAccountInfo && myAccountInfo.account.auth !== AccountAuth.SYSTEM_ADMIN) {
      isValid = false;
    } else if (auth === AccountAuth.BOARD_ADMIN
        && myAccountInfo && myAccountInfo.account.auth === AccountAuth.ACCOUNT) {
      isValid = false;
    }

    // 로그인 여부에 따른 접근
    if (loginState === LoginState.LOGIN && tokenInfo === null) {
      isValid = false;
    } else if (loginState === LoginState.LOGOUT && tokenInfo !== null) {
      isValid = false;
    }

    if (isValid) {
      setValid(true);
    } else {
      setValid(false);
      void router.replace('/');
    }
  }, [auth, tokenInfo, myAccountInfo,]);

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
