import { useState, } from 'react';
import { FirebaseProperties, TokenInfo, } from '../interfaces';
import { FirebaseApp, FirebaseOptions, initializeApp, } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, } from 'firebase/auth';
import { getTokenExpiredDate, } from '../utils';

type State = 'ready' | 'request' | 'success' | 'fail';

function useGoogleAuth (): [State, TokenInfo, () => Promise<void>] {
  const [state, setState,] = useState<State>('ready');
  const [tokenInfo, setTokenInfo,] = useState<TokenInfo | null>(null);

  const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;
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

      setState('success');
      setTokenInfo({
        token,
        refreshToken,
        expiredDate,
      });
    } catch {
      setState('fail');
      setTokenInfo(null);
    }
  };

  return [state, tokenInfo, requestGoogleAuth,];
}

export default useGoogleAuth;
