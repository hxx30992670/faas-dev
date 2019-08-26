import { CHANGECURRENTROUTE, CHANGELOADING, CHANGELOADINGTITLE, CHANGESELECTLIST } from '../constants/index';


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

export interface CHANGESELECTLISTAction {
  type: CHANGESELECTLIST,
  payload: any[]
}

export type MofilyAction = CHANGECURRENTROUTEAction | CHANGELOADINGAction | CHANGELOADINGTITLEAction | CHANGESELECTLISTAction;

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

export const changeSelectList = (payload: any[]): CHANGESELECTLISTAction => ({
  type: CHANGESELECTLIST,
  payload
})