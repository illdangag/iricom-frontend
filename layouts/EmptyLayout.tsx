// react
import { ReactNode, useEffect, useState, } from 'react';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { RequireLoginAlert, } from '../components/alerts';
import { useIricomAPI, } from '../hooks';
// etc
import { AccountAuth, Account, TokenInfo, } from '../interfaces';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilValue, useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../recoil';
import requireLoginPopupAtom, { RequireLoginPopup, setPopupSelector as setRequireLoginPopupSelector, } from '../recoil/requireLoginPopup';

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
  auth = AccountAuth.NONE,
  onMount = () => {},
}: Props) => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const setMyAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const [isValid, setValid,] = useState<boolean>(false);
  const requireLoginPopup = useRecoilValue(requireLoginPopupAtom);
  const setRequireLoginPopup = useSetRecoilState<RequireLoginPopup>(setRequireLoginPopupSelector);

  // 계정과 계정의 권한에 따른 페이지 접근 처리
  useEffect(() => {
    const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (loginState === LoginState.ANY) {
      // 로그인 여부와 상관 없이 페이지를 표시
      setValid(true);

      // 토큰이 존재하는 경우 계정 정보를 갱신
      if (tokenInfo !== null) {
        void iricomAPI.getMyAccount(tokenInfo)
          .then(account => {
            setMyAccount(account);
          });
      }
    } else if (loginState === LoginState.LOGOUT) {
      // 토큰이 없는 경우가 로그아웃 상태이므로 토큰이 없는 경우에만 페이지를 표시
      if (tokenInfo === null) {
        setValid(true);
      } else {
        setValid(false);
        void router.replace('/');
      }
    } else { // loginState === LoginState.LOGIN
      if (tokenInfo === null) {
        setValid(false);
        void router.replace('/');
        return;
      }

      void iricomAPI.getMyAccount(tokenInfo)
        .then(account => {
          setMyAccount(account);

          const accountAuth: AccountAuth = account.auth;

          if (auth === AccountAuth.NONE) {
            setValid(true);
          } else if (auth === AccountAuth.UNREGISTERED_ACCOUNT && (accountAuth === AccountAuth.UNREGISTERED_ACCOUNT || accountAuth === AccountAuth.ACCOUNT || accountAuth === AccountAuth.BOARD_ADMIN || accountAuth === AccountAuth.SYSTEM_ADMIN)) {
            setValid(true);
          } else if (auth === AccountAuth.ACCOUNT && (accountAuth === AccountAuth.ACCOUNT || accountAuth === AccountAuth.BOARD_ADMIN || accountAuth === AccountAuth.SYSTEM_ADMIN)) {
            setValid(true);
          } else if (auth === AccountAuth.BOARD_ADMIN && (accountAuth === AccountAuth.BOARD_ADMIN || accountAuth === AccountAuth.SYSTEM_ADMIN)) {
            setValid(true);
          } else if (auth === AccountAuth.SYSTEM_ADMIN && accountAuth === AccountAuth.SYSTEM_ADMIN) {
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

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {isValid && children}
      <RequireLoginAlert
        text={requireLoginPopup.message}
        successURL={`/`}
        isOpen={requireLoginPopup.isShow}
        onClose={() => setRequireLoginPopup({
          isShow: false,
        })}
      />
    </>
  );
};

export { LoginState, };
export type { Props, };
export default EmptyLayout;
