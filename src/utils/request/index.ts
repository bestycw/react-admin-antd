import { AxiosRequest } from './axios';
import { FetchRequest } from './fetch';
import type { BaseRequestConfig } from './base';

export enum RequestType {
  AXIOS = 'axios',
  FETCH = 'fetch'
}

const createRequest = (type: RequestType = RequestType.AXIOS) => {
  return type === RequestType.FETCH ? new FetchRequest() : new AxiosRequest();
};

export default createRequest();
export { AxiosRequest, FetchRequest, type BaseRequestConfig };
