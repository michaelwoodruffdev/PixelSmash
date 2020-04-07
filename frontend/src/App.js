import React from 'react';
import './App.css';
import Login from './layouts/login/Login.js';
import Dashboard from './layouts/dashboard/Dashboard.js';
import Signup from './layouts/signup/signup.js';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} exact />
          <Route path="/dashboard" component={Dashboard} exact/>
          <Route path="/signup" component={Signup} exact/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
