import { useState, } from 'react';
import { FirebaseProperties, TokenInfo, } from '../interfaces';
import { FirebaseApp, FirebaseOptions, initializeApp, } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, } from 'firebase/auth';
import { BrowserStorage, getTokenExpiredDate, } from '../utils';
import tokenInfoAtom from '../recoil/tokenInfo';
import { useSetRecoilState, } from 'recoil';

type State = 'ready' | 'request' | 'success' | 'fail';

function useGoogleAuth (): [State, () => Promise<void>] {
  const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;
  const setTokenInfo = useSetRecoilState<TokenInfo | null>(tokenInfoAtom);
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

      const tokenInfo: TokenInfo = {
        token,
        refreshToken,
        expiredDate,
      };

      setState('success');
      setTokenInfo(tokenInfo);
      BrowserStorage.setTokenInfo(tokenInfo);
    } catch {
      setState('fail');
      setTokenInfo(null);
    }
  };

  return [state, requestGoogleAuth,];
}

export default useGoogleAuth;
