import { action } from 'typesafe-actions'
import { ActionTypes } from './actionTypes'

export const setConfig = (partialObject: any) => {
  return action(ActionTypes.SET_CONFIG, partialObject)
}
