"use strict";
let express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser');

let index = require('./routes/index'),
	autocomplete = require('./routes/api/autocomplete'),
	api = require('./routes/api');

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
	.use(logger('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: true}))
	.use(cookieParser())
	.use(express.static(path.join(__dirname, 'public')))

	.use('/', index)
	.use('/api/autocomplete', autocomplete)
	.use('/api', api)

	.use(function (req, res, next) {
		let err = new Error('Not Found');
		err.status = 404;
		next(err);
	})
	.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
