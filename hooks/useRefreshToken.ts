import process from 'process';
import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
import { FirebaseProperties, TokenInfo, } from '../interfaces';
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import tokenInfoAtom from '../recoil/tokenInfo';

function useRefreshToken (): () => {} {
  const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;
  const [tokenInfo, setTokenInfo,] = useRecoilState<TokenInfo | null>(tokenInfoAtom);

  const requestRequestToken = async () => {
    const config: AxiosRequestConfig = {
      url: 'https://securetoken.googleapis.com/v1/token',
      method: 'POST',
      params: {
        key: firebaseProperties.apiKey,
      },
      data: {
        grant_type: 'refresh_token',
        refresh_token: tokenInfo.refreshToken,
      },
    };

    try {
      const response: AxiosResponse<any> = await axios.request(config);
      const token: string = response.data.id_token;
      const refreshToken: string = response.data.refresh_token;
      const expiredDate: Date = new Date((new Date()).getTime() + (Number(response.data.expires_in) * 1000));
      const tokenInfo: TokenInfo = {
        token,
        refreshToken,
        expiredDate,
      };
     setTokenInfo(tokenInfo);
      BrowserStorage.setTokenInfo(tokenInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return requestRequestToken;
}

export default useRefreshToken;
