import { MofilyAction } from "../actions/index";
import { IStoreType } from "../types";
import { CHANGECURRENTROUTE, CHANGELOADING, CHANGELOADINGTITLE, CHANGESELECTLIST } from "../constants";


export default (state: IStoreType, action: MofilyAction): IStoreType => {
  // let newObject: any = {};
  switch (action.type) {
    case CHANGECURRENTROUTE:
      state = Object.assign({}, state);
      state.currentRoute = action.payload;
      return state;
    case CHANGELOADING:
      state = Object.assign({}, state);
      state.loading = action.payload;
      return state;
    case CHANGELOADINGTITLE:
      state = Object.assign({}, state);
      state.loadingTitle = action.payload;
      return state;
    case CHANGESELECTLIST:
      state = Object.assign({}, state);
      state.selectList = action.payload;
      return state;
    default:
      return state;
  }
}