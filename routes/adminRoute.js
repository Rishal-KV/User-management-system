const express = require('express');
const admin_rout = express();
const adminController = require("../controllers/adminController");
const adminAuth = require('../middleware/adminAuth')
admin_rout.set('view engine', 'ejs');
admin_rout.set('views', './views');
admin_rout.use(express.json());
admin_rout.use(express.urlencoded({ extended: true }));

admin_rout.get('/',adminAuth.isLoggedOut,adminController.adminLogin)
admin_rout.post('/dashboard',adminController.verifyAdmin);

admin_rout.get('/dashboard', adminAuth.isLoggedIn, adminController.showDashboard);

admin_rout.post('/logout',adminController.adminLogout)
admin_rout.get('/new-user',adminAuth.isLoggedIn,adminController.newUserLoad) 
admin_rout.post('/new-user',adminController.addUser)
admin_rout.get('/edit-user',adminAuth.isLoggedIn,adminController.editUser);
admin_rout.post('/update-user',adminController.updateUser);
admin_rout.get('/delete-user',adminController.deleteUser)
admin_rout.post('/search',adminController.searchUser);


module.exports = admin_rout


