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
/// START-error handlers
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  var statusCode = err.status || 500,
      msg = isDevelopment ? err.stack : 'Something broke!';
  console.error(err.stack);
  res.status(statusCode).send(msg);
});
/// END-error handlers

// finally, let's start our server...
app.listen(process.env.PORT || 3000, function(){
  console.timeEnd('server-startup');
  console.log('Listening on port ', this.address().port);
});
