import React from 'react';
import './Login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


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

    componentDidMount(){
                fetch('http://18.222.189.77:5000/user_info')
                .then(res=> {
                        console.log(res);
                        return res.json();
                })
                .then(users=>{
                        console.log(users);
                        this.setState({ users })
                });
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
        var userFound = false;
          for(var i = 0; i < this.state.users.length ; i++)
          {
                  if(this.state.username == this.state.users[i].username && this.state.password == this.state.users[i].password)
                  {
                          console.log("Access Granted");
                          userFound = true;



                        axios
                        .post("http://18.222.189.77:5000/main", this.state)
                          .then(()=>console.log("User login successful"))
                        .catch(err => {
                                console.log(err);
                        });
                  }
          }


  }

  onNavigateSignup(){
    this.props.history.push("/signup");
  }


  render() {
    return (
      <div className="container">                            {/*in react you can only return one element, that's why you need to wrap the code in one div */}   
      <img src='https://www.freelogodesign.org/file/app/client/thumb/bf970f3b-3d14-44fc-b851-5b99674b0139_200x200.png?1581994698035'  width="150" height="100" alt='Logo'/>                                   
        <Card className="card">
          <CardContent>
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
            </CardContent>
          </Card>
          <br></br><br></br><br></br>
          <br></br><br></br><br></br>
      </div>
    );
  }
}

export default login;
