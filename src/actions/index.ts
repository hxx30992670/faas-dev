import { CHANGECURRENTROUTE, CHANGELOADING } from '../constants/index';


export interface CHANGECURRENTROUTEAction {
  type: CHANGECURRENTROUTE,
  payload: string
}

export interface CHANGELOADINGAction {
  type: CHANGELOADING,
  payload: boolean
}

export type MofilyAction = CHANGECURRENTROUTEAction | CHANGELOADINGAction;

export const changeRoute = (payload: string): CHANGECURRENTROUTEAction => ({
  type: CHANGECURRENTROUTE,
  payload
});
export const changeLoading = (payload: boolean): CHANGELOADINGAction => ({
  type: CHANGELOADING,
  payload
});