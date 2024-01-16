const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user.js');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send("health check")
})

global.makeResult = (statusCode, message) => {
  const result = {
    http_code: statusCode,
    message,
  };
  return result;
};

global.makeErrorResponse = (err) => {
  if (err && err.http_code) {
    return err;
  }
  const resp = {
    http_code: err.statusCode ? err.statusCode : 500,
    message: err.error ? err.error : err.stack ? err.stack : 'Bad request / Server Error.. Please retry..',
    error: err.stack ? err.stack : err,
  };
  return resp;
};
app.use(userRoute)

app.use(errorHandler);

function errorHandler(err, req, res, next) {
  err = global.makeErrorResponse(err);
  console.log(`Error Handler: ${JSON.stringify(err)}`);
  res.statusCode = err.http_code;
  res.json(err.message);
}

module.exports = app;