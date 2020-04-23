import React, { Component } from 'react';
import './Lobby.css';
import { Event } from 'react-socket-io';

class Lobby extends Component {
    constructor(props) {
        super(props);

        this.characterRef = React.createRef();

        this.startGame = this.startGame.bind(this);
        this.onGetFighterKey = this.onGetFighterKey.bind(this);
    }

    startGame() {
        if (!this.props.isHost) {
            window.alert("you are not the host");
        } else if (this.props.guest === "empty slot") {
            window.alert("waiting for opponent to join");
        } else {
            this.props.socketContext.emit("startGame");
        }
    }

    onGetFighterKey() {
        let fighter = this.characterRef.current.value;
        let fighterKey = this.characterRef.current.value;
        fighterKey += (this.props.isHost ? this.props.host : this.props.guest);
        console.log(fighterKey);
        this.props.socketContext.emit("getFighterKeyHeard", fighterKey, fighter);
    }

    render() {
        var { host, guest }  = this.props;

        return (
            <div className="Lobby">
                <h1>Lobby</h1>
                <div className="user">
                    {host}
                </div>
                <div className="user">
                    {guest}
                </div>

                <select id="character" ref={this.characterRef}>
                    <option value="dhonu">Dhonu</option>
                    <option value="billnbob">BillnBob</option>
                </select>

                <button className="start-button" onClick={this.startGame}>Start Game</button>
                <Event event="getFighterKey" handler={this.onGetFighterKey} />
            </div>
        );
    }
}

export default Lobby;
