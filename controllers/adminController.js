const bcrypt = require("bcrypt");
const User = require("../model/userModel");

// Render the admin login page
const adminLogin = async (req, res) => {
  var emailError = req.app.locals.ErrorContext;
  req.app.locals.ErrorContext = '';
  var passError = req.app.locals.passError;
  req.app.locals.passError = '';
  try {
    res.render("admin/loginAdmin", { emailError, passError });
  } catch (error) {
    console.log(error);
  }
};

// Display the admin dashboard, optionally filtered by search
const showDashboard = async (req, res) => {
  try {
    const search = req.query.search || "";
    var context = req.app.locals.specialContext;

    // Find users with names or emails matching the search term
    const userData = await User.find({
      is_admin: 0,
      $or: [
        { name: { $regex: '^' + search, $options: "i" } }, 
        { email: { $regex:'^'  + search, $options: "i" } }, 
      ],
    });
    res.render("admin/adDashboard", { userData, admin: req.session.admin, context });
  } catch (error) {
    console.log(error.message);
  }
};

// Verify admin login credentials
const verifyAdmin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const adminData = await User.findOne({ email: email });

    if (adminData) {
      const passMatch = await bcrypt.compare(password, adminData.password);
      if (passMatch && adminData.is_admin === 1) {
        req.session.userId = adminData._id;
        req.session.admin = adminData.email;
        res.redirect("/admin/dashboard");
      } else {
        req.app.locals.passError = 'Incorrect password. Please try again.';
        res.redirect("/admin");
      }
    } else {
      req.app.locals.ErrorContext = 'Invalid email address. Please try again.';
      res.redirect('/admin');
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Log out the admin and redirect to the admin login page
const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

// Load the page for adding a new user
const newUserLoad = async (req, res) => {
  try {
    res.render("admin/new-user");
  } catch (error) {
    console.log(error.message);
  }
};

// Securely hash a password using bcrypt
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10
      );
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

// Add a new user
const addUser = async (req, res) => {
  try {
    const { email, number } = req.body;
    const userFound = await User.findOne({ email });
    const numberFound = await User.findOne({ pno: number });

    if (userFound) {
      req.app.locals.specialContext = "Email already exists";
      return res.redirect("/admin/new-user");
    }

    const spassword = await securePassword(req.body.password);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      pno: req.body.pno,
      is_admin: 0,
    });
    const userData = await newUser.save();
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Load the page for editing a user
const editUser = async (req, res) => {
  try {
    const userid = req.query.id;
    const userData = await User.findById({ _id: userid });
    res.render("admin/edit-user", { userData });
  } catch (error) {
    console.log(error.message);
  }
};

// Update user information
const updateUser = async (req, res) => {
  try {
    const uerData = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { $set: { name: req.body.name, email: req.body.email, pno : req.body.pno} }
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const userid = req.query.id;
    const remove = await User.deleteOne({ _id: userid });
    res.redirect("/admin/dashboard");
  } catch (error) {}
};

// Search for users based on a search term
const searchUser = async (req, res) => {
  try {
    const search = req.body.search;
    // Use regex to search for documents with matching name or email
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } }, 
        { email: { $regex: search, $options: "i" } }, 
        { is_admin: 0 },
      ],
    };

    const userData = await User.find(query);
    res.render("admin/adDashboard", { userData, admin: req.session.admin });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  adminLogin,
  verifyAdmin,
  adminLogout,
  showDashboard,
  newUserLoad,
  addUser,
  editUser,
  updateUser,
  deleteUser,
  searchUser,
};
