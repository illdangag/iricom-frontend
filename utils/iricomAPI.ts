import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
import { BackendProperties, Board, BoardList, CommentList, Post, PostList, PostState, PostType, } from '../interfaces';
import process from 'process';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;

type IricomAPIList = {
  getBoardList: (skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,
  getBoard: (id: string) => Promise<Board>,

  getPostList: (boardId: string, skip: number, limit: number, type: PostType | null) => Promise<PostList>,
  getPost: (boardId: string, postId: string, postState: PostState | null, token: string | null) => Promise<Post>,

  getCommentList: (boardId: string, postId: string) => Promise<CommentList>,
}

const IricomAPI: IricomAPIList = {
  getBoardList: async (skip: number = 0, limit: number = 20, enabled: boolean | null = null): Promise<BoardList> => {
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

  getPost: async (boardId: string, postId: string, postState: PostState | null, token: string | null): Promise<Post> => {
    const config: AxiosRequestConfig = {
      url: `${backendProperties.host}/v1/boards/${boardId}/posts/${postId}`,
      method: 'GET',
    };

    if (postState !== null) {
      config.params = {
        state: postState,
      };
    }

    if (postState === PostState.TEMPORARY) {
      config.headers = {
        Authorization: 'Bearer ' + token,
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
