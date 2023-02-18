import { useState, } from 'react';
import { FirebaseProperties, } from '../interfaces';
import { FirebaseApp, FirebaseOptions, initializeApp, } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, UserCredential, } from 'firebase/auth';

type State = 'ready' | 'request' | 'success' | 'fail';

function useEmailAuth (): [State, string, string, (email: string, password: string,) => Promise<void>] {
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

  const requestEmailAuth = async (email, password) => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const token: string = await userCredential.user.getIdToken();
      const refreshToken: string = userCredential.user.refreshToken;
      setToken(token);
      setRefreshToken(refreshToken);
      setState('success');
    } catch {
      setToken(token);
      setRefreshToken(refreshToken);
      setState('fail');
    }
  };

  return [state, token, refreshToken, requestEmailAuth,];
}

export default useEmailAuth;
