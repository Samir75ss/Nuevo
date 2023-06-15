const router = require("express").Router();
const nodemailer = require('nodemailer');
const { User } = require('../models/User'); // Importa el modelo de usuario


const {
  renderSignUpForm,
  singup,
  renderSigninForm,
  signin,
  logout
} = require("../controllers/users.controller");

// Routes
router.get("/users/signup", renderSignUpForm);

router.post("/users/signup", singup);

router.get("/users/signin", renderSigninForm);

router.post("/users/signin", signin);

router.get("/users/logout", logout);

router.get("/users/estudiante", (req, res) => {
  res.render("users/estudiante", { showLogoutButton: true }); // Renderiza la vista y pasa un valor para mostrar el botón de salida
});

router.get("/users/profesor", (req, res) => {
  res.render("users/profesor", { showLogoutButton: true }); // Renderiza la vista y pasa un valor para mostrar el botón de salida
});




router.post("/users/send-email", (req, res) => {
  const { email, content } = req.body;

  // Configurar el transporte SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true para usar SSL/TLS
    auth: {
      user: 'bensama123a@hotmail.com',
      pass: 'sebastian2003',
    },
  });

  // Configurar el mensaje de correo electrónico
  const mailOptions = {
    from: 'bensama123a@hotmail.com',
    to: email,
    subject: 'Contenido del editor CKEditor',
    html: content,
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // Manejar el error si no se puede enviar el correo electrónico
      console.error('Error al enviar el correo electrónico:', error);
      res.status(500).json({ error: 'Error al enviar el correo electrónico' });
    } else {
      // Manejar la respuesta exitosa del envío del correo electrónico
      console.log('Correo electrónico enviado:', info.response);
      res.json({ message: 'Correo electrónico enviado correctamente' });
    }
  });
});


module.exports = router;
