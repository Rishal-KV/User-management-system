
const express = require('express');
const  user_route = express();
const userController = require('../controllers/userController');
user_route.set('view engine', 'ejs');
user_route.set('views', './views');
user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));
const auth = require('../middleware/auth');


user_route.get('/',auth.isLoggedOut,userController.loadLogin);
user_route.get('/register',userController.loadRegister);
user_route.get('/login',auth.isLoggedOut,userController.loadLogin);
user_route.post('/login',userController.insertUser); 
user_route.post('/loginuser',userController.verifyLogin )
user_route.get('/dashboard',auth.isLoggedIn,userController.loadDashboard )
user_route.post('/logout',userController.logOut);



module.exports = user_route;