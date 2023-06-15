const express = require("express");
const router = express.Router();

// Controllers
const { renderIndex, renderAbout, renderHome } = require("../controllers/index.controller");

router.get("/", renderIndex);

router.get("/home", renderHome);


module.exports = router;
