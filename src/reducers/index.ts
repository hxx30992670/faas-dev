import { MofilyAction } from "../actions/index";
import { IStoreType } from "../types";
import { CHANGECURRENTROUTE } from "../constants";


export default (state: IStoreType, action: MofilyAction): IStoreType => {
  switch (action.type) {
    case CHANGECURRENTROUTE:
      const newObject = Object.assign({}, state);
      newObject.currentRoute = action.payload;
      return newObject;
    default:
      return state;
  }
}