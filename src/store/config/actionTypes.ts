export enum ActionTypes {
  SET_CONFIG = "SET_CONFIG"
}

export interface SetConfigAction {
  type: ActionTypes.SET_CONFIG
  payload: any
}