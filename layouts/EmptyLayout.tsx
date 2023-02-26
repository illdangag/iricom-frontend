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
import { myAccountInfoAtom, tokenInfoAtom, } from '../recoil';

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
  onMount?: () => void,
};

const EmptyLayout = ({
  children, title = 'Welcome | iricom',
  loginState = LoginState.ANY,
  auth = null,
  onMount = () => {},
}: Props) => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const [tokenInfo, setTokenInfo,] = useRecoilState<TokenInfo | null>(tokenInfoAtom);
  const [myAccountInfo, setMyAccountInfo,] = useRecoilState<MyAccountInfo | null>(myAccountInfoAtom);
  const [isValid, setValid,] = useState<boolean>(false);

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();

    if (loginState === LoginState.ANY) {
      // 로그인 여부와 상관 없이 페이지를 표시
      setValid(true);
    } else if (loginState === LoginState.LOGOUT) {
      // 토큰이 없는 경우가 로그아웃 상태이므로 토큰이 없는 경우에만 페이지를 표시
      if (storageTokenInfo === null) {
        setValid(true);
      } else {
        setValid(false);
        void router.replace('/');
      }
    } else { // loginState === LoginState.LOGIN
      if (storageTokenInfo === null) {
        setValid(false);
        void router.replace('/');
        return;
      }

      void iricomAPI.getMyAccountInfo(storageTokenInfo)
        .then(myAccountInfo => {
          setMyAccountInfo(myAccountInfo);

          const accountAuth: AccountAuth = myAccountInfo.account.auth;
          if (auth === null || auth === AccountAuth.ACCOUNT) {
            // 페이지에 권한 확인이 필요 없는 경우
            // 모든 계정은 ACCOUNT 권한 이상이므로 ACCOUNT인 경우에는 별도의 검사가 필요하지 않음
            setValid(true);
          } else if (auth === AccountAuth.SYSTEM_ADMIN && accountAuth === AccountAuth.SYSTEM_ADMIN) {
            setValid(true);
          } else if (auth === AccountAuth.BOARD_ADMIN && accountAuth !== AccountAuth.ACCOUNT) {
            setValid(true);
          } else {
            setValid(false);
            void router.replace('/');
          }
        });
    }
  }, []);

  useEffect(() => {
    if (isValid) {
      onMount();
    }
  }, [isValid,]);

  const validatePageAccess = (tokenInfo: TokenInfo | null, myAccountInfo: MyAccountInfo | null) => {
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

    debugger;
    if (isValid) {
      setValid(true);
    } else {
      setValid(false);
      void router.replace('/');
    }
  };

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
