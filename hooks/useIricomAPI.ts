// node
import process from 'process';
// etc
import {
  BackendProperties, Board, BoardList, MyAccountInfo, TokenInfo, FirebaseProperties, PostType, PostList, Post, IricomError, Account,
} from '../interfaces';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, } from 'axios';
// store
import { BrowserStorage, } from '../utils';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;

type IricomAPI = {
  getMyAccountInfo: (tokenInfo: TokenInfo) => Promise<MyAccountInfo>,
  getMyPostList: (skip: number, limit: number) => Promise<PostList>,
  getBoardList: (skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,
  createBoard: (title: string, description: string, enabled: boolean) => Promise<Board>,
  getBoard: (id: string) => Promise<Board>,
  updateBoard: (board: Board) => Promise<Board>,
  getPostList: (boardId: string, skip: number, limit: number, type: PostType | null) => Promise<PostList>,
  createPost: (boardId: string, title: string, content: string, type: PostType,  isAllowComment: boolean) => Promise<Post>,
  updateMyAccountInfo: (nickname: string | null, description: string | null) => Promise<Account>,
}

function useIricomAPI (): IricomAPI {
  const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;

  const getRequestConfig = async (tokenInfo: TokenInfo | null): Promise<AxiosRequestConfig> => {
    if (tokenInfo === null) {
      throw Error('Token is not exist.');
    }

    let token: string = tokenInfo.token;
    if (tokenInfo.expiredDate.getTime() < (new Date()).getTime()) {
      const newTokenInfo: TokenInfo = await refreshToken(tokenInfo);
      token = newTokenInfo.token;
      BrowserStorage.setTokenInfo(newTokenInfo);
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

  const commonErrorHandler = (error: AxiosError) => {
    const iricomError: IricomError = error.response.data as IricomError;
    if (iricomError.code === '01000002') {
      alert('TEST');
    } else {
      throw error;
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
    getMyPostList: async (skip: number, limit: number): Promise<PostList> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = `${backendProperties.host}/v1/infos/posts`;
      config.method = 'GET';
      config.params = {
        skip: skip,
        limit: limit,
      };

      try {
        const response: AxiosResponse<PostList> = await axios.request(config);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getBoardList: async (skip: number = 0, limit: number = 20, enabled: boolean | null = null): Promise<BoardList> => {
      const config: AxiosRequestConfig = {
        url: backendProperties.host + '/v1/boards',
        method: 'GET',
        params: {
          skip: skip,
          limit: limit,
        },
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
    createBoard: async (title: string, description: string, enabled: boolean): Promise<Board> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
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
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
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
    updateBoard: async (board: Board): Promise<Board> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
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
    getPostList: async (boardId: string, skip: number = 0, limit: number = 20, type: PostType | null): Promise<PostList> => {
      const config: AxiosRequestConfig = {
        url:  `${backendProperties.host}/v1/boards/${boardId}/posts`,
        method: 'GET',
        params: {
          skip: skip,
          limit: limit,
        },
      };

      if (type !== null) {
        config.params.type = type;
      }

      try {
        const response: AxiosResponse<PostList> = await axios.request(config);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    createPost: async (boardId: string, title: string, content: string, type: PostType,  isAllowComment: boolean): Promise<Post> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts`;
      config.method = 'POST';
      config.data = {
        title,
        content,
        type,
        isAllowComment,
      };

      try {
        const response: AxiosResponse<Post> = await axios.request(config);
        return response.data;
      } catch (error) {
        commonErrorHandler(error);
      }
    },
    updateMyAccountInfo: async (nickname: string | null, description: string | null): Promise<Account> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = `${backendProperties.host}/v1/accounts/`;
      config.method = 'PATCH';
      config.data = {};
      if (nickname !== null) {
        config.data.nickname = nickname;
      }
      if (description !== null) {
        config.data.description = description;
      }

      try {
        const response: AxiosResponse<Account> = await axios.request(config);
        return response.data;
      } catch (error) {
        commonErrorHandler(error);
      }
    },
  };
  return iricomApi;
}

export default useIricomAPI;
