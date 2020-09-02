var express        =  require('express'),
    app            =  express(),
    bodyParser     =  require('body-parser'),
    mongoose   	   =  require('mongoose'),
	passport   	   =  require('passport'),
	LocalStrategy  =  require('passport-local'),
	Campground     =  require('./models/campground'),
	Comment        =  require('./models/comment'),
	User           =  require('./models/user'),
	seedDB 	       =  require('./seeds')

// requiring routes 
var commentRoutes    = require('./routes/comments'),
 	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes      = require('./routes/index')


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/yelp_camp_v8', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static(__dirname + '/public'));
// seedDB(); //every time we restart the server campgrounds will be deleted

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Howlin around my happy home',
	resave: false, 
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user; // applies user on every route
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(3000, function(req, res){
	console.log('Server has started!');
});