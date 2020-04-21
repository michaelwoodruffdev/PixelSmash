import React, { Component } from 'react';
import './Sidebar.css';


class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: []
        };
        this.addFriendRef = React.createRef();

        this.addFriend = this.addFriend.bind(this);
    }

    componentDidMount() {
        let username = localStorage.getItem("__pixelsmash__username");
        let token = localStorage.getItem("__pixelsmash__token");
        if (!username || !token) {
            window.alert("logged out");
            this.props.history.push('/login');
        }

        this.getFriends();
    }

    getFriends() {

        let username = localStorage.getItem("__pixelsmash__username");
        let token = localStorage.getItem("__pixelsmash__token");

        let requestObj = {
            username,
            token
        }

        fetch("http://ec2-18-222-189-77.us-east-2.compute.amazonaws.com:5000/get_friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestObj)
        })
            .then(res => {
                if (res.status === 404) {
                    return null;
                } else if (res.status === 200) {
                    return res.json();
                }
            })
            .then(res => {
                if (res === null) {
                    window.alert("unable to get friends");
                    return;
                } else {
                    console.log(res);
                    this.setState({
                        friends: res.friends
                    });
                }
            })
    }

    addFriend() {
        let friendToAdd = this.addFriendRef.current.value;

        let requestObj = {
            username: localStorage.getItem("__pixelsmash__username"),
            token: localStorage.getItem("__pixelsmash__token"),
            friendToAdd: friendToAdd
        }

        fetch("http://ec2-18-222-189-77.us-east-2.compute.amazonaws.com:5000/add_friend", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(requestObj)
        })
        .then(res => {
            if (res.status === 404 || res.status === 500) {
                window.alert("Couldn't add friend")
                return null;
            } else {
                window.alert("friend added")
                this.getFriends();
            }
        })
    }

    inviteFriend(friend) {
        console.log('trying to invite ' + friend);
        this.props.socketContext.emit('inviteFriend', friend);
    }

    render() {
        var { friends } = this.state;

        var friendElements = friends.map(friend => {
            return <div className="friend" key={friend} onClick={() => this.inviteFriend(friend)}>{friend}</div>
        });

        return (
            <div className="Sidebar">
                <h2>Friends</h2>
                <div className="input-row">
                    <input type="text" placeholder="add friend..." ref={this.addFriendRef}></input>
                    <button onClick={this.addFriend}>add</button>
                </div>
                <div className="friends-list">
                    {friendElements}
                </div>
            </div>
        );
    }
}


export default Sidebar;