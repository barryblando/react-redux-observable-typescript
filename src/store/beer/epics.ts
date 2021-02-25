import { Epic } from 'redux-observable'
import { 
  map,
  switchMap,
  filter,
  debounceTime,
  catchError,
  withLatestFrom,
  mapTo,
  pluck
} from 'rxjs/operators'
import { concat, of, merge, fromEvent, race, forkJoin } from 'rxjs'
import { isOfType } from 'typesafe-actions'

import { ActionTypes } from './actionTypes'
import { setStatus, fetchFulfilled, fetchFailed, reset } from './actions'
import { Beer } from './beerReducer'
import { RootAction } from '../../configureStore'
import { RootState } from '../reducers'
import * as Services from '../../services/Api'

const API_URL = 'https://api.punkapi.com/v2/beers'

// An `Epic` is the core primitive of redux-observable.
// It is a function which takes a stream of actions and returns a stream of actions. 
// Actions in, actions out.

// The ofType operator offered by redux-observable is not the best way to discriminate union types. A much better way is to use the isOfType function provided by typesafe-actions. https://stackoverflow.com/q/53415353/

// RootAction are the actions that is input and output of the epics.

export const fetchBeersEpic: Epic<
  RootAction, // Actions In
  RootAction, // Actions Out
  RootState, // In case you want to use store, you need a RootState
  typeof Services // dependencies to prevent API redundancy
> = (action$, state$, { getJSON }) => {
  return action$.pipe(
    // filter(isOfType(ACTION_TYPE)) is just a simpler version of 
    // filter(x => x.type === ACTION_TYPE)
    filter(isOfType(ActionTypes.FETCH_DATA)), // Action In
    // for every action that has 'FETCH_DATA' switchMap fn will be executed
    switchMap(() => {
      // concat returns an output observable
      return concat(
        // of creates an Observable/stream out of a non-Observable value (it can be a primitive, an object, a function, anything).
        of(setStatus("pending")), // Set status to pending
        getJSON(API_URL).pipe(
          map(resp => fetchFulfilled(resp as Beer[])) // Action Out
        )
      )
    })
  )
}

export const searchBeersEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  typeof Services
> = (action$, state$, { getJSON, searchInput }) => {
  
  return action$.pipe(
    // this action fires every keystroke
    filter(isOfType(ActionTypes.SEARCH)), 
    // the problem is, switchMap will be executed then cancel current stream 
    // and will proceed to subscribe next action and creating new request. 
    // The way to solve this is to use debounceTime
    // Wait X time, give the last value, reset time.
    debounceTime(500),
    // prevent empty action's payload from making it to switchMap
    filter(({ payload }) => payload.trim() !== ""),
    // withLatestFrom groups emitted values from source stream observable 
    // and state into array so we can access them on the next observable 
    // in the pipe via destructuring assignment
    withLatestFrom(
      // Pluck meant only for picking one of the nested properties of every emitted object.
      state$.pipe(pluck("config")),
      // state$.pipe(pluck("config", "apiBase")),
      // state$.pipe(pluck("user", "authToken")),
    ),
    switchMap(([action, config]) => {
      const ajax$ = 
        getJSON(searchInput(config.apiBase, config.perPage, action.payload))
          .pipe(
            // delay(5000),
            // takeUntil Emits the values emitted by the source Observable 
            // until a notifier Observable emits a value.
            // Never make to fetchFulfill
            // takUntil(action$.pipe(filter(isOfType(ActionTypes.CANCEL))))
            map(resp => fetchFulfilled(resp as Beer[])),
            // if an error occurs, create an Observable of the action to be dispatched on error. 
            // Unlike other operators, catch does not explicitly return an Observable.
            catchError(err => of(fetchFailed(err.response.message)))
          )

      // merge streams cancel action and keyboard events
      const blocker$ = merge(
        action$.pipe(filter(isOfType(ActionTypes.CANCEL))),
        fromEvent<KeyboardEvent>(document, "keyup").pipe(
          filter((evt) => evt.key === "Escape" || evt.key === "Esc")
        ) 
      ).pipe(mapTo(reset())) // either one results to reset

      return concat(
        of(setStatus("pending")),
        // when one produces value first unsubscribe the others
        race(ajax$, blocker$) 
      )
    })
  )
}

export const randomBeersEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  typeof Services
> = (action$, state$, { getJSON, random }) => {
  
  return action$.pipe(
    filter(isOfType(ActionTypes.RANDOM)), 
    withLatestFrom(state$.pipe(pluck("config"))),
    switchMap(([action, config]) => {

      // create a array of certain request length
      const requests = [...Array(config.perPage)]
        .map(() => {
          // pluck 0 to flatten an array of arrays 
          // from this observable [Array(1), Array(1), Array(1)]
          return getJSON(random(config.apiBase)).pipe(pluck('0'))
        })
      
      // forkJoin takes an array of observables, 
      // subscribe to them all, give all results back into one array
      const ajax$ = forkJoin(requests)
        .pipe(
          map(resp => fetchFulfilled(resp as Beer[])),
          catchError(err => {
            return of(fetchFailed(err.response.message))
          })
        )

      // merge streams cancel action and keyboard events
      const blocker$ = merge(
        action$.pipe(filter(isOfType(ActionTypes.CANCEL))),
        fromEvent<KeyboardEvent>(document, "keyup").pipe(
          filter((evt) => evt.key === "Escape" || evt.key === "Esc")
        ) 
      ).pipe(mapTo(reset())) // either one results to reset

      return concat(
        of(setStatus("pending")),
        // when one produces value first unsubscribe the others
        race(ajax$, blocker$) 
      )
    })
  )
}
