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


//listen for updates
app.listen(PORT, () => console.log(`Listening on port ${PORT}..."`));

app.post('/api/AggrGenerationPerType', (req, res) => {
  const DataCorrection = req.query.dataCorrection;
  const newData = {
    DateTime: req.body.DateTime,
    MapCode: req.body.MapCode,
    ProductionType : req.body.ProductionType,
    ActualGenerationOutput : req.body.ActualGenerationOutput
  } 

  if(!DataCorrection){
    eventEmitter.emit('DBUpdate', newData);
    res.send("DB updated");
  } 
  else{
    eventEmitter.emit('DBCorrect', newData);
    res.send("Correction occured");
  }
})

eventEmitter.on('DBUpdate', (arg) => {
  console.log("I received: ");
  console.log(arg);
  const sql = `INSERT INTO [TestDB].[dbo].[AggregatedGenerationPerTypeData] 
               VALUES ('${arg.DateTime}', 
                       '${arg.ProductionType}',
                        ${arg.ActualGenerationOutput},
                       '${arg.MapCode}')`;

  request = new Request(sql, (err, rowCount) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`${rowCount} rows`)
  }
});
  connection.execSql(request)
});

eventEmitter.on('DBCorrect', (arg) => {
  const sql = `UPDATE [TestDB].[dbo].[AggregatedGenerationPerTypeData] 
               SET  ActualGenerationOutput = ${arg.ActualGenerationOutput} 
               WHERE DateTime = '${arg.DateTime}'
               AND MapCode = '${arg.MapCode}'
               AND ProductionType = '${arg.ProductionType}'`;

  request = new Request(sql, (err, rowCount) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`${rowCount} rows`)
  }
});
  connection.execSql(request)
});