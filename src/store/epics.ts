import { combineEpics } from 'redux-observable'
import { values } from 'ramda'

import * as beerEpics from './beer/epics'
import * as configEpics from './config/epics'

export const rootEpic = combineEpics(
  ...values(beerEpics),
  ...values(configEpics),
)