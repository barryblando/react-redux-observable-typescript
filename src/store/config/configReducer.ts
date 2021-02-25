import { ActionTypes, SetConfigAction } from './actionTypes'

export interface ConfigState {
  apiBase: string
  perPage: number
}

export const initialState: ConfigState = {
  apiBase: 'https://api.punkapi.com/v2/beers',
  perPage: 10
}

type ConfigActionTypes = 
  | SetConfigAction

export function configReducer(
  state = initialState,
  action: ConfigActionTypes
) {
  switch(action.type) {
    case ActionTypes.SET_CONFIG:
      return {
        ...state,
        ...action.payload
      }
    default: return state
  }
}