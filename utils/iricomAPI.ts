import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
import { BackendProperties, BoardList, PostList, PostType, } from '../interfaces';
import process from 'process';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;

type IricomAPIList = {
  getBoardList: (skip: number, limit: number, enabled: boolean | null) => Promise<BoardList>,

  getPostList: (boardId: string, skip: number, limit: number, type: PostType | null) => Promise<PostList>,
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
};

export default IricomAPI;
