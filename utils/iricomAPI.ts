import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
import { Account, BackendProperties, Board, BoardList, CommentList, FirebaseProperties, Post, PostList, PostState, PostType, TokenInfo, } from '../interfaces';
import process from 'process';
import { BrowserStorage, } from './index';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;
const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;

type IricomAPIList = {
  getToken: (token: TokenInfo) => Promise<string>,
  refreshToken: (tokenInfo: TokenInfo) => Promise<TokenInfo>,

  getMyAccount: (tokenInfo: TokenInfo) => Promise<Account>,
  getMyPostList: (tokenInfo: TokenInfo | null, skip: number, limit: number) => Promise<PostList>,

  getBoardList: (tokenInfo: TokenInfo | null, skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,
  getBoard: (tokenInfo: TokenInfo | null, id: string) => Promise<Board>,

  getPostList: (boardId: string, skip: number, limit: number, type: PostType | null) => Promise<PostList>,
  getPost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, postState: PostState | null) => Promise<Post>,

  getCommentList: (boardId: string, postId: string) => Promise<CommentList>,
}

const IricomAPI: IricomAPIList = {
  getToken: async (tokenInfo: TokenInfo): Promise<string> => {
    let token: string = tokenInfo.token;
    if (tokenInfo.expiredDate.getTime() < (new Date()).getTime()) {
      const newTokenInfo: TokenInfo = await IricomAPI.refreshToken(tokenInfo);
      token = newTokenInfo.token;
      BrowserStorage.setTokenInfo(newTokenInfo);
    }
    return token;
  },

  refreshToken: async (tokenInfo: TokenInfo) : Promise<TokenInfo> => {
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
      return {
        token,
        refreshToken,
        expiredDate,
      } as TokenInfo;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getMyAccount: async (tokenInfo: TokenInfo): Promise<Account> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/infos`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + tokenInfo.token,
      },
    };

    try {
      const response: AxiosResponse<Account> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getBoardList: async (tokenInfo: TokenInfo | null, skip: number = 0, limit: number = 20, enabled: boolean | null = null): Promise<BoardList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards`,
      method: 'GET',
      params: {
        skip: skip,
        limit: limit,
      },
    };

    if (enabled !== null) {
      config.params.enabled = enabled;
    }

    if (tokenInfo) {
      config.headers = {
        ...config.headers,
        Authorization: 'Bearer ' + tokenInfo.token,
      };
    }

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: BoardList = new BoardList();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getBoard: async (tokenInfo: TokenInfo | null, id: string) => {
    const config: AxiosRequestConfig = {
      url: backendProperties.host + '/v1/boards/' + id,
      method: 'GET',
    };

    if (tokenInfo) {
      config.headers = {
        ...config.headers,
        Authorization: 'Bearer ' + tokenInfo.token,
      };
    }

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: Board = new Board();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getMyPostList: async (tokenInfo: TokenInfo | null, skip: number, limit: number): Promise<PostList> => {
    const config: AxiosRequestConfig = {
      url:  `${backendProperties.host}/v1/infos/posts`,
      method: 'GET',
      params: {
        skip: skip,
        limit: limit,
      },
    };

    if (tokenInfo) {
      config.headers = {
        ...config.headers,
        Authorization: 'Bearer ' + tokenInfo.token,
      };
    }

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: PostList = new PostList();
      Object.assign(result, response.data);
      return result;
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
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: PostList = new PostList();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, postState: PostState | null): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}`,
      method: 'GET',
    };

    if (postState !== null) {
      config.params = {
        state: postState,
      };
    }

    if (tokenInfo !== null) {
      config.headers = {
        Authorization: 'Bearer ' + tokenInfo.token,
      };
    }

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommentList: async (boardId: string, postId: string): Promise<CommentList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/comments`,
      method: 'GET',
      params: {
        includeComment: true,
        includeCommentLimit: 20,
      },
    };
    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: CommentList = new CommentList();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default IricomAPI;
