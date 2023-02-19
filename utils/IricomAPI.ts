import * as process from 'process';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, } from 'axios';
import { BackendProperties, MyInformation, TokenInfo, } from '../interfaces';

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

const getRequestConfig = (tokenInfo: TokenInfo): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: 'Bearer ' + tokenInfo.token,
    },
  } as AxiosRequestConfig;
};
