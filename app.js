if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    console.log("Cloud name is:", process.env.CLOUDINARY_CLOUD_NAME); 
    console.log("Secret is:", process.env.SECRET); 
}
const express = require('express');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const { cloudinary, storage } = require('./cloudinary/cloud'); 

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const UserRouters = require('./routes/users');
const campgroundsRouters = require('./routes/campgrounds');
const reviewsRouters = require('./routes/reviews');
const helmet=require('helmet')
mongoose.connect('mongodb://localhost:27017/routers');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(" Database connected");
});

const app = express();

app.engine('ejs', require('ejs').renderFile, { async: true });
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
  replaceWith: '_'
}));

app.use(helmet({contentSecurityPolicy:false}));
app.use(express.static('public'));
const sessionConfig = {
    secret: process.env.SECRET || 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



app.use('/', UserRouters);
app.use('/campgrounds', campgroundsRouters);
app.use('/campgrounds/:id/reviews', reviewsRouters);

app.get('/fakeuser', async (req, res) => {
    const user = new User({ email: 'venky@gmail.com', username: "venky" });
    const newUser = await User.register(user, 'reddy');
    res.send(newUser);
});
app.get('/', (req, res) => {
    res.redirect('/campgrounds');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});




app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(8080, () => {
    console.log(' Serving on port 8080');
});
