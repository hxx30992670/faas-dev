import { CHANGECURRENTROUTE, CHANGELOADING, CHANGELOADINGTITLE } from '../constants/index';


export interface CHANGECURRENTROUTEAction {
  type: CHANGECURRENTROUTE,
  payload: string
}

export interface CHANGELOADINGAction {
  type: CHANGELOADING,
  payload: boolean
}

export interface CHANGELOADINGTITLEAction {
  type: CHANGELOADINGTITLE,
  payload: string
}

export type MofilyAction = CHANGECURRENTROUTEAction | CHANGELOADINGAction | CHANGELOADINGTITLEAction;

export const changeRoute = (payload: string): CHANGECURRENTROUTEAction => ({
  type: CHANGECURRENTROUTE,
  payload
});
export const changeLoading = (payload: boolean): CHANGELOADINGAction => ({
  type: CHANGELOADING,
  payload
});

export const changeLoadingTitle = (payload: string): CHANGELOADINGTITLEAction => ({
  type: CHANGELOADINGTITLE,
  payload
});