import React from 'react'
import { Route, Switch } from 'react-router-dom'

import NavBar from '../components/NavBar'

import Dashboard from '../pages/Dashboard'
import NoMatch from '../pages/NoMatch'
import Beer from '../pages/Beer'

const routes = (
  <div>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/beer" component={Beer} />
        <Route component={NoMatch} />
      </Switch>
  </div>
)

export default routes