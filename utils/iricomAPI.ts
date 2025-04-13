import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
import {
  Account, AccountList, BackendProperties, Board, BoardAdmin, BoardList, Comment, CommentList, FirebaseProperties, Post, PostList,
  PostReport, PostState, PostType, PostReportList, ReportType, TokenInfo, VoteType, IricomServerInfo, PersonalMessageList, PersonalMessage,
} from '../interfaces';
import process from 'process';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;
const firebaseProperties: FirebaseProperties = process.env.firebase as unknown as FirebaseProperties;

type IricomAPIList = {
  // 토큰
  refreshToken: (tokenInfo: TokenInfo) => Promise<TokenInfo>,

  // 서버
  getServerInfo: () => Promise<IricomServerInfo>,

  // 내 정보
  getMyAccount: (tokenInfo: TokenInfo | null) => Promise<Account>,
  updateMyAccountInfo: (tokenInfo: TokenInfo | null, nickname: string | null, description: string | null) => Promise<Account>,
  getMyPostList: (tokenInfo: TokenInfo | null, skip: number, limit: number) => Promise<PostList>,
  getBoardListByBoardAdmin: (tokenInfo: TokenInfo | null, skip: number, limit: number) => Promise<BoardList>,

  // 관리자
  getBoardAdminInfo: (tokenInfo: TokenInfo | null, boardId: string) => Promise<BoardAdmin>,
  createBoardAdmin: (tokenInfo: TokenInfo | null, boardId: string, accountId: string) => Promise<BoardAdmin>,
  deleteBoardAdmin: (tokenInfo: TokenInfo | null, boardId: string, accountId: string) => Promise<BoardAdmin>,

  // 계정
  getAccountList: (tokenInfo: TokenInfo | null, skip: number, limit: number, keyword: string | null) => Promise<AccountList>,
  getAccount: (tokenInfo: TokenInfo | null, accountId: string) => Promise<Account>,

  // 게시판
  getBoardList: (tokenInfo: TokenInfo | null, skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,
  getBoard: (tokenInfo: TokenInfo | null, id: string) => Promise<Board>,
  createBoard: (tokenInfo: TokenInfo | null, title: string, description: string, enabled: boolean) => Promise<Board>,
  updateBoard: (tokenInfo: TokenInfo | null, board: Board) => Promise<Board>,
  getReportedPostList: (tokenInfo: TokenInfo | null, id: string, skip: number, limit: number, type: ReportType | null, reason: string | null) => Promise<PostReportList>,

  // 게시물
  getPostList: (tokenInfo: TokenInfo | null, boardId: string, skip: number, limit: number, type: PostType | null) => Promise<PostList>,
  getPost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, postState: PostState | null) => Promise<Post>,
  createPost: (tokenInfo: TokenInfo | null, boardId: string, title: string, content: string, postType: PostType, isAllowComment: boolean) => Promise<Post>,
  updatePost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, title: string | null, content: string | null, postType: PostType | null, isAllowComment: boolean | null) => Promise<Post>,
  publishPost: (tokenInfo: TokenInfo | null, boardId: string, postId: string) => Promise<Post>,
  votePost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, type: VoteType) => Promise<Post>,
  deletePost: (tokenInfo: TokenInfo | null, boardId: string, postId: string) => Promise<Post>,
  reportPost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, type: ReportType, reason: string) => Promise<PostReport>,
  getPostReport: (tokenInfo: TokenInfo | null, boardId: string, postId: string, reportId: string) => Promise<PostReport>,
  blockPost: (tokenInfo: TokenInfo | null, boardId: string, postId: string, reason: string) => Promise<Post>,
  unblockPost: (tokenInfo: TokenInfo | null, boardId: string, postId: string) => Promise<Post>,

  // 댓글
  getCommentList: (tokenInfo: TokenInfo | null, boardId: string, postId: string) => Promise<CommentList>,
  createComment: (tokenInfo: TokenInfo | null, boardId: string, postId: string, content: string, referenceCommentId: string | null) => Promise<Comment>,
  voteComment: (tokenInfo: TokenInfo | null, boardId: string, postId: string, commentId: string, type: VoteType) => Promise<Comment>,
  deleteComment: (tokenInfo: TokenInfo | null, boardId: string, postId: string, commentId: string) => Promise<Comment>,

  // 개인 쪽지
  getReceivePersonalMessageList: (tokenInfo: TokenInfo, skip: number, limit: number) => Promise<PersonalMessageList>,
  getSendPersonalMessageList: (tokenInfo: TokenInfo, skip: number, limit: number) => Promise<PersonalMessageList>,
  sendPersonalMessage: (tokenInfo: TokenInfo, receiveAccountId: string, title: string, message: string) => Promise<PersonalMessage>,
  getReceivePersonalMessage: (tokenInfo: TokenInfo, personalMessageId: string) => Promise<PersonalMessage>,
  getSendPersonalMessage: (tokenInfo: TokenInfo, personalMessageId: string) => Promise<PersonalMessage>,
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
      throw error;
    }
  },

  getServerInfo: async (): Promise<IricomServerInfo> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}`,
      method: 'GET',
      data: {},
    };
    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const iricomServerInfo = new IricomServerInfo();
      Object.assign(iricomServerInfo, response.data);
      return iricomServerInfo;
    } catch (error) {
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
      throw error;
    }
  },

  updateMyAccountInfo: async (tokenInfo: TokenInfo | null, nickname: string | null, description: string | null): Promise<Account> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/accounts/`,
      method: 'PATCH',
      data: {},
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
      throw error;
    }
  },

  getBoardListByBoardAdmin: async (tokenInfo: TokenInfo | null, skip: number, limit: number): Promise<BoardList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/infos/admin/boards`,
      method: 'GET',
      params: {
        skip: skip,
        limit: limit,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: BoardList = new BoardList();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getPostReport: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, reportId: string): Promise<PostReport> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/report/post/boards/${boardId}/posts/${postId}/reports/${reportId}`,
      method: 'GET',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<PostReport> = await axios.request(config);
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getReportedPostList: async (tokenInfo: TokenInfo | null, id: string, skip: number = 0, limit: number = 20, type: ReportType | null, reason: string | null): Promise<PostReportList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/report/post/boards/${id}`,
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

    if (reason !== null) {
      config.params.reason = reason;
    }

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: PostReportList = new PostReportList();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
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
      throw error;
    }
  },

  updateBoard: async (tokenInfo: TokenInfo | null, board: Board): Promise<Board> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${board.id}`,
      method: 'PATCH',
      data: board,
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: Board = new Board();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
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
      throw error;
    }
  },

  createBoardAdmin: async (tokenInfo: TokenInfo | null, boardId: string, accountId: string): Promise<BoardAdmin> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/auth/boards`,
      method: 'POST',
      data: {
        boardId,
        accountId,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: BoardAdmin = new BoardAdmin();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteBoardAdmin: async (tokenInfo: TokenInfo | null, boardId: string, accountId: string): Promise<BoardAdmin> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/auth/boards`,
      method: 'DELETE',
      data: {
        boardId,
        accountId,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: BoardAdmin = new BoardAdmin();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
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
      throw error;
    }
  },

  getAccount: async (tokenInfo: TokenInfo | null, accountId: string): Promise<Account> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/accounts/${accountId}`,
      method: 'GET',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Account> = await axios.request(config);
      return response.data;
    } catch (error) {
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
      throw error;
    }
  },

  createPost: async (tokenInfo: TokenInfo | null, boardId: string, title: string, content: string, postType: PostType, allowComment: boolean): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts`,
      method: 'POST',
      data: {
        title,
        content,
        type: postType,
        allowComment,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, title: string | null, content: string | null, postType: PostType | null, allowComment: boolean | null): Promise<Post> => {
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
    if (allowComment !== null) {
      config.data.allowComment = allowComment;
    }

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
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
      throw error;
    }
  },

  reportPost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, type: ReportType, reason: string): Promise<PostReport> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/report/post/boards/${boardId}/posts/${postId}`,
      method: 'POST',
      data: {
        type,
        reason,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<PostReport> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  blockPost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, reason: string): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/block/post/boards/${boardId}/posts/${postId}`,
      method: 'POST',
      data: {
        reason,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  unblockPost: async (tokenInfo: TokenInfo | null, boardId: string, postId: string): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/block/post/boards/${boardId}/posts/${postId}`,
      method: 'DELETE',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Post> = await axios.request(config);
      return response.data;
    } catch (error) {
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
      throw error;
    }
  },

  deleteComment: async (tokenInfo: TokenInfo | null, boardId: string, postId: string, commentId: string): Promise<Comment> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}/comments/${commentId}`,
      method: 'DELETE',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Comment> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReceivePersonalMessageList: async (tokenInfo: TokenInfo, skip: number, limit: number): Promise<PersonalMessageList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/personal/messages/receive`,
      method: 'GET',
      params: {
        skip: skip,
        limit: limit,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: PersonalMessageList = new PersonalMessageList();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getSendPersonalMessageList: async (tokenInfo: TokenInfo, skip: number, limit: number): Promise<PersonalMessageList> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/personal/messages/send`,
      method: 'GET',
      params: {
        skip: skip,
        limit: limit,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Object> = await axios.request(config);
      const result: PersonalMessageList = new PersonalMessageList();
      Object.assign(result, response.data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  sendPersonalMessage: async (tokenInfo: TokenInfo, receiveAccountId: string, title: string, message: string): Promise<PersonalMessage> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/personal/messages`,
      method: 'POST',
      data: {
        title: title,
        message: message,
        receiveAccountId: receiveAccountId,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<PersonalMessage> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReceivePersonalMessage: async (tokenInfo: TokenInfo, personalMessageId: string): Promise<PersonalMessage> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/personal/messages/receive/${personalMessageId}`,
      method: 'GET',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<PersonalMessage> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSendPersonalMessage: async (tokenInfo: TokenInfo, personalMessageId: string): Promise<PersonalMessage> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/personal/messages/send/${personalMessageId}`,
      method: 'GET',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<PersonalMessage> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default IricomAPI;
