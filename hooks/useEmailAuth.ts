// react
import { useState, } from 'react';
import { useIricomAPI, } from './index';
// etc
import { FirebaseProperties, TokenInfo, Account, } from '../interfaces';
import { FirebaseApp, FirebaseOptions, initializeApp, } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, UserCredential, } from 'firebase/auth';
// store
import { BrowserStorage, getTokenExpiredDate, } from '../utils';
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../recoil';

type State = 'ready' | 'request' | 'success' | 'fail';

function useEmailAuth (): [State, (email: string, password: string,) => Promise<void>] {
  const iricomAPI = useIricomAPI();

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

  const requestEmailAuth = async (email, password) => {
    setState('request');
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const token: string = await userCredential.user.getIdToken();
      const refreshToken: string = userCredential.user.refreshToken;
      const expiredDate: Date = getTokenExpiredDate(token);

      const tokenInfo: TokenInfo = {
        token,
        refreshToken,
        expiredDate,
      };

      void iricomAPI.getMyAccount(tokenInfo)
        .then(account => {
          setState('success');
          setMyAccount(account);
          BrowserStorage.setTokenInfo(tokenInfo);
        });
    } catch {
      setState('fail');
    }
  };

  return [state, requestEmailAuth,];
}

export default useEmailAuth;
