// node
import process from 'process';
// react
import useRefreshToken from './useRefreshToken';
// etc
import { BackendProperties, Board, BoardList, MyAccountInfo, TokenInfo, } from '../interfaces';
import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
// store
import { useRecoilValue, } from 'recoil';
import { tokenInfoAtom, } from '../recoil';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;

type IricomAPI = {
  getMyAccountInfo: (tokenInfo: TokenInfo) => Promise<MyAccountInfo>,
  getBoardList: (skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,
  createBoard: (title: string, description: string, enabled: boolean) => Promise<Board>,
}

function useIricomAPI (): IricomAPI {
  const requestRefreshToken = useRefreshToken();
  const tokenInfo: TokenInfo | null = useRecoilValue<TokenInfo | null>(tokenInfoAtom);

  const getRequestConfig = (tokenInfo: TokenInfo | null): AxiosRequestConfig => {
    if (tokenInfo === null) {
      throw Error('Token is not exist.');
    }

    if (tokenInfo.expiredDate.getTime() < (new Date()).getTime()) {
      requestRefreshToken();
    }

    return {
      headers: {
        Authorization: 'Bearer ' + tokenInfo.token,
      },
    } as AxiosRequestConfig;
  };

  const iricomApi: IricomAPI = {
    getMyAccountInfo: async (tokenInfo: TokenInfo) => {
      const config: AxiosRequestConfig = getRequestConfig(tokenInfo);
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
      const config: AxiosRequestConfig = getRequestConfig(tokenInfo);
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
      const config: AxiosRequestConfig = getRequestConfig(tokenInfo);
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
  };
  return iricomApi;
}



export default useIricomAPI;
