var express = require('express');
var app = express();
const logger = require('morgan');

// Import CORS to send data to and from frontend
const cors = require('cors');

var socketApp = require('http').createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end()})
  , io = require('socket.io').listen(socketApp)
  , fs = require('fs')


app.use(cors({
        origin : 'http://18.222.189.77:3000',
        credentials : true
        })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
const mysql = require('mysql');

const connection = mysql.createConnection({

        // Database server credentials

        host : "localhost",
        user : "pixeldev",
        database : "pixel",
        password : "12345"
})


var users = [];
var query = "select * from user";
        connection.query(query, function(err,result,fields)
        {
                // Checks for error

                if(err)throw(err);

                // Checks if the list variable result is empty
                // , if so then the user is not found

                if(result.length == 0)
                {
        //              console.log(req.body);
                        users =[];
                }

                else{
                        console.log(result);

                        users = result;

                }
        });


app.get('/user_info', function(req,res) {
	
return res.send(users);

})

app.post('/create_user', function(req,res) {
	var username = req.body.name;
	var surname = req.body.surname;
	var password = req.body.password;
	var idUser = users.length + 1;
	var email = req.body.email;

	var query = "insert into user values ('"+idUser+"','"+username+"','"+username+"','"+surname+"','"+email+"','"+password+"');";

	connection.query(query, function(err,result){
		if(err.code == 'ER_DUP_ENTRY')console.log("User already exists");

		else console.log("New user added successfully!");
	});
});
app.get('/', function (req, res) {
   res.send('Hello World');
})

app.get('/main',(req,res)=>{
	io.sockets.on('connection', function(socket) {
		console.log('user has connected');
	});
});

var server = app.listen(5000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
