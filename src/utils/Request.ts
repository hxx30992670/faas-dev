import axios from 'axios';
import LocalSave from "./LocalSave";
import { message } from 'antd';
import Store from "../store/index";
import { CHANGELOADING, CHANGELOADINGTITLE } from '../constants/index';



const TimeOut = 5 * 60 * 1000;

const request = async (url: string, options: any) => {
  const mt = LocalSave.getSession('mt');
  if (mt) {
    options.headers['mt'] = mt;
  }
  if (options.loading) {
    Store.dispatch({
      type: CHANGELOADING,
      payload: true
    });
    console.log(options.loadingTitle);
    Store.dispatch({
      type: CHANGELOADINGTITLE,
      payload: options.loadingTitle
    })
  }

  return axios.request({
    url,
    method: options.method,
    data: options.data,
    params: options.params,
    timeout: TimeOut,
    headers: options.headers
  }).then(({ data }) => {
    if (Number(data.status) === 401) {
      window.location.href = '/login';
    }
    if (options.loading) {
      Store.dispatch({
        type: CHANGELOADING,
        payload: false
      });
    }
    return data;
  }).catch((error: any) => {
    if (options.loading) {
      Store.dispatch({
        type: CHANGELOADING,
        payload: false
      });
    }
    if (error.response.status === 401 || error.response.status === 502) {
      window.location.href = '/login';
    }
    message.error(error.response.data.message);
  });
}


export default class Request {
  public static async post(url: string, data?: any, options: any = {
    loading: false,
  }, file: boolean = false): Promise<any> {
    try {
      options = Object.assign({ loadingTitle: '数据加载中……', loading: false }, options);
      const action = `/api${url}`;
      return await request(action, {
        data,
        method: 'post',
        headers: {
          "Content-Type": file ? "multipart/form-data" : "application/json;charset=utf-8",
          "role": 1
        },
        loading: options.loading ? options.loading : false,
        loadingTitle: options.loadingTitle
      });
    } catch (e) {
      throw Error(e);
    }
  }
  public static async get(url: string, params?: any, options?: any): Promise<any> {
    try {
      options = Object.assign({ loading: false, loadingTitle: '数据加载中……' }, options);
      const action: string = `/api${url}`;
      return await request(action, {
        params,
        method: 'get',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'role': 1
        },
        loading: options.loading,
        loadingTitle: options.loadingTitle
      });
    } catch (e) {
      throw Error(e);
    }
  }
}