import { action } from 'typesafe-actions'
import { Beer } from './beerReducer'
import { ActionTypes } from './actionTypes'
import { Status } from './types'

// use typesafe action for type inference and consistency
export const fetchData = () => action(ActionTypes.FETCH_DATA)

export const cancel = () => action(ActionTypes.CANCEL)

export const reset = () => action(ActionTypes.RESET)

export const fetchFulfilled = (beers: Beer[]) => {
  return action(ActionTypes.FETCH_FULFILLED, beers)
}

export const fetchFailed = (message: string) => {
  return action(ActionTypes.FETCH_FAILED, message)
}

export const setStatus = (status: Status) => {
  return action(ActionTypes.SET_STATUS, status)
}

export const search = (input: string) => {
  return action(ActionTypes.SEARCH, input)
}

export const random = () => action(ActionTypes.RANDOM)



