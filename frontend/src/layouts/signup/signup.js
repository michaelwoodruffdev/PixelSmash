import React from 'react';
import './signup.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
//import Infobar from '../toolbar/Toolbar';
// import logo from './logo.png';

class signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }

  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value
    })
  }
  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value
    })
  }
  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }
  handleConfirmPasswordChange = (event) => {
    this.setState({
      confirmPassword: event.target.value
    })
  }

  navigateToLogin = () => {
    console.log('clicked');
    this.props.history.push('/login');
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.state.password !== this.state.confirmPassword) {
      window.alert("passwords don't match");
      return;
    }
    if (!this.state.username || !this.state.password || !this.state.email) {
      window.alert("no empty fields please");
    }

    console.log(this.state);

    let requestObject = {
      username: this.state.username, 
      password: this.state.password, 
      email: this.state.email
    }

    console.log(requestObject);

    fetch("http://ec2-18-222-189-77.us-east-2.compute.amazonaws.com:5000/signup", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(requestObject)
    })
    .then(res => {
      console.log(res.status);
      if (res.status === 409) {
        window.alert("user with that username already exists");
        return null;
      } else if (res.status === 500) {
        window.alert("server error");
        return null;
      } else {
        window.alert("user created");
        this.props.history.push('/login');
        return;
      }
    });
    
  }

  render() {
    return (
      // <BodyBackgroundColor backgroundColor = '#FF00F'>
      <div className="container">
        {/* <Infobar/> */}
        <img src='https://www.freelogodesign.org/file/app/client/thumb/bf970f3b-3d14-44fc-b851-5b99674b0139_200x200.png?1581994698035' width="150" height="100" alt='Logo' />
        <Card className="card">
          <CardContent>
            <h1>Sign Up</h1>
            <form onSubmit={this.handleSubmit}>
              <div id="textfields">
                <TextField
                  required
                  id="outlined-required"
                  label="username"
                  defaultValue=""
                  variant="outlined"
                  value={this.state.name}
                  onChange={this.handleUsernameChange}
                  className="name"
                />

                <br></br><br></br>
                <TextField
                  required
                  id="outlined-required"
                  label="email "
                  defaultValue=""
                  variant="outlined"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  className="email"
                />

                <br></br><br></br>
                <TextField
                  required
                  id="outlined-required"
                  label="Password"
                  defaultValue="Password"
                  type="password"
                  variant="outlined"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  className="password"
                />
                <br></br><br></br>
                <TextField
                  required
                  id="outlined-required"
                  label="confirm password"
                  defaultValue=""
                  type="password"
                  variant="outlined"
                  value={this.state.confirmPassword}
                  onChange={this.handleConfirmPasswordChange}
                  className="password"
                />
                <br></br>
              </div>
              <div className="buttons">
                <Button variant="contained" id="back" onClick={this.navigateToLogin}>
                  Back
                </Button>
                <Button variant="contained" type="submit" id="create" onclick={this.handleSubmit}>
                  Create Account
                </Button>

              </div>
            </form>
          </CardContent>
        </Card>
        <br></br><br></br><br></br><br></br><br></br>
      </div>
      // </BodyBackgroundColor>

    );
  }
}

export default signup; 
