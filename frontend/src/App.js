import React from 'react';
import './App.css';
import Login from './layouts/login/Login.js';
import Dashboard from './layouts/dashboard/Dashboard.js';
import Signup from './layouts/signup/signup.js';
import { Socket, SocketContext } from 'react-socket-io';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

function App() {
  const uri = "ec2-18-222-189-77.us-east-2.compute.amazonaws.com:5000";

  Dashboard.contextType = SocketContext;

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/signup" component={Signup} exact />
          <Socket uri={uri} options={{ transports: ['websocket'] }}>
            <Route path="/dashboard" component={Dashboard} exact />
          </Socket>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
