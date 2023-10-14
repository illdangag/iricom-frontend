// etc
import { Account, AccountList, Board, BoardAdmin, BoardList, Comment, CommentList, IricomError, IricomErrorResponse, NotExistTokenError, Post, PostList, PostReport, PostState, PostType, ReportType, TokenInfo, VoteType, } from '../interfaces';
import axios, { AxiosError, } from 'axios';
import iricomAPI from '../utils/iricomAPI';
// store
import { BrowserStorage, getTokenInfo, } from '../utils';

type IricomAPI = {
  getMyAccount: (tokenInfo: TokenInfo) => Promise<Account>,
  getMyPostList: (skip: number, limit: number) => Promise<PostList>,
  updateMyAccountInfo: (nickname: string | null, description: string | null) => Promise<Account>,
  getBoardListByBoardAdmin: (skip: number, limit: number) => Promise<BoardList>,

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
  reportPost: (boardId: string, postId: string, type: ReportType, reason: string) => Promise<PostReport>,
  banPost: (boardId: string, postId: string, reason: string) => Promise<Post>,

  getCommentList: (boardId: string, postId: string) => Promise<CommentList>,
  createComment: (boardId: string, postId: string, content: string, referenceCommentId: string | null) => Promise<Comment>,
  voteComment: (boardId: string, postId: string, commentId: string, type: VoteType) => Promise<Comment>,

  getAccountList: (skip: number, limit: number, keyword: string | null) => Promise<AccountList>,

  getBoardAdminInfo: (boardId: string) => Promise<BoardAdmin>,
  createBoardAdmin: (boardId: string, accountId: string) => Promise<BoardAdmin>,
  deleteBoardAdmin: (boardId: string, accountId: string) => Promise<BoardAdmin>,
}

function useIricomAPI (): IricomAPI {
  axios.defaults.withCredentials = false;

  const defaultErrorHandler = (error: AxiosError): IricomError => {
    const httpStatusCode: number = error.response.status;
    const iricomErrorResponse: IricomErrorResponse = error.response.data as IricomErrorResponse;
    return new IricomError(httpStatusCode, iricomErrorResponse.code, iricomErrorResponse.message);
  };

  const iricomApi: IricomAPI = {
    getMyAccount: async (tokenInfo: TokenInfo) => {
      try {
        return await iricomAPI.getMyAccount(tokenInfo);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    getMyPostList: async (skip: number, limit: number): Promise<PostList> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.getMyPostList(tokenInfo, skip, limit);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    getBoardListByBoardAdmin: async (skip: number, limit: number): Promise<BoardList> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.getBoardListByBoardAdmin(tokenInfo, skip, limit);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    getBoardList: async (skip: number = 0, limit: number = 20, enabled: boolean | null = null): Promise<BoardList> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.getBoardList(tokenInfo, skip, limit, enabled);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    createBoard: async (title: string, description: string, enabled: boolean): Promise<Board> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.createBoard(tokenInfo, title, description, enabled);
      } catch (error) {
        defaultErrorHandler(error);
      }
    },

    getBoard: async (id: string) => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.getBoard(tokenInfo, id);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    updateBoard: async (board: Board): Promise<Board> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.updateBoard(tokenInfo, board);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    getPostList: async (boardId: string, skip: number = 0, limit: number = 20, type: PostType | null): Promise<PostList> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.getPostList(tokenInfo, boardId, skip, limit, type);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    createPost: async (boardId: string, title: string, content: string, postType: PostType, allowComment: boolean): Promise<Post> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.createPost(tokenInfo, boardId, title, content, postType, allowComment);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    updatePost: async (boardId: string, postId: string, title: string | null, content: string | null, postType: PostType | null, allowComment: boolean | null): Promise<Post> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.updatePost(tokenInfo, boardId, postId, title, content, postType, allowComment);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    publishPost: async (boardId: string, postId: string): Promise<Post> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.publishPost(tokenInfo, boardId, postId);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    votePost: async (boardId: string, postId: string, type: VoteType): Promise<Post> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.votePost(tokenInfo, boardId, postId, type);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    updateMyAccountInfo: async (nickname: string | null, description: string | null): Promise<Account> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.updateMyAccountInfo(tokenInfo, nickname, description);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    getPost: async (boardId: string, postId: string, postState: PostState | null): Promise<Post> => {
      const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
      try {
        return await iricomAPI.getPost(tokenInfo, boardId, postId, postState);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    getCommentList: async (boardId: string, postId: string): Promise<CommentList> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.getCommentList(tokenInfo, boardId, postId);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    createComment: async (boardId: string, postId: string, content: string, referenceCommentId: string | null): Promise<Comment> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.createComment(tokenInfo, boardId, postId, content, referenceCommentId);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    voteComment: async (boardId: string, postId: string, commentId: string, type: VoteType): Promise<Comment> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();

      if (tokenInfo === null) {
        throw new NotExistTokenError();
      }

      try {
        return await iricomAPI.voteComment(tokenInfo, boardId, postId, commentId, type);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    deletePost: async (boardId: string, postId: string): Promise<Post> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.deletePost(tokenInfo, boardId, postId);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    reportPost: async (boardId: string, postId: string, type: ReportType, reason: string): Promise<PostReport> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();

      try {
        return await iricomAPI.reportPost(tokenInfo, boardId, postId, type, reason);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    banPost: async (boardId: string, postId: string, reason: string): Promise<Post> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();

      try {
        return await iricomAPI.banPost(tokenInfo, boardId, postId, reason);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    getAccountList: async (skip: number, limit: number, keyword: string | null): Promise<AccountList> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.getAccountList(tokenInfo, skip, limit, keyword);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    getBoardAdminInfo: async (boardId: string): Promise<BoardAdmin> => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.getBoardAdminInfo(tokenInfo, boardId);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    createBoardAdmin: async (boardId: string, accountId: string) => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.createBoardAdmin(tokenInfo, boardId, accountId);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },

    deleteBoardAdmin: async (boardId: string, accountId: string) => {
      const tokenInfo: TokenInfo | null = await getTokenInfo();
      try {
        return await iricomAPI.deleteBoardAdmin(tokenInfo, boardId, accountId);
      } catch (error) {
        throw defaultErrorHandler(error);
      }
    },
  };

  return iricomApi;
}

export default useIricomAPI;
