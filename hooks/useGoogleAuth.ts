import { useState, } from 'react';
import { FirebaseProperties, } from '../interfaces';
import { FirebaseApp, FirebaseOptions, initializeApp, } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, } from 'firebase/auth';

type State = 'ready' | 'request' | 'success' | 'fail';

function useGoogleAuth (): [State, string, string, () => Promise<void>] {
  const [state, setState,] = useState<State>('ready');
  const [token, setToken,] = useState<string>('');
  const [refreshToken, setRefreshToken,] = useState<string>('');

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
      setToken(token);
      setRefreshToken(refreshToken);
      setState('success');
    } catch {
      setToken('');
      setRefreshToken('');
      setState('fail');
    }
  };

  return [state, token, refreshToken, requestGoogleAuth,];
}

export default useGoogleAuth;
