import { applyMiddleware, compose, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { ActionType } from 'typesafe-actions'

import { rootEpic, rootReducer, RootState } from './store/'
import * as actions from './store/actions'
import * as Services from './services/Api'

export type RootAction = ActionType<typeof actions>

const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  typeof Services
>({ dependencies: Services })

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(preloadedState?: any) {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        epicMiddleware
        // ... other middlewares ...
      )
    )
  )

  epicMiddleware.run(rootEpic)

  return store
}