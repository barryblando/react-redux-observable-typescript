import { 
  ActionTypes,
  FetchFailedAction,
  FetchFulfilledAction,
  ResetAction,
  SetStatusAction
} from  './actionTypes'
import { Status } from './types'

export interface Beer {
  id?: number
  name?: string
  tagline?: string
  first_brewed?: string
  description?: string
  image_url?: string
  contributed_by?: string
  [propName: string]: any
}

export interface BeerState {
  data: Beer[]
  status: Status
  messages: any[]
}

type BeerActionTypes = 
  | FetchFulfilledAction
  | FetchFailedAction
  | SetStatusAction
  | ResetAction

const initState: BeerState = {
  data: [],
  status: "idle",
  messages: []
}

export function beerReducer(state = initState, action: BeerActionTypes ) {
  switch(action.type) {
    case ActionTypes.SET_STATUS:
      return {
        ...state,
        status: action.payload
      }
    case ActionTypes.RESET:
      return {
        ...state,
        status: "idle",
        messages: []
      }
    case ActionTypes.FETCH_FULFILLED:
        return {
          ...state,
          status: "success",
          data: action.payload,
          messages: []
        }
    case ActionTypes.FETCH_FAILED: 
        return {
          ...state,
          status: "failure",
          messages: [{
            type: "error",
            text: action.payload
          }]
        }
    default:
      return state
  }
}