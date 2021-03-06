// Import ExpressJS for backend
var express = require('express');

// Here I will import the CryptoJS library
// to encrypt the data that will be transferred 
var crypto = require("crypto-js");

// Create app
var app = express();

// Import morgan package
const logger = require('morgan');

// Import CORS to send data to and from frontend
const cors = require('cors');


var socketApp = require('http').createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end()})
  , io = require('socket.io').listen(socketApp)
  , fs = require('fs')


// This is necessary for sending data to web pages
app.use(cors());
//app.use(cors({
//        origin : 'http://18.222.189.77:3000',
//        credentials : true
//        })
//);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));


// As part of the authorization process I will tolkenize some
// credentials using JSON Web Tokens, one thing needed for this is a header
// which consists of the type of token, which for our case will be
// JWT and the signing algorithm that will be used that could be RSA
var header = {
	"alg" : "HS256",
	"typ" : "JWT"
};

// Import MySQLlibrary to fetch data
// from database
const mysql = require('mysql');


// Authentication data for database
const connection = mysql.createConnection({
        // Database server credentials
        host : "localhost",
        user : "pixeldev",
        database : "pixel",
        password : "12345"
})



// Users array
var users = [];
var nextUserId = -1;
var query = "select * from user";


// Here we get information of all users in the
// database
        connection.query(query, function(err,result,fields)
        {
                // Checks for error
                if(err)throw(err);

                // Checks if the list variable result is empty
                // , if so then the user is not found
                if(result.length == 0)
                {
        				// console.log(req.body);
                        users =[];
                }
                else{
                        console.log(result);
                        users = result;
			nextUserId = users.length + 1;
		}

        });

var id = 0;



// Send user data to login form for authentication
app.get('/user_info', function(req,res) {
	return res.send(users);
});

//const { v4: uuidv4 } = require('uuid');

app.post('/signup', (req, res) => {
	console.log(req.body);
	let requestObj = {
		nextUserId, 
		username: req.body.username, 
		password: req.body.password, 
		email: req.body.email
	};
	console.log(requestObj);
	let signupQuery = `insert into user values ("${nextUserId++}", "${req.body.username}", "${req.body.username}", "${req.body.username}", "${req.body.email}", "${req.body.password}");`;

	connection.query(signupQuery, function(err, result) {
		if(err) {
			console.log(err.code);
			if (err.code === 'ER_DUP_ENTRY') {
				res.status(409).end();
				return;
			} else {
				res.status(500).end();
				return;
			}
		} 
		res.status(200).end();
		return;
	});
	return;
});



// Creates user and inserts user record to database
app.post('/create_user', function(req,res) {

	// Fetch user information
	// from request body
	var username = req.body.name;
	var surname = req.body.surname;
	var password = req.body.password;
	var idUser = users.length + 1;
	var email = req.body.email;
	

	// Store information in an object
	var userInfo = {
		"username" : username,
		"password" : password,
		"surname" : surname,
		"id" : idUser,
		"email" : email
	};

	// Encrypt user information
	var encryptedUserInfo = crypto.AES.encrypt(JSON.stringify(req.body), 'secret key 123').toString();

	// Decrypts user's information
	var decryptedUserInfo = crypto.AES.decrypt(JSON.stringify(encryptedUserInfo), 'secret key 123').toString()

	// This query will insert a new user as a new record to the table user
	var query = "insert into user values ('"+idUser+"','"+username+"','"+username+"','"+surname+"','"+email+"','"+password+"');";
	
	// Here the query will be run and we will check for a duplicate entry
	connection.query(query, function(err,result){
		if(err){
			if(err.code == 'ER_DUP_ENTRY')console.log("User already exists");
			else console.log("There was error");
		}
		else {
			 // Update user array after adding user
                        query = "select * from user";
                        connection.query(query, function(err,result,fields)
                        {
                                // Checks for error
                                if(err)throw(err);

                                // Checks if the list variable result is empty
                                // , if so then the user is not found
                                if(result.length == 0)
                                {
                        				// console.log(req.body);
                                        users =[];
                                }
                                else{
                                        console.log(result);
                                        users = result;
                                }
                        });
		}
	});
});

// Test
app.get('/', function (req, res) {
   res.send('Hello World');
})


const verifyToken = (token) => {
	try {
		jwt.verify(token, supersecretkey);
	} catch(err) {
		return false;
	} 
	return true;
}

