/* server start timing */
console.time('server-startup');

var app,
    express = require('express'),
    cors = require('cors'),
    errorhandler = require('errorhandler');

// Create global app object
app = express();
app.use(cors());

/*******
  Routes can be added here.
  ******/
/// START-error handlers
app.use(errorhandler());
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
/// END-error handlers

// finally, let's start our server...
app.listen(process.env.PORT || 3000, function(){
  console.timeEnd('server-startup');
  console.log('Listening on port ', server.address().port);
});
