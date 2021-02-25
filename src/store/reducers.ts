import { combineReducers } from 'redux'
import { createSelectorHook } from 'react-redux'

import { BeerState, beerReducer } from './beer'
import { ConfigState, configReducer } from './config'

export interface RootState {
  beer: BeerState
  config: ConfigState
}

export const rootReducer = combineReducers({
  config: configReducer,
  beer: beerReducer,
  // other: otherReducer
})

// reuse selector hook w/ RootState and get type checking anywhere
export const useSelector = createSelectorHook<RootState>()
