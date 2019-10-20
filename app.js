'use strict';


// load modules
const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
var auth = require('basic-auth')
var http = require('http')
var server = http.createServer(function (req, res) {
  var credentials = auth(req)

  // Check credentials
  // The "check" function will typically be against your user store
  if (!credentials || !check(credentials.name, credentials.pass)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    res.end('Access granted')
  }
})

function check(name, pass) {
  var valid = true

  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, 'john') && valid
  valid = compare(pass, 'secret') && valid



  return valid
}

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


app.get('/api/users', (req, res) => {

  (async () => {

    try {
      await sequelize.authenticate();

      const people = await User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
        include: [
          {
            model: Course,
            as: 'student',
          },
        ],
      });

      res.json({
        result: people,
      });

      res.end();

    } catch (error) {

      console.log(error);

    }
  })();


});

app.post('/api/users', (req, res) => {

  (async () => {

    try {
      await sequelize.authenticate();

      const newPassword = 'password'; // For testing purpose
      const newEmail = 'email3@email.com'; // For testing purpose

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newPassword, salt, function (err, hash) {
          // Store hash in your password DB.
          (async () => {

            const findEmailExist = await User.findOne({ where: { emailAddress: newEmail } });

            if (!findEmailExist) {

              await User.create({

                firstName: 'Brat'
                , lastName: 'Bird',
                emailAddress: 'email@email.com',
                password: hash

              });

            }




          })();

        });
      });

      res.redirect('/');
      res.end();

    } catch (error) {

      if (error.name === 'SequelizeValidationError') {

        sendErrorMsg(error);

      } else {
        console.error('Error connecting to the database: ', error);

      }

    }
  })();

});





app.get('/api/courses', (req, res) => {
  (async () => {

    try {
      await sequelize.authenticate();

      const coursesRes = await Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
          },
        ],
      });

      res.json({
        result: coursesRes,
      });

      res.end();

    } catch (error) {
      console.log(error);
    }
  })();
});

app.get('/api/courses:id', (req, res) => {

  let queryID = (req.param("id"));
  queryID = queryID.replace(":", "");

  (async () => {

    try {
      await sequelize.authenticate();
      const courseByID = await Course.findByPk(queryID, {

        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
          },
        ],

      });

      res.json({
        result: courseByID,
      });

    } catch (error) {
      console.log(error);
    }
  })();
});

app.post('/api/courses', (req, res) => {

  (async () => {

    try {
      await sequelize.authenticate();

      await Course.create({
        title: 'The Iron Giant',
        description: 1999,
        userId: bradBird.id,
      }),

        res.redirect('/');
      res.end();

    } catch (error) {
      if (error.name === 'SequelizeValidationError') {

        sendErrorMsg(error);

      } else {
        console.error('Error connecting to the database: ', error);

      }
    }
  })();

});

app.delete('/api/courses:id', (req, res) => {

  let queryID = (req.param("id"));
  queryID = queryID.replace(":", "");

  (async () => {

    try {
      await sequelize.authenticate();
      const courseByID = await Course.findByPk(queryID);
      await courseByID.destroy();
      res.end();

    } catch (error) {
      console.log(error);
    }
  })();
});

app.put('/api/courses:id', (req, res) => {

  let queryID = (req.param("id"));
  queryID = queryID.replace(":", "");

  (async () => {

    try {
      await sequelize.authenticate();
      const courseByID = await Course.findByPk(queryID);
      courseByID.title = 'updatedTitle';
      await courseByID.save();

      res.end();

    } catch (error) {
      if (error.name === 'SequelizeValidationError') {

        sendErrorMsg(error);

      } else {
        console.error('Error connecting to the database: ', error);

      }
    }
  })();
});




// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});





const { sequelize, models } = require('./db');

// Get references to our models.
const { User, Course } = models;


// Define variables for the people and movies.
// NOTE: We'll use these variables to assist with the creation
// of our related data after we've defined the relationships
// (or associations) between our models.
let bradBird;
let vinDiesel;
let eliMarienthal;
let craigTNelson;
let hollyHunter;
let theIronGiant;
let theIncredibles;


(async () => {
  try {
    // Test the connection to the database
    console.log('Connection to the database successful!');
    await sequelize.authenticate();

    // Sync the models
    console.log('Synchronizing the models with the database...');
    await sequelize.sync({ force: true });

    // Add People to the Database
    console.log('Adding people to the database...');
    const userInstances = await Promise.all([
      User.create({
        firstName: 'Brad',
        lastName: 'Bird',
        emailAddress: 'email1@email.com',
        password: 'password1'
      }),
      User.create({
        firstName: 'Vin',
        lastName: 'Diesel',
        emailAddress: 'email2@email.com',
        password: 'password2'
      }),
      User.create({
        firstName: 'Eli',
        lastName: 'Marienthal',
        emailAddress: 'email3@email.com',
        password: 'password3'
      }),
      User.create({
        firstName: 'Craig T.',
        lastName: 'Nelson',
        emailAddress: 'email4@email.com',
        password: 'password4'
      }),
      User.create({
        firstName: 'Holly',
        lastName: 'Hunter',
        emailAddress: 'email5@email.com',
        password: 'password5'
      }),
    ]);
    console.log(JSON.stringify(userInstances, null, 2));

    // Update the global variables for the people instances
    [bradBird, vinDiesel, eliMarienthal, craigTNelson, hollyHunter] = userInstances;

    // Add Movies to the Database
    console.log('Adding movies to the database...');
    const courseInstances = await Promise.all([
      Course.create({
        title: 'The Iron Giant',
        description: 1999,
        userId: bradBird.id,
      }),
      Course.create({
        title: 'The Incredibles',
        description: 2004,
        userId: bradBird.id,
      })
    ]);
    console.log(JSON.stringify(courseInstances, null, 2));

    // Retrieve movies
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'student',
        },
      ],
    });
    console.log(courses.map(course => course.get({ plain: true })));


    // Retrieve people
    const people = await User.findAll({
      include: [
        {
          model: Course,
          as: 'student',
        },
      ],
    });
    console.log(people.map(user => user.get({ plain: true })));

    // process.exit();
  } catch (error) {

    console.error('Error connecting to the database: ', error);

    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();


function sendErrorMsg(inputError) {

  console.log(inputError);
  res.end();

}