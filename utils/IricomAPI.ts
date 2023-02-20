import * as process from 'process';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, } from 'axios';
import { BackendProperties, Board, BoardList, MyInformation, TokenInfo, } from '../interfaces';

const backendProperties: BackendProperties = process.env.backend as unknown as BackendProperties;

export const getMyAccountInfo = async (tokenInfo: TokenInfo): Promise<MyInformation> => {
  const config: AxiosRequestConfig = getRequestConfig(tokenInfo);
  config.url = backendProperties.host + '/v1/infos';
  config.method = 'GET';

  try {
    let response: AxiosResponse<MyInformation> = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBoardList = async (tokenInfo: TokenInfo, skip: number = 0, limit: number = 20, enabled: boolean | null = null): Promise<BoardList> => {
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
};

export const createBoard = async (tokenInfo: TokenInfo, title: string, description: string, enabled: boolean): Promise<Board> => {
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
};

const getRequestConfig = (tokenInfo: TokenInfo): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: 'Bearer ' + tokenInfo.token,
    },
  } as AxiosRequestConfig;
};
