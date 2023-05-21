// node
import process from 'process';
// etc
import { Account, AccountList, BackendProperties, Board, BoardAdmin, BoardList, Comment, CommentList, FirebaseProperties, IricomError, IricomErrorResponse, NotExistTokenError, Post, PostList, PostState, PostType, TokenInfo, VoteType, } from '../interfaces';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, } from 'axios';
// store
import { BrowserStorage, } from '../utils';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;

type IricomAPI = {
  getMyAccount: (tokenInfo: TokenInfo) => Promise<Account>,
  getMyPostList: (skip: number, limit: number) => Promise<PostList>,
  updateMyAccountInfo: (nickname: string | null, description: string | null) => Promise<Account>,

  getBoardList: (skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,
  createBoard: (title: string, description: string, enabled: boolean) => Promise<Board>,
  getBoard: (id: string) => Promise<Board>,
  updateBoard: (board: Board) => Promise<Board>,

  getPostList: (boardId: string, skip: number, limit: number, type: PostType | null) => Promise<PostList>,
  getPost: (boardId: string, postId: string, postState: PostState | null) => Promise<Post>,
  createPost: (boardId: string, title: string, content: string, type: PostType,  isAllowComment: boolean) => Promise<Post>,
  updatePost: (boardId: string, postId: string, title: string | null, content: string | null, postType: PostType | null, isAllowComment: boolean | null) => Promise<Post>,
  publishPost: (boardId: string, postId: string) => Promise<Post>,
  votePost: (boardId: string, postId: string, type: VoteType) => Promise<Post>,
  deletePost: (boardId: string, postId: string) => Promise<Post>,

  getCommentList: (boardId: string, postId: string) => Promise<CommentList>,
  createComment: (boardId: string, postId: string, content: string, referenceCommentId: string | null) => Promise<Comment>,
  voteComment: (boardId: string, postId: string, commentId: string, type: VoteType) => Promise<Comment>,

  getAccountList: (skip: number, limit: number, keyword: string | null) => Promise<AccountList>,

  createBoardAdmin: (boardId: string, accountId: string) => Promise<void>,
  getBoardAdminInfo: (boardId: string) => Promise<BoardAdmin>,
  deleteBoardAdmin: (boardId: string, accountId: string) => Promise<void>,
}

function useIricomAPI (): IricomAPI {
  const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;
  // axios.defaults.withCredentials = true;

  const getRequestConfig = async (tokenInfo: TokenInfo | null): Promise<AxiosRequestConfig> => {
    if (tokenInfo === null) {
      throw new NotExistTokenError('Token is not exist.');
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
      return {
        token,
        refreshToken,
        expiredDate,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const defaultErrorHandler = (error: AxiosError) => {
    const iricomErrorResponse: IricomErrorResponse = error.response.data as IricomErrorResponse;
    throw new IricomError(iricomErrorResponse.code, iricomErrorResponse.message);
  };

  const iricomApi: IricomAPI = {
    getMyAccount: async (tokenInfo: TokenInfo) => {
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = backendProperties.host + '/v1/infos';
      config.method = 'GET';

      try {
        let response: AxiosResponse<Account> = await axios.request(config);
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
        const response: AxiosResponse<Object> = await axios.request(config);
        const result: PostList = new PostList();
        Object.assign(result, response.data);
        return result;
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
        const response: AxiosResponse<Object> = await axios.request(config);
        const result: BoardList = new BoardList();
        Object.assign(result, response.data);
        return result;
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
        const response: AxiosResponse<Object> = await axios.request(config);
        const result: Board = new Board();
        Object.assign(result, response.data);
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    getBoard: async (id: string) => {
      const config: AxiosRequestConfig = {
        url: backendProperties.host + '/v1/boards/' + id,
        method: 'GET',
      };

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

    updateBoard: async (board: Board): Promise<Board> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = backendProperties.host + '/v1/boards/' + board.id;
      config.method = 'PATCH';
      config.data = board;

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

    createPost: async (boardId: string, title: string, content: string, postType: PostType, isAllowComment: boolean): Promise<Post> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts`;
      config.method = 'POST';
      config.data = {
        title,
        content,
        type: postType,
        isAllowComment,
      };

      try {
        const response: AxiosResponse<Post> = await axios.request(config);
        return response.data;
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    updatePost: async (boardId: string, postId: string, title: string | null, content: string | null, postType: PostType | null, isAllowComment: boolean | null): Promise<Post> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}`;
      config.method = 'PATCH';
      config.data = {};

      if (title) {
        config.data.title = title;
      }
      if (content) {
        config.data.content = content;
      }
      if (postType) {
        config.data.type = postType;
      }
      if (isAllowComment) {
        config.data.isAllowComment = isAllowComment;
      }

      try {
        const response: AxiosResponse<Post> = await axios.request(config);
        return response.data;
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    publishPost: async (boardId: string, postId: string): Promise<Post> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(tokenInfo);
      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/publish`;
      config.method = 'POST';

      try {
        const response: AxiosResponse<Post> = await axios.request(config);
        return response.data;
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    votePost: async (boardId: string, postId: string, type: VoteType): Promise<Post> => {
      const tokeInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(tokeInfo);
      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/vote`;
      config.method = 'PATCH';
      config.data = {
        type: type,
      };

      try {
        const response: AxiosResponse<Post> = await axios.request(config);
        return response.data;
      } catch (error) {
        defaultErrorHandler(error);
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
        defaultErrorHandler(error);
      }
    },

    getPost: async (boardId: string, postId: string, postState: PostState | null): Promise<Post> => {
      let config: AxiosRequestConfig;
      if (postState === PostState.TEMPORARY) {
        // 임시 저장한 문서는 token이 필요함
        const token: TokenInfo | null = BrowserStorage.getTokenInfo();
        config = await getRequestConfig(token);
      } else {
        config = {};
      }

      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}`;
      config.method = 'GET';
      if (postState !== null) {
        config.params = {
          state: postState,
        };
      }

      try {
        const response: AxiosResponse<Post> = await axios.request(config);
        return response.data;
      } catch (error) {
        defaultErrorHandler(error);
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
        defaultErrorHandler(error);
      }
    },

    createComment: async (boardId: string, postId: string, content: string, referenceCommentId: string | null): Promise<Comment> => {
      const token: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(token);

      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/comments`;
      config.method = 'POST';
      config.data = {
        content: content,
      };

      if (referenceCommentId) {
        config.data.referenceCommentId = referenceCommentId;
      }

      try {
        const response: AxiosResponse<Comment> = await axios.request(config);
        return response.data;
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    voteComment: async (boardId: string, postId: string, commentId: string, type: VoteType): Promise<Comment> => {
      const token: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(token);

      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/comments/${commentId}/vote`;
      config.method = 'PATCH';
      config.data = {
        type: type,
      };

      try {
        const response: AxiosResponse<Comment> = await axios.request(config);
        return response.data;
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    deletePost: async (boardId: string, postId: string): Promise<Post> => {
      const token: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(token);

      config.url = `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}`;
      config.method = 'DELETE';

      try {
        const response: AxiosResponse<Post> = await axios.request(config);
        return response.data;
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    getAccountList: async (skip: number, limit: number, keyword: string | null): Promise<AccountList> => {
      const token: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(token);

      config.url = `${backendProperties.host}/v1/accounts`;
      config.method = 'GET';
      config.params = {
        skip: skip,
        limit: limit,
      };

      if (keyword !== null) {
        config.params.keyword = keyword;
      }

      try {
        const response: AxiosResponse<Object> = await axios.request(config);
        const result: AccountList = new AccountList();
        Object.assign(result, response.data);
        return result;
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    getBoardAdminInfo: async (boardId: string): Promise<BoardAdmin> => {
      const token: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(token);

      config.url = `${backendProperties.host}/v1/auth/board/${boardId}`;
      config.method = 'GET';

      try {
        const response: AxiosResponse<Object> = await axios.request(config);
        const result: BoardAdmin = new BoardAdmin();
        Object.assign(result, response.data);
        return result;
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    createBoardAdmin: async (boardId: string, accountId: string) => {
      const token: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(token);

      config.url = `${backendProperties.host}/v1/auth/board`;
      config.method = 'POST';
      config.data = {
        boardId: boardId,
        accountId: accountId,
      };

      try {
        await axios.request(config);
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    deleteBoardAdmin: async (boardId: string, accountId: string) => {
      const token: TokenInfo | null = BrowserStorage.getTokenInfo();
      const config: AxiosRequestConfig = await getRequestConfig(token);

      config.url = `${backendProperties.host}/v1/auth/board`;
      config.method = 'DELETE';
      config.data = {
        boardId: boardId,
        accountId: accountId,
      };

      try {
        await axios.request(config);
      } catch (error) {
        defaultErrorHandler(error);
      }
    },
  };

  return iricomApi;
}

export default useIricomAPI;
