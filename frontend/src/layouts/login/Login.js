import React from 'react';
import './Login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Infobar from '../toolbar/Toolbar';



class login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);

  }


  //runs on every keystroke to update the React state, the displayed value will update as the user types
  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value
    })
  }
  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }


  handleSubmit = (event) => {
    event.preventDefault()      //prevent refreshing the page

    let requestObject = {
      username: this.state.username, 
      password: this.state.password
    }

    fetch("http://ec2-18-222-189-77.us-east-2.compute.amazonaws.com:5000/signin", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(requestObject)
    })
    .then(res => {
      if (res.status === 500) {
        window.alert('server error');
        return null;
      } else if (res.status === 401) {
        window.alert('bad username or password')
        return null;
      } else {
        return res.json();
      }
    })
    .then(res => {
      if (res == null) {
        return;
      }
      localStorage.setItem("__pixelsmash__token", res.token);
      localStorage.setItem("__pixelsmash__username", requestObject.username);
      this.props.history.push("/dashboard");
    });
  }

  onNavigateSignup() {
    this.props.history.push("/signup");
  }

  render() {
    return (
      <div className="container">                            {/*in react you can only return one element, that's why you need to wrap the code in one div */}
        <Infobar></Infobar>
        <br></br><br></br> <br></br><br></br>
        {/* <img src='https://www.freelogodesign.org/file/app/client/thumb/bf970f3b-3d14-44fc-b851-5b99674b0139_200x200.png?1581994698035' width="150" height="100" alt='Logo' /> */}
        <Card className="card">
          <CardContent>
            <h1 className="lgin_title">Login</h1>
            <form onSubmit={this.handleSubmit} className="form">
              <div id="textfields">
                <TextField
                  required
                  id="outlined-required"
                  label="Username"
                  defaultValue="Username"
                  variant="outlined"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                />
                <br></br>
                <br></br>
                <br></br>
                <TextField
                  required
                  id="outlined-required"
                  label="Password"
                  type="password"
                  defaultValue="PAssword"
                  variant="outlined"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  className="input"
                />
                <br></br>
              </div>
              <div id="buttons">
                <Button id="login" variant="contained" type="submit">
                  Login
                  </Button>
                <Button onClick={this.onNavigateSignup.bind(this)} variant="contained" type="submit" id="signup">
                  Signup
                  </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default login;
