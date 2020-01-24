import React from 'react';
import './App.css';
import Login from './layouts/login/Login.js';
import Dashboard from './layouts/dashboard/Dashboard.js';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={Login} exact/>
          <Route path="/login" component={Login} exact />
          <Route path="/dashboard" component={Dashboard} exact/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
