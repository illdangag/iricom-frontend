// react
import { useState, } from 'react';
import { useIricom, } from './index';
// etc
import { FirebaseProperties, TokenInfo, Account, } from '../interfaces';
import { FirebaseApp, FirebaseOptions, initializeApp, } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, } from 'firebase/auth';
// store
import { BrowserStorage, getTokenExpiredDate, } from '../utils';
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../recoil';

type State = 'ready' | 'request' | 'success' | 'fail';

function useGoogleAuth (): [State, () => Promise<void>] {
  const iricomAPI = useIricom();

  const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;
  const setMyAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const [state, setState,] = useState<State>('ready');

  const firebaseOptions: FirebaseOptions = {
    projectId: firebaseProperties.projectId,
    apiKey: firebaseProperties.apiKey,
    authDomain: firebaseProperties.authDomain,
  };
  const firebaseApp: FirebaseApp = initializeApp(firebaseOptions);
  const auth: Auth = getAuth(firebaseApp);
  const googleAuthProvider = new GoogleAuthProvider();
  googleAuthProvider.setDefaultLanguage('ko');
  googleAuthProvider.setCustomParameters({
    login_hint: 'user@example.com',
  });

  const requestGoogleAuth = async () => {
    setState('request');
    try {
      const userCredential: UserCredential = await signInWithPopup(auth, googleAuthProvider);
      const token: string = await userCredential.user.getIdToken();
      const refreshToken: string = userCredential.user.refreshToken;
      const expiredDate: Date = getTokenExpiredDate(token);

      const tokenInfo: TokenInfo = new TokenInfo(token, refreshToken, expiredDate);
      const account: Account = await iricomAPI.getMyAccount(tokenInfo);
      BrowserStorage.setTokenInfo(tokenInfo);
      setMyAccount(account);
      setState('success');
    } catch {
      setState('fail');
    }
  };

  return [state, requestGoogleAuth,];
}

export default useGoogleAuth;
