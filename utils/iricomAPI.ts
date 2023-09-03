import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
import { Account, AccountList, BackendProperties, Board, BoardAdmin, BoardList, Comment, CommentList, FirebaseProperties, Post, PostList, PostState, PostType, TokenInfo, VoteType, } from '../interfaces';
import process from 'process';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;
const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;

type IricomAPIList = {
  // 토큰
  refreshToken: (tokenInfo: TokenInfo) => Promise<TokenInfo>,

  // 내 정보
  getMyAccount: (tokenInfo: TokenInfo | null) => Promise<Account>,
  updateMyAccountInfo: (tokenInfo: TokenInfo | null, nickname: string | null, description: string | null) => Promise<Account>,
  getMyPostList: (tokenInfo: TokenInfo | null, skip: number, limit: number) => Promise<PostList>,

  // 관리자
  getBoardAdminInfo: (tokenInfo: TokenInfo | null, boardId: string) => Promise<BoardAdmin>,
  createBoardAdmin: (tokenInfo: TokenInfo | null, boardId: string, accountId: string) => Promise<void>,
  deleteBoardAdmin: (tokenInfo: TokenInfo | null, boardId: string, accountId: string) => Promise<void>,

  // 계정
  getAccountList: (tokenInfo: TokenInfo | null, skip: number, limit: number, keyword: string | null) => Promise<AccountList>,

  // 게시판
  getBoardList: (tokenInfo: TokenInfo | null, skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,
  getBoard: (tokenInfo: TokenInfo | null, id: string) => Promise<Board>,
  createBoard: (tokenInfo: TokenInfo | null, title: string, description: string, enabled: boolean) => Promise<Board>,
  updateBoard: (tokenInfo: TokenInfo | null, board: Board) => Promise<Board>,

  // 게시물
  getPostList: (tokenInfo: TokenInfo | null, boardId: string, skip: number, limit: number, type: PostType | null) => Promise<PostList>,
  getPost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, postState: PostState | null) => Promise<Post>,
  createPost: (tokenInfo: TokenInfo | null, boardId: string, title: string, content: string, postType: PostType, isAllowComment: boolean) => Promise<Post>,
  updatePost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, title: string | null, content: string | null, postType: PostType | null, isAllowComment: boolean | null) => Promise<Post>,
  publishPost: (tokenInfo: TokenInfo | null, boardId: string, postId: string) => Promise<Post>,
  votePost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, type: VoteType) => Promise<Post>,
  deletePost: (tokenInfo: TokenInfo | null, boardId: string, postId: string) => Promise<Post>,

  // 댓글
  getCommentList: (tokenInfo: TokenInfo | null, boardId: string, postId: string) => Promise<CommentList>,
  createComment: (tokenInfo: TokenInfo | null, boardId: string, postId: string, content: string, referenceCommentId: string | null) => Promise<Comment>,
  voteComment: (tokenInfo: TokenInfo | null, boardId: string, postId: string, commentId: string, type: VoteType) => Promise<Comment>,

}

function setToken (config: AxiosRequestConfig, tokenInfo: TokenInfo | null) {
  if (tokenInfo !== null) {
    config.headers = {
      ...config.headers,
      Authorization: 'Bearer ' + tokenInfo.token,
    };
  }
}

