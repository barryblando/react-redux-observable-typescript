import { Epic } from 'redux-observable'
import { 
  filter,
  ignoreElements,
  pluck,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
import { isOfType } from 'typesafe-actions'

import { ActionTypes } from './actionTypes'
import { RootAction } from '../../configureStore'
import { RootState } from '../reducers'
import { EMPTY, of } from 'rxjs'
import { setConfig } from './actions'

const CACHE_KEY = 'ro-config'

export const persistEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = (action$, state$) => {
  return action$.pipe(
    filter(isOfType(ActionTypes.SET_CONFIG)),
    withLatestFrom(state$.pipe(pluck("config"))),
    // tap performs a side effect for every emission on the source Observable
    // I recommend using `tap` for side-effects things only. If you somehow
    // transform the emit use `map` or other more specialized operators.
    tap(([action, config]) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(config))
    }),
    ignoreElements()
  )
}

export const hydrateEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = () => {
  const maybeConfig = localStorage.getItem(CACHE_KEY)
  if (typeof maybeConfig === "string") {
    try {
      const parsed = JSON.parse(maybeConfig)
      return of(setConfig(parsed))
    } catch(e) {
      // EMPTY is an observable that doesn't produce any value
      // it just completes the stream successfully
      return EMPTY
    }
  }
  return EMPTY
} 