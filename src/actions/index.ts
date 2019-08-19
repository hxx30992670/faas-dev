import { CHANGECURRENTROUTE } from '../constants/index';


export interface CHANGECURRENTROUTEAction {
  type: CHANGECURRENTROUTE,
  payload: string
}

export type MofilyAction = CHANGECURRENTROUTEAction;

export const changeRoute = (payload: string): CHANGECURRENTROUTEAction => ({
  type: CHANGECURRENTROUTE,
  payload
});