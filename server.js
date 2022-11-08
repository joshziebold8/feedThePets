/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();
var login = ""

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'petsdb',
	user: 'postgres',
	password: 'pwd'
};
var familyIdAfterLogin = 123

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


app.get('/', function(req, res) {
	res.render('pages/signin',{
		local_css:"signin.css",
		my_title:"Login Page"
	});
});

app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});

app.get('/home', function(req, res) {
	var query = "select * from users where familyId = '" + familyIdAfterLogin+ "';";
	db.any(query)
        .then(function (rows) {
         console.log(rows)   
            res.render('pages/home',{
				my_title: "Home Page",
			})
        
        })
        .catch(function (err) {
            // console.log('error', err);
            res.render('pages/home', {
                my_title: 'Home Page',
            })
        })
});

app.get('/petProfile', function(req, res) {
	var pets = "select * from pets where familyId = '" + familyIdAfterLogin+ "';";
    db.task('get-everything', task => {
        return task.batch([
            task.any(pets)
        ]);
    })
        .then(data => {
            console.log(data)
            res.render('pages/petProfile',{
				my_title: "Pet Profile",
                pets: data[0],
                pet: data[0][0]
			})

        })
        .catch(err => {
            console.log('Uh Oh I made an oopsie');
            console.log(err);
            res.render('pages/petProfile', {
                my_title: 'Pet Profile',
                pets: '',
                pet: ''
            })
        });
});


//TODO
app.get('/petProfile/pet', function(req,res){
    var pets = "select * from pets where familyId = '" + familyIdAfterLogin+ "';";
    //var pet_choice = req.query.pet_choice;
    //console.log(req.query.pet_choice);
    //var pet = "select * from pets where pet_name = '" + pet_choice + "';";
    db.task('get-everything', task => {
        return task.batch([
            task.any(pets),
        ]);
    })
        .then(data => {
            console.log(data[0][0]);
            res.render('pages/petProfile',{
                my_title:"Pet Info",
                pet: data[0][0],
                pets: data[0]
            })
        })
        .catch(err => {
            console.log(err);
            res.render('pages/petProfile',{
                my_title: "Player Info",
                pet: '',
                pets: '',
            })
        });
});



app.get('/userProfile', function(req, res) {
	var users = "select * from users where familyId = '" + familyIdAfterLogin+ "';";
    db.task('get-everything', task => {
        return task.batch([
            task.any(users)
        ]);
    })
        .then(data => {
            console.log(data)
            res.render('pages/userProfile',{
				my_title: "User Profile",
                users: data[0],
                userInfo: data[0][0]
			})

        })
        .catch(err => {
            console.log('Uh Oh I made an oopsie');
            console.log(err);
            res.render('pages/userProfile', {
                my_title: 'User Profile',
                users: '',
                userInfo: ''
            })
        });
});





app.get('/petRegistration', function(req, res) {
	var query = 'select * from pets;';
	db.any(query)
        .then(function (rows) {
            res.render('pages/petRegistration',{
				my_title: "Pet Registration",
			})

        })
        .catch(function (err) {
            console.log('error', err);
            res.render('pages/petRegistration', {
                my_title: 'Pet Registration',
            })
        })
});

app.get('/signin', function(req, res) {
	var query = 'select * from users;';
	db.any(query)
        .then(function (rows) {
            res.render('pages/signin',{
				my_title: "Signin Page",
			})
        })
        .catch(function (err) {
            console.log('error', err);
            res.render('pages/signin', {
                my_title: 'Signin',
            })
        })
});


app.get('/calendar', function(req, res) {
	var query = 'select * from users;';
	db.any(query)
        .then(function (rows) {
            res.render('pages/googlecalendar',{
				my_title: "Calendar",
			})

        })
        .catch(function (err) {
            console.log('error', err);
            res.render('pages/googlecalendar', {
                my_title: 'Calendar',
            })
        })
});


// app.post('/register/create_account', function(req, res) {
//     var FirstName = req.body.firstName;
//     var Email = req.body.Email;
//     var familyID = req.body.familyID;
//     var password = req.body.password;


//     console.log(req.body);

//     var insert = "INSERT INTO users(familyID, familyName, email,pass,numPets) VALUES('"+familyID+"','JohnsFamily','"+Email+"','"+password+"',3);"


//     db.any(insert)
//     .then(function (rows) {
//         res.render('pages/home',{
//             my_title: "Pet Feeder",
//         })

//     })
//     .catch(function (err) {
//         console.log('error', err);
//         res.render('pages/Home', {
//             my_title: 'Pet Feeder',
//         })
//     })
// });

app.post('/register/create_account', function(req, res) {
    //Params taken from fourm
    var firstname = req.body.firstname;
    var Email = req.body.Email;
    var familyID = req.body.familyID;
    var password = req.body.password;
    var numpets = req.body.numpets;

    //PostgreSQL insert with params from fourm
    var insert = "INSERT INTO users(familyID, familyName, email,pass,numPets) VALUES('"+familyID+"','"+firstname+"','"+Email+"','"+password+"',"+numpets+");"

    //On succsessful insert take to homepage and store email cred
    db.any(insert)
    .then(function (rows) {
        login = Email
        res.render('pages/signin',{
            my_title: "Pet Feeder",
        })

    })
    .catch(function (err) {
        console.log('error', err);
        res.render('pages/register', {
            my_title: 'Pet Feeder',
        })
    })
});

app.post('/petRegistration/create_account', function(req, res) {
    var petid = req.body.petid;
    var name = req.body.pet_name;
    var type = req.body.pet_type;
    var weight = req.body.currentWeight;
    var age = req.body.age;
    var feedTimes = req.body.timesToFeed;
    var insert = "INSERT INTO pets(petID, familyID, pet_name, pet_type, currentWeight, age, timesToFeed) VALUES('"+petid+"', '"+familyIdAfterLogin+"','"+name+"','"+type+"','"+weight+"', '"+age+"','"+feedTimes+"');"

    console.log(req.body);

    db.any(insert)
    .then(function (rows) {
        login = EnteredEmail
        res.render('pages/sign',{
            my_title: "Pet",
        })

    })
    .catch(function (err) {
        console.log('error', err);
        res.render('pages/Home', {
            my_title: 'Pet Feeder',
        })
    })


});

app.post('/signup/logintoaccount', function(req, res) {
    var EnteredEmail = req.body.Email;
    var EnteredPassword = req.body.psw;

    console.log(EnteredEmail);
    console.log(EnteredPassword);

    var query = 	"SELECT * FROM users WHERE email = '"+EnteredEmail+"';";

    //  Executes query
    db.any(query)
    .then(function (rows) {
        // console.log(rows[0].familyid)
        var TruePass = rows[0].pass
        familyIdAfterLogin = rows[0].familyid
        if (EnteredPassword == TruePass){
            res.render('pages/Home', {

       
                    my_title: 'Pet Feeder',
                })
            }
            //Else render the signin page so user can try again
            else {
                res.render('pages/signin', {
                    my_title: 'Pet Feeder',
                })
            }
        })
        .catch(function(err) {
            console.log('error', err);
            res.render('pages/signin', {
                my_title: 'Pet Feeder',
            })
        })
});



app.listen(3001);
console.log('3001 is the magic port');