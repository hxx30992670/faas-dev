import Redux from '../reducers';

import { StoreState } from '../types';

import { createStore } from "redux";

const initVal: StoreState = {
  currentRoute: '/data-manager/file-collection',
  loading: false,
  loadingTitle: '数据加载中……',
}

const Store = createStore(Redux, initVal);

export default Store;