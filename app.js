const express = require('express');
const app = express();
require('dotenv').config({ path: '.env' })
const connectDB = require('./db/connect')
const hbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const path = require('path');
const UserRoute = require('./routes/user');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const adminRoute = require('./routes/admin')
const orderRoute = require('./routes/order')






const port = process.env.port || 4000

app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cookieParser());

//setting session
const oneDay = 60*60*24*1000
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: oneDay},
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI ,
        dbName: 'iMark',
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native',
        collectionName: 'sessions'})

  }))

app.use((req, res, next) => {
    res.set('cache-control', 'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
    next();
  });
//setting hbs
//changing default view Engine---setting to hbs

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));


app.engine('hbs', hbs.engine({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: "layout",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
    }));

//routes
app.use("/",UserRoute);
app.use("/admin",adminRoute);
app.use("/",orderRoute)



//connecting to DB and listening
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`App listening to ${port}...`))      
    } catch (error) {
        console.log(error)    
    }
}
start();
