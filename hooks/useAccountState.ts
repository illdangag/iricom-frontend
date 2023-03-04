// react
import { useEffect, useState, } from 'react';
import { LoginState, } from '../layouts/EmptyLayout';
// etc
import { AccountAuth, Account, TokenInfo, } from '../interfaces';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilValue, } from 'recoil';
import { myAccountAtom, } from '../recoil';

function useAccountState (): [LoginState, AccountAuth] {
  const myAccount = useRecoilValue<Account | null>(myAccountAtom);
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
    if (myAccount === null) {
      setAccountAuth(AccountAuth.NONE);
    } else {
      setAccountAuth(myAccount.auth);
    }
  }, [myAccount,]);

  return [loginState, accountAuth,];
}

export default useAccountState;
