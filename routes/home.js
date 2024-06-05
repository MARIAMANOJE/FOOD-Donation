const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
	res.render("home/welcome");
});

router.get("/home/dash-board", (req,res) => {
	res.render("home/dashboard", { title: "dashboard | UNICEF" });
});

router.get("/home/about-us", (req,res) => {
	res.render("home/aboutUs", { title: "About Us | UNICEF" });
});

router.get("/home/mission", (req,res) => {
	res.render("home/mission", { title: "Our mission | UNICEF" });
});

router.get("/home/contact-us", (req,res) => {
	res.render("home/contactUs", { title: "Contact us | UNICEF" });
});


module.exports = router;