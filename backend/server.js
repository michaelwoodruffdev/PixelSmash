// Import express module to create express app

const express = require('express');





// Create express application

const app = express();




// Gets directory path

const path = require('path');




// Import body-parser for I guess
// parsing information from the request body
// that the app gets from the forms?

const bodyParser = require('body-parser');




// Yeah, I don't know about this one
// just bear with me

const multer = require('multer');
var upload = multer();




// Import mysql to send data to database

const mysql = require('mysql');




// Sets up MySQL connection

const connection = mysql.createConnection({

	// Database server credentials
	
	host : "localhost",
	user : "root",
	database : "usersTest",
	password : "12345"
});




// When the user of the application sends form
// data the data will be encoded, to extract the encoded data
// the application will use express's urlencoded

app.use(express.urlencoded());




// for parsing application/json

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(upload.array());
app.use(express.static('public'));





// Displays login page where user logs in

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')));







// Sends user to html page for user creation

app.get('/create_user', (req,res) => res.sendFile(path.join(__dirname+'/create.html')));









// Validate user information

app.post('/validate_user', (req,res) => {

	console.log(req.body);

	// Fetch user credentials from login for by getting
	// username and password attributes from req.body
	
	var username = req.body.username;

	var password = req.body.password;

	

	// Query for selecting records from database 
	// with the username and password that were specified
	// in the login form
	
	var query = "select * from userInfo where username = '"+username+"' and password = '"+password+"'";

		
	connection.query(query, function(err,result,fields)
	{
		// Checks for error

		if(err)res.send("User was not found!");
			
		// Checks if the list variable result is empty
		// , if so then the user is not found 

		if(result.length == 0)res.send("User was not found!");
			
		else{
			console.log(result);
	
			res.send("User found!");
		}
	});

	
});









// Create a new user

app.post('/new_user', (req,res) => {
	
	console.log(req.body);
	
	//res.send(" Request succeeded");
	// User Creation logic here
	
	
	
	// SQL query to insert user to userInfo table
	// in usersTest database
	
	
	
	// Gets id of new user
	
	var i = 0;

	
	
	// Gets new username
	
	var username = req.body.username;
	
	
	
	// Gets new password
	
	var password = req.body.password;

	

	
	
	// Query for creating new users
	
	var query = "insert into userInfo values ('"+i+"','"+username+"','"+password+"');";
	
	console.log("Test");

	
	
	
	// Executes query
	
	connection.query(query, function(error, result) {
		
		console.log("Processing query");

		// Checks for duplicate user

		if(error)
		{	
				if(error.code ==='ER_DUP_ENTRY')res.send("User already exists!");
				console.log("User could not be added because user already exists!");
		//		throw error.code;
				
				// Catch error
				
				connection.on('error', function(error) {
					
					// I gues this prints the error

					console.log("[mysql error]",error);
				});	
		}

		else{
			
			// Message for successful query execution

			res.send("New user added successfully");
		}

	});
	
});


// socket testing
app.get('/testing', (req, res) => {
	res.status(200).send({ hello: "world" }).end();
});

const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on('connection', socket => {
	socket.emit('connected');
	console.log('new socket connected');

	socket.on('hello', () => {
		console.log('hello????');
	});

	socket.on('leftPressed', (fighterKey) => {
		console.log('left is being pressed by ' + fighterKey);
	});
});


// Port number is 3000

const port = 8080;



// Listening to port 3000 message

http.listen(port, () => console.log(`Listening on port ${port} ...`));
