import { ReactNode, useEffect, useState, } from 'react';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { Account, } from '../interfaces';
import { BrowserStorage, } from '../utils';

import { useSetRecoilState, } from 'recoil';
import accountAtom from '../recoil/account';

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
  const setAccount = useSetRecoilState(accountAtom);

  const [isValid, setValid,] = useState<boolean>(false);

  useEffect(() => {
    const account: Account | null = BrowserStorage.getAccount();
    if (account !== null) {
      setAccount(account);
    }
  }, []);

  useEffect(() => {
    const account: Account | null = BrowserStorage.getAccount();
    if (loginState === LoginState.ANY
      || loginState === LoginState.LOGIN && account !== null
      || loginState === LoginState.LOGOUT && account === null) {
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
