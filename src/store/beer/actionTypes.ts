import { Beer } from './beerReducer'
import { Status } from './types'

export enum ActionTypes {
  FETCH_DATA = "FETCH_DATA",
  FETCH_FULFILLED = "FETCH_FULFILLED",
  FETCH_FAILED = "FETCH_FAILED",
  SET_STATUS = "SET_STATUS",
  SEARCH = "SEARCH",
  CANCEL = "CANCEL",
  RESET = "RESET",
  RANDOM = "RANDOM"
}

export interface FetchDataAction {
  type: ActionTypes.FETCH_DATA
}

export interface FetchFulfilledAction {
  type: ActionTypes.FETCH_FULFILLED
  payload: Beer[]
}

export interface FetchFailedAction {
  type: ActionTypes.FETCH_FAILED
  payload: string
}

export interface SetStatusAction {
  type: ActionTypes.SET_STATUS
  payload: Status
}

export interface SearchAction {
  type: ActionTypes.SEARCH,
  payload: string
}

export interface CancelAction {
  type: ActionTypes.CANCEL
}

export interface ResetAction {
  type: ActionTypes.RESET
}

export interface RandomAction {
  type: ActionTypes.RANDOM
}
