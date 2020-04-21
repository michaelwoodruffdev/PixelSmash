import React, { Component } from 'react';
import './Lobby.css';
import { Event } from 'react-socket-io';

class Lobby extends Component {
    constructor(props) {
        super(props);
        let host = this.props.loggedInUser;
        this.state = {
            host: localStorage.getItem("__pixelsmash__username"), 
            guest: "empty slot",
            isHost: true
        }

        this.onGuestJoined = this.onGuestJoined.bind(this);
        this.onJoinHost = this.onJoinHost.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    onGuestJoined(guest) {
        this.setState({
            guest: guest, 
            isHost: true
        });
    }

    onJoinHost(host) {
        this.setState({
            guest: this.props.loggedInUser, 
            isHost: false, 
            host: host
        });
    }

    startGame() {
        if (!this.state.isHost) {
            window.alert("you are not the host");
        } else if (this.state.guest === "empty slot") {
            window.alert("waiting for opponent to join");
        } else {
            this.props.socketContext.emit("startGame");
        }
    }

    render() {
        var { host, guest }  = this.state;

        return (
            <div className="Lobby">
                <h1>Lobby</h1>
                <div className="user">
                    {host}
                </div>
                <div className="user">
                    {guest}
                </div>

                <button className="start-button" onClick={this.startGame}>Start Game</button>
                <Event event="guestJoined" handler={this.onGuestJoined} />
                <Event event="joinHost" handler={this.onJoinHost} />
            </div>
        );
    }
}

export default Lobby;
