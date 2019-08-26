export interface IStoreType {
  currentRoute: string,
  loading: boolean,
  loadingTitle: string,
  selectList: any[]
}

export type StoreState = IStoreType;