const IricomAPI: IricomAPIList = {
  refreshToken: async (tokenInfo: TokenInfo): Promise<TokenInfo> => {
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
      return new TokenInfo(token, refreshToken, expiredDate);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getMyAccount: async (tokenInfo: TokenInfo | null): Promise<Account> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/infos`,
      method: 'GET',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Account> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateMyAccountInfo: async (tokenInfo: TokenInfo | null, nickname: string | null, description: string | null): Promise<Account> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/accounts/`,
      method: 'PATCH',
      data: {
      },
    };
    setToken(config, tokenInfo);

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
    setToken(config, tokenInfo);

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

  getBoard: async (tokenInfo: TokenInfo | null, id: string) => {
    const config: AxiosRequestConfig = {
      url: backendProperties.host + '/v1/boards/' + id,
      method: 'GET',
    };
    setToken(config, tokenInfo);

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

  createBoard: async (tokenInfo: TokenInfo | null, title: string, description: string, enabled: boolean): Promise<Board> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards`,
      method: 'POST',
      data: {
        title,
        description,
        enabled,
      },
    };
    setToken(config, tokenInfo);

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

  updateBoard: async (tokenInfo: TokenInfo | null, board: Board): Promise<Board> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${board.id}`,
      method: 'POST',
      data: board,
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: Board = new Board();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getMyPostList: async (tokenInfo: TokenInfo | null, skip: number, limit: number): Promise<PostList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/infos/posts`,
      method: 'GET',
      params: {
        skip: skip,
        limit: limit,
      },
    };
    setToken(config, tokenInfo);

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

  getBoardAdminInfo: async (tokenInfo: TokenInfo | null, boardId: string): Promise<BoardAdmin> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/auth/boards/${boardId}`,
      method: 'GET',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: BoardAdmin = new BoardAdmin();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createBoardAdmin: async (tokenInfo: TokenInfo | null, boardId: string, accountId: string): Promise<void> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/auth/board`,
      method: 'POST',
      data: {
        boardId,
        accountId,
      },
    };
    setToken(config, tokenInfo);

    try {
      await axios.request(config);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteBoardAdmin: async (tokenInfo: TokenInfo | null, boardId: string, accountId: string): Promise<void> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/auth/board`,
      method: 'DELETE',
      data: {
        boardId,
        accountId,
      },
    };
    setToken(config, tokenInfo);

    try {
      await axios.request(config);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getAccountList: async (tokenInfo: TokenInfo | null, skip: number, limit: number, keyword: string | null): Promise<AccountList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/accounts`,
      method: 'GET',
      params: {
        skip,
        limit,
      },
    };
    setToken(config, tokenInfo);

    if (keyword !== null) {
      config.params.keyword = keyword;
    }

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: AccountList = new AccountList();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPostList: async (tokenInfo: TokenInfo | null, boardId: string, skip: number = 0, limit: number = 20, type: PostType | null): Promise<PostList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts`,
      method: 'GET',
      params: {
        skip: skip,
        limit: limit,
      },
    };
    setToken(config, tokenInfo);

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
    setToken(config, tokenInfo);

    if (postState !== null) {
      config.params = {
        state: postState,
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

  createPost: async (tokenInfo: TokenInfo | null, boardId: string, title: string, content: string, postType: PostType, isAllowComment: boolean): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts`,
      method: 'POST',
      data: {
        title,
        content,
        type: postType,
        isAllowComment,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updatePost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, title: string | null, content: string | null, postType: PostType | null, isAllowComment: boolean | null): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}`,
      method: 'PATCH',
      data: {},
    };
    setToken(config, tokenInfo);

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
      console.error(error);
      throw error;
    }
  },

  publishPost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/publish`,
      method: 'POST',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  votePost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, type: VoteType): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/vote`,
      method: 'PATCH',
      data: {
        type: type,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deletePost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}`,
      method: 'DELETE',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommentList: async (tokenInfo: TokenInfo | null, boardId: string, postId: string): Promise<CommentList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/comments`,
      method: 'GET',
      params: {
        includeComment: true,
        includeCommentLimit: 20,
      },
    };
    setToken(config, tokenInfo);

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

  createComment: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, content: string, referenceCommentId: string | null): Promise<Comment> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/comments`,
      method: 'POST',
      data: {
        content,
      },
    };
    setToken(config, tokenInfo);

    if (referenceCommentId) {
      config.data.referenceCommentId = referenceCommentId;
    }

    try {
      const response: AxiosResponse<Comment> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  voteComment: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, commentId: string, type: VoteType): Promise<Comment> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/comments/${commentId}/vote`,
      method: 'PATCH',
      data: {
        type: type,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Comment> = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default IricomAPI;
