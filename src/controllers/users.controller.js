const usersCtrl = {};

// Models
const User = require('../models/User');

// Modules
const passport = require("passport");

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('users/signup');
};

usersCtrl.singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password, claveregistro, rol } = req.body;
  //clave de registro para no permitir registros no deseados
  if (claveregistro != "Manglar2023") {
    errors.push({ text: "Clave de registro no coincide" });
  }
  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      claveregistro,
      name,
      email,
      password,
      confirm_password,
      rol, // Agregar el campo "rol" en el objeto de datos
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      const newUser = new User({ name, email, password, rol });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
  }
};




usersCtrl.renderSigninForm = (req, res) => {
  res.render("users/signin");
  const user = req.user;
};

usersCtrl.signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Manejar el error de autenticación
      return next(err);
    }
    if (!user) {
      // El usuario no pudo autenticarse, redirigir a la página de inicio de sesión
      return res.redirect("/users/signin");
    }

    // Autenticación exitosa, verificar el rol del usuario
    if (user.rol === "estudiante") {
      return res.redirect("/users/estudiante"); // Redirigir a la página de estudiante si el rol es "estudiante"
    } else if (user.rol === "profesor") {
      return res.redirect("/users/profesor"); // Redirigir a la página de profesor si el rol es "profesor"
    } else {
      return res.redirect("/"); // Redirigir a la página principal en otros casos
    }
  })(req, res, next);
};


usersCtrl.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/users/signin");
};

module.exports = usersCtrl;