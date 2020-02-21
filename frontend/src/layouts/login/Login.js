import React from 'react';
import './Login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Infobar from '../toolbar/Toolbar';
import axios from 'axios';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';


// function Login() {
//   return (
//       <Card className="loginCard">
//         <CardContent>
//         <div className="Login">
//           <h1>Login Page ooweee</h1>
//         </div>
//         <form>
//           <label>
//             Name:
//             <input type="text" name="name" />
//           </label>
//           <input type="submit" value="Submit" />
//         </form>
//         </CardContent>
//       </Card>
//   );
// }
//  export default Login;


class login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

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
    console.log(this.state)     //print the form data to the console
    axios.post('http://localhost:3001/validate_user', this.state)   //axios is an http api
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })

  }


  render() {
    return (
      <div>                                  {/*in react you can only return one element, that's why you need to wrap the code in one div */}                                      
      <Infobar />
      <form onSubmit={this.handleSubmit} id="form">
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
          defaultValue="PAssword"
          variant="outlined"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          className="input"
        />
        <br></br>
        </div>
        <div id="buttons">
          <Button id="login" variant="contained" color="primary" type="submit">
              Login
          </Button>
          <Button variant="contained" color="primary" type="submit" id="signup">
              Signup
          </Button>
        </div>

        {/*This is the old method without Material UI*/}
        {/*I temporarly need this part PLEASE DON"T DELETE!!  */}

        {/* <label>Username:</label>
          <input 
            type="text" 
            value={this.state.username} 
            onChange={this.handleUsernameChange} 
          /> */}
        
        {/* <label>Password:</label>
          <input
            type="text"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          /> */}
          {/* <button type="submit">Login</button>
          <button type="submit">Signup</button> */}
          
      </form>
      </div>
    );
  }
}

export default login;