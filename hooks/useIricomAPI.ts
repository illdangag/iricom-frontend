// node
import process from 'process';
// etc
import { BackendProperties, Board, BoardList, MyAccountInfo, TokenInfo, FirebaseProperties, } from '../interfaces';
import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import { tokenInfoAtom, } from '../recoil';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;

type IricomAPI = {
  getMyAccountInfo: (tokenInfo: TokenInfo) => Promise<MyAccountInfo>,
  getBoardList: (skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,
  createBoard: (title: string, description: string, enabled: boolean) => Promise<Board>,
  getBoard: (id: string) => Promise<Board>,
  updateBoard: (board: Board) => Promise<Board>,
}

function useIricomAPI (): IricomAPI {
  const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;
  const [tokenInfo, setTokenInfo,] = useRecoilState<TokenInfo | null>(tokenInfoAtom);

  const getRequestConfig = async (tokenInfo: TokenInfo | null): Promise<AxiosRequestConfig> => {
    if (tokenInfo === null) {
      throw Error('Token is not exist.');
    }

    let token: string = tokenInfo.token;
    if (tokenInfo.expiredDate.getTime() < (new Date()).getTime()) {
      const newTokenInfo: TokenInfo = await refreshToken(tokenInfo);
      token = newTokenInfo.token;
      BrowserStorage.setTokenInfo(newTokenInfo);
      setTokenInfo(newTokenInfo);
    }

    return {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    } as AxiosRequestConfig;
  };

  const refreshToken = async (tokenInfo: TokenInfo): Promise<TokenInfo> => {
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

      return tokenInfo;
    } catch (error) {
      console.error(error);
    }
  };

  const iricomApi: IricomAPI = {
    getMyAccountInfo: async (tokenInfo: TokenInfo) => {
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = backendProperties.host + '/v1/infos';
      config.method = 'GET';

      try {
        let response: AxiosResponse<MyAccountInfo> = await axios.request(config);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getBoardList: async (skip: number = 0, limit: number = 20, enabled: boolean | null = null) => {
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = backendProperties.host + '/v1/boards';
      config.method = 'GET';
      config.params = {
        skip: skip,
        limit: limit,
      };

      if (enabled !== null) {
        config.params.enabled = enabled;
      }

      try {
        const response: AxiosResponse<BoardList> = await axios.request(config);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    createBoard: async (title: string, description: string, enabled: boolean) => {
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = backendProperties.host + '/v1/boards';
      config.method = 'POST';
      config.data = {
        title,
        description,
        enabled,
      };

      try {
        const response: AxiosResponse<Board> = await axios.request(config);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getBoard: async (id: string) => {
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = backendProperties.host + '/v1/boards/' + id;
      config.method = 'GET';

      try {
        const response: AxiosResponse<Board> = await axios.request(config);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    updateBoard: async (board: Board) => {
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = backendProperties.host + '/v1/boards/' + board.id;
      config.method = 'PATCH';
      config.data = board;

      try {
        const response: AxiosResponse<Board> = await axios.request(config);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };
  return iricomApi;
}



export default useIricomAPI;
