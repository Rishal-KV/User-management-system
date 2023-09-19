// Import necessary modules and models
const User = require("../model/userModel");
const bcrypt = require("bcrypt");

// Dummy product data (for testing purposes)
const dummyProducts = [
    {
      name: "Product A",
      price: 19.99,
    },
    {
      name: "Product B",
      price: 29.99,
      description: "Product B is great for your needs.",
      category: "Home and Kitchen",
    },
    {
      name: "Product C",
      price: 9.99,
      description: "Product C is affordable and reliable.",
    },
    {
      name: "Product D",
      price: 49.99,
      description: "Product D is suitable for outdoor adventures.",
    },
  ];

// Function to securely hash a password using bcrypt
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

// Render the user registration page
exports.loadRegister = async (req, res) => {
  try {
    var context = req.app.locals.specialContext;

    req.app.locals.specialContext = '';
    res.render("users/register", { context });
  } catch (error) {
    console.log(error.message);
  }
};

// Handle user registration
exports.insertUser = async (req, res) => {
  try {
    const { name, email, password, pno } = req.body;
    const userFound = await User.findOne({ email });
    const numberFound = await User.findOne({ pno });

    if (userFound) {
      req.app.locals.specialContext = 'Email already exists';
      return res.redirect('/register');
    } else if (numberFound) {
      req.app.locals.specialContext = "Account has already been created with this number";
      return res.redirect("/register");
    } else {
      // If email and number are unique, create a new user
      const spassword = await securePassword(req.body.password);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        pno: req.body.pno,
        password: spassword,
        is_admin: 0,
      });

      const userData = await newUser.save();
      req.app.locals.specialContext = 'Sign up successful! Please login';
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Render the user login page
exports.loadLogin = async (req, res) => {
  try {
    var context = req.app.locals.specialContext;
    req.app.locals.specialContext = '';
    var emailError = req.app.locals.ErrorContext;
    req.app.locals.ErrorContext = '';
    var passError = req.app.locals.passError;
    req.app.locals.passError = '';
    res.render("users/login", { context, emailError, passError });
  } catch (error) {
    console.log(error.message);
  }
};

// Verify user login credentials
exports.verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const passMatch = await bcrypt.compare(password, userData.password);
      if (passMatch && userData.is_admin === 0) {
        req.session.userId = userData._id;
        req.session.user = userData.name;
        return res.redirect('/dashboard');
      } else {
        req.app.locals.passError = 'Incorrect password. Please try again.';
        return res.redirect('/login');
      }
    } else {
      req.app.locals.ErrorContext = 'Invalid email address. Please try again.';
      return res.redirect('/login');
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Render the user dashboard
exports.loadDashboard = async (req, res) => {
  try {
    res.render('users/dashboard', { dummyProducts, user: req.session.user });
  } catch (error) {
    console.log(error.message);
  }
};

// Log out the user and redirect to the login page
exports.logOut = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/login');
  } catch (error) {
    console.log(error.message);
  }
};

