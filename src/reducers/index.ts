import { MofilyAction } from "../actions/index";
import { IStoreType } from "../types";
import { CHANGECURRENTROUTE, CHANGELOADING } from "../constants";


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
    default:
      return state;
  }
}