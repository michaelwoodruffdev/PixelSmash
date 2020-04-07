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
            name: '',
            surename:'',
            email:'',
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

    handleNameChange = (event) => {
        this.setState({
          name: event.target.value
        })
      }
      handleSurnameChange = (event) => {
        this.setState({
          surename: event.target.value
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

    handleSubmit = (event) => {
        event.preventDefault()
        console.log(this.state)     //print the form data to the console
        axios.post('http://localhost:3001/validate_user', this.state)   //axios is an http api
        .then(response => {
        console.log(response)
      })
        .catch(error => {
        console.log(error)
      })
      }

    render(){
        return(
        // <BodyBackgroundColor backgroundColor = '#FF00F'>
        <div className="container">
        {/* <Infobar/> */}
        <img src='https://www.freelogodesign.org/file/app/client/thumb/bf970f3b-3d14-44fc-b851-5b99674b0139_200x200.png?1581994698035'  width="150" height="100" alt='Logo'/>
        <Card className="card">
            <CardContent>
            <form onSubmit={this.handleSubmit}>
                <div id="textfields">
                    <div id="names">
                    <TextField 
                    required
                    id="outlined-required"
                    label="Name"
                    defaultValue="Name"
                    variant="outlined"
                    value={this.state.name} 
                    onChange={this.handleNameChange}
                    className="name" 
                    />
                    {" "}
                    <TextField 
                    required
                    id="outlined-required"
                    label="Surname"
                    //defaultValue="Surname"
                    variant="outlined"
                    value={this.state.surname} 
                    onChange={this.handleSurnameChange} 
                    className="surname"
                    />
                    </div>
                    
                    <br></br>
                    <TextField 
                    required
                    id="outlined-required"
                    label="Email "
                    defaultValue="Email"
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
                    <br></br>
                </div>
                <Button variant="contained"  type="submit" id="create">
                    Create Account
                </Button>
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
