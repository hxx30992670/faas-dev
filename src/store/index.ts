import Redux from '../reducers';

import { StoreState } from '../types';

import { createStore } from "redux";

const initVal: StoreState = {
  currentRoute: '/data-manager/file-collection',
  loading: false
}

const Store = createStore(Redux, initVal);

export default Store;