app.post('/add_friend', (req, res) => {
	//if (!verifyToken(req.body.token)) {
	//	res.status(409).end();
	//	return;
	//}

	let getFriendToAddIdSQL = `select iduser from user where username = "${req.body.friendToAdd}";`;
	let getOwnIdSQL = `select iduser from user where username = "${req.body.username}";`;

	connection.query(getFriendToAddIdSQL, true, (error, friendResults, fields) => {
		console.log(friendResults);
		if (friendResults.length === 0) {
			console.log('hello?');
			res.status(404).end();
			return;
		} else {
			connection.query(getOwnIdSQL, true, (error2, ownResults, fields) => {
				if (ownResults.length === 0) {
					res.status(404).end();
					return;
				} else {
					let friendToAddId = friendResults[0].iduser;
					let ownId = ownResults[0].iduser;
					let insertFriendSQL = `insert into friend values (${ownId}, ${friendToAddId});`;
					connection.query(insertFriendSQL, (err, result) => {
						if (err) {
							res.status(500).end();
							return;
						} else {
							res.status(200).end();
							return;
						}
					});
				}
			});
		}
	});		
});

app.post('/get_friends',(req,resp)=>{
	// This secret variable will store the tokenized version of the object
	var secret = "";

	// This is the code that encrypts the user's information
	secret = crypto.Rabbit.encrypt(JSON.stringify(req.body), 'secret key 123').toString();

	//console.log("Encrypted info :",secret);
	var payload = JSON.parse(crypto.enc.Utf8.stringify(crypto.Rabbit.decrypt(secret, 'secret key 123')));
	//console.log("Decrypted info: ",payload);

	var username = payload.username;

	var sql = 'CALL getUserId("'+username+'")';
	
	var userInfo = {
		username : username,
		friends : []
	};
	connection.query(sql,true,(error,results,fields) => {
		if(error)
		{
			resp.status(500).end();
			return;
			//console.error(error.message);
		}
		console.log(results);
		if (results[0].length === 0) {
			resp.status(404).end();
			return;
		}

		// The previous stored procedure will only return 
		// the id of the user that has logged so it will return one
		// id, in the following code we will print to the console
		// all the friends of the user
		results[0].forEach((result) =>
			{
				// This console.log statement prints the id pertaining to the user with the
				// given username
				id = result.iduser;
				//console.log(`User id for `+username+` is `+id);

				// Now we are getting the friends of this user using the 
				// user's id and calling the stored procedure
				// getFriends

				var sql2 = "CALL getFriends("+id+")";
//				console.log("The friends of "+username+" are");
				connection.query(sql2,true,(err,res,param)=>{
					
					if(err) {
						resp.status(404).end();
						return;
						console.error(err.message);
					}
					res[0].forEach((i) =>
						{
							userInfo.friends.push(i.username);
					//		console.log(userInfo);
						});
				
					return resp.send(userInfo);
				});

				//console.log(userInfo);
					
			});
	});
	//console.log(userInfo);
});

var jwt = require('jsonwebtoken');
var supersecretkey = 'supersecretkey';
app.get('/jwttesting', (req, res) => {
	let token = jwt.sign({ foo: 'bar' }, supersecretkey);
	console.log(`token: ${token}`);
	res.json({ token: token }).status(200).end();
});


app.post('/signin', (req, res) => {
	// attempt to find user with username and password, if found, sign token and send in response
	console.log(req.body);
	let signinQuery = `select * from user where username = "${req.body.username}" and password = "${req.body.password}";`;
	connection.query(signinQuery, true, (error, results, fields) => {
		if (error) {
			console.log(error);
			res.status(500).end();
			return;
		}
		if (results.length === 0) {
			res.status(401).end();
			return;
		}
		let token = jwt.sign({}, supersecretkey, { expiresIn: '1h' });
		res.json({ token: token }).status(200).end();
	});
});

app.post('/verifyTokenTest', (req, res) => {
	console.log(verifyToken(req.body.token));
	res.status(200).end();
});


// WEB SOCKET SECTION
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var lobbyNo = 1;
var gameLobbies = {};
var loggedInUsers = {};

io.on('connection', function(socket) {

	// track logged in user
	socket.emit('getUserInfo');
	socket.on('getUserInfoHeard', function(username) {
		socket.username = username;
		loggedInUsers[username] = socket;
	});

	// friend invites and lobby creation
	socket.on('inviteFriend', function(friendToInvite) {
		if (!loggedInUsers.hasOwnProperty(friendToInvite)) {
			socket.emit('inviteFriendHeard', false);
		} else {
			loggedInUsers[friendToInvite].emit('invitationHeard', socket.username);
			socket.emit('inviteFriendHeard', true);
		}
	});

	socket.on('acceptInvite', function(inviteSender) {
		// join game lobby
		let hostSocket = loggedInUsers[inviteSender];
		hostSocket.join(`lobby-${lobbyNo}`);
		hostSocket.lobbyNo = lobbyNo;

		let guestSocket = socket;
		guestSocket.join(`lobby-${lobbyNo}`);
		guestSocket.lobbyNo = lobbyNo;
		
		// setup game lobby
		gameLobbies[`lobby-${lobbyNo}`] = {
			started: false, 
			host: inviteSender, 
			guest: socket.username, 
			hostFighter: '', 
			guestFighter: '', 
			hostSocket: hostSocket, 
			guestSocket: guestSocket, 
			hostFighterKey: '', 
			guestFighterKey: '', 
			lobbyNo: lobbyNo, 
			playersReady: 0
		};


		// notify client of guest joining
		hostSocket.emit('guestJoined', socket.username, lobbyNo);
		guestSocket.emit('joinHost', hostSocket.username, lobbyNo);

		lobbyNo++;
	});

	socket.on('startGame', function() {
		let gameLobby = gameLobbies[`lobby-${socket.lobbyNo}`];
		let hostSocket = loggedInUsers[gameLobby.host];
		let guestSocket = loggedInUsers[gameLobby.guest];

		gameLobby.started = true;

		hostSocket.emit('getFighterKey');
		guestSocket.emit('getFighterKey');
	});

	socket.on('getFighterKeyHeard', function(fighterKey, fighter) {
		let gameLobby = gameLobbies[`lobby-${socket.lobbyNo}`];
		let isHost = (socket.username === gameLobby.host);
		socket.isHost = isHost;
		if (isHost) {
			gameLobby.hostFighterKey = fighterKey;
			gameLobby.hostFighter = fighter;
		} else {
			gameLobby.guestFighterKey = fighterKey;
			gameLobby.guestFighter = fighter;
		}
		gameLobby.playersReady++;
		if (gameLobby.playersReady === 2) {
			console.log('ready for match to start');
			gameLobby.hostSocket.emit('gameReadyToStart', gameLobby.hostFighterKey, gameLobby.hostFighter, gameLobby.guestFighter, gameLobby.hostFighterKey, gameLobby.guestFighterKey);
			gameLobby.guestSocket.emit('gameReadyToStart', gameLobby.guestFighterKey, gameLobby.hostFighter, gameLobby.guestFighter, gameLobby.hostFighterKey, gameLobby.guestFighterKey);
			console.log('emitted game ready to start');
		}
	});

	// input listening
	socket.on('leftPress', function(fighterkey, lobby) {
		console.log(`${fighterkey} is trying to move left in lobby ${lobby}`);
		io.in(`lobby-${lobby}`).emit('leftHeard', fighterkey);
	});

	socket.on('rightPress', function(fighterkey, lobby) {
		io.in(`lobby-${lobby}`).emit('rightHeard', fighterkey);
	});

	socket.on('leftRightRelease', function(fighterkey, lobby) {
		io.in(`lobby-${lobby}`).emit('leftRightRelease', fighterkey);
	});

	socket.on('upPress', function(fighterkey, lobby) {
		io.in(`lobby-${lobby}`).emit('upHeard', fighterkey);
	});

	// triggered by player1 if player2 leaves and visa-verca
	socket.on('manualDisconnect', function() {
		socket.disconnect();
	});

	// host triggers syncronize every once in a while
	socket.on('hostUpdate', function(updateObj) {
		io.in(`lobby-${updateObj.lobbyNo}`).emit('syncFighters', updateObj);
	});

	socket.on('syncFighter', function(updateObj, lobbyNo) {
		socket.to(`lobby-${lobbyNo}`).emit('syncFighterHeard', updateObj, updateObj.fighterKey);
	});

	socket.on('latencyPing', function() {
		socket.emit('latencyPong');
	});


	// clean up lobbies on disconnection
	socket.on('disconnect', function() {
		delete loggedInUsers[socket.username];
	});
});

http.listen(5000, function() {
	console.log('listening on 5000');
});

