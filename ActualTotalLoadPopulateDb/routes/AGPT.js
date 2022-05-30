const bodyParser = require('body-parser');
const express = require('express');
const Connection = require('tedious').Connection
const Request = require('tedious').Request
const EventEmitter = require('events');


/* #region Initialize server, initialize DB connection */
//Initialize app, port
const app = express();
const PORT = 8081;


//App is to use only Json format
app.use(bodyParser.json());

//Initialize event emitter
const eventEmitter = new EventEmitter();

//Setup DB Connection
const config = {
    server: 'dimska',
    authentication: {
      type: 'default',
      options: {
        trustedconnection: true,
        userName: 'sa', 
        password: 'Bluedimred!1' 
      }
    }
  }

  const connection = new Connection(config);

  connection.on('connect', (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Connection successful!")
      //executeStatement()
    }
  })

  connection.connect();
  /* #endregion */