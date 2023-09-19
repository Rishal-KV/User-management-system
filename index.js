const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user_management_system');
const express = require('express');
const session = require('express-session')
const path = require('path');
const nocache = require('nocache');
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(nocache());
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex')

app.use(session({
  secret:  secretKey , 
  resave: false,
  saveUninitialized: true
}));


//for user routs

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
app.use('/', userRoute);
app.use('/admin',adminRoute);



app.listen(3000,()=>{
    console.log("server is running");
})

module.export ={app}

