import React from 'react';
import './signup.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

    handleUserNameChange = (event) => {
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
      }

    render(){
        return(
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
                    defaultValue="Surname"
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
                    variant="outlined"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                    className="password"
                    />
                    <br></br>
                </div>
                <Button variant="contained" color="primary" type="submit" id="create">
                    Create Account
                </Button>
            </form>
            </CardContent>
        </Card>
        
        );
    }
}

export default signup; 