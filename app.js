/* server start timing */
console.time('server-startup');

var app,
    express = require('express'),
    cors = require('cors'),
    morgan = require('morgan'), 
    isDevelopment = (process.env.NODE_ENV === 'development');

console.log('test node env', process.env.NODE_ENV);
// Create global app object
app = express();
app.use(cors());
app.use(morgan('combined'));
/*******
  Routes can be added here.
  ******/
app.use(require('./routes'));
/// START-error handlers
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/list-of-links');
});

app.use(function(err, req, res, next) {
  var statusCode = err.status || 500,
      errMsg = err.stack === undefined ? err : 'Runtime error:';
      msg = errMsg + ' \n ' + (isDevelopment ? err.stack : 'Something broke!');
  console.error('error serving route: ', err);
  res.status(statusCode).send(msg);
});
/// END-error handlers

// finally, let's start our server...
app.listen(process.env.PORT || 3000, function(){
  console.timeEnd('server-startup');
  console.log('Listening on port ', this.address().port);
});
