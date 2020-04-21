import React, { Component } from 'react';
import './Lobby.css';

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joinedUser: "empty slot"
        }
    }
    render() {
        return (
            <div className="Lobby">
                <h1>Lobby</h1>
                <div className="user">
                    {this.props.loggedInUser}
                </div>
                <div className="user">
                    {this.state.joinedUser}
                </div>

                <button className="start-button">Start Game</button>
            </div>
        );
    }
}

export default Lobby;
