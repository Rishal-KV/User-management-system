const express = require('express');
const admin_route = express();
const adminController = require("../controllers/adminController");
const adminAuth = require('../middleware/adminAuth')
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views');
admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));

admin_route.get('/',adminAuth.isLoggedOut,adminController.adminLogin)
admin_route.post('/dashboard',adminController.verifyAdmin);

admin_route.get('/dashboard', adminAuth.isLoggedIn, adminController.showDashboard);

admin_route.post('/logout',adminController.adminLogout)
admin_route.get('/new-user',adminAuth.isLoggedIn,adminController.newUserLoad) 
admin_route.post('/new-user',adminController.addUser)
admin_route.get('/edit-user',adminAuth.isLoggedIn,adminController.editUser);
admin_route.post('/update-user',adminController.updateUser);
admin_route.get('/delete-user',adminController.deleteUser)
admin_route.post('/search',adminController.searchUser);


module.exports = admin_route


