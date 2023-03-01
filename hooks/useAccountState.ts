// react
import { useEffect, useState, } from 'react';
import { LoginState, } from '../layouts/EmptyLayout';
// etc
import { AccountAuth, MyAccountInfo, TokenInfo, } from '../interfaces';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilValue, } from 'recoil';
import { myAccountInfoAtom, } from '../recoil';

function useAccountState (): [LoginState, AccountAuth] {
  const myAccountInfo = useRecoilValue<MyAccountInfo | null>(myAccountInfoAtom);
  const [loginState, setLoginState,] = useState<LoginState>(LoginState.ANY);
  const [accountAuth, setAccountAuth,] = useState<AccountAuth>(AccountAuth.NONE);

  useEffect(() => {
    const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (tokenInfo !== null) {
      setLoginState(LoginState.LOGIN);
    } else {
      setLoginState(LoginState.LOGOUT);
    }
  }, []);

  useEffect(() => {
    if (myAccountInfo === null) {
      setAccountAuth(AccountAuth.NONE);
    } else {
      setAccountAuth(myAccountInfo.account.auth);
    }
  }, [myAccountInfo,]);

  return [loginState, accountAuth,];
}

export default useAccountState;
