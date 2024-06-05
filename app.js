const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const homeRoutes = require("./routes/home.js");
const authRoutes = require("./routes/auth.js");
const adminRoutes = require("./routes/admin.js");
const donorRoutes = require("./routes/donor.js");
const agentRoutes = require("./routes/agent.js");
require("dotenv").config();
require("./config/dbConnection.js")();
require("./config/passport.js")(passport);



app.set("view engine", "ejs");
app.use(expressLayouts);
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.warning = req.flash("warning");
	next();
});



// Routes
app.use(homeRoutes);
app.use(authRoutes);
app.use(donorRoutes);
app.use(adminRoutes);
app.use(agentRoutes);
app.use((req,res) => {
	res.status(404).render("404page", { title: "Page not found" });
});
// app.post('/auth/login', async (req, res) => {
//     const { email, password, 'g-recaptcha-response': recaptchaResponse } = req.body;

//     // Verify reCAPTCHA response
//     const secretKey = '6LeVaeopAAAAAGAvSO_TyNoJ38asKp032oE8oXJp';
//     const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
//      try {
//             const response = await fetch(verificationUrl, { method: 'POST' });
//             const data = await response.json();
    
//             if (data.success) {
//                 // Proceed with login authentication
//                 // Your authentication logic here...
    
//                 // For example, assuming authentication is successful:
//                 if (authenticationSuccessful) {
//                     req.flash("success", "Login successful");
//                     res.redirect('/home');
//                 } else {
//                     req.flash("error", "Invalid email or password");
//                     res.redirect('/login');
//                 }
//             } else {
//                 // CAPTCHA verification failed
//                 req.flash("error", "reCAPTCHA verification failed. Please complete the CAPTCHA.");
//                 res.redirect('/login');
//             }
//         } catch (error) {
//             console.error("Error verifying reCAPTCHA:", error);
//             req.flash("error", "An error occurred while verifying reCAPTCHA. Please try again later.");
//             res.redirect('/login');
//         }
//     });
const secretKey = '6LeVaeopAAAAAGAvSO_TyNoJ38asKp032oE8oXJp';
app.post('/auth/login', async (req, res) => {
    const { email, password, gRecaptchaResponse } = req.body;

    // Verify reCAPTCHA response
    const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${gRecaptchaResponse}`;
    
    try {
        const captchaResponse = await axios.post(captchaVerificationUrl);
        if (captchaResponse.data.success) {
            // CAPTCHA verification successful, proceed with login
            // Your login logic here
            // Check email and password, authenticate user
            // If successful, redirect user to dashboard or perform other actions
            res.send('Login successful');
        } else {
            // CAPTCHA verification failed
            res.send('CAPTCHA verification failed');
        }
    } catch (error) {
        console.error('Error verifying CAPTCHA:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/', (req, res) => {
    res.render('index'); // currentUser will be available in the template
});

app.get('/admin/dashboard', (req, res) => {
    if (req.user && req.user.role === 'admin') {
        res.render('adminDashboard');
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authorized
    }
});

app.get('/agent/dashboard', (req, res) => {
    if (req.user && req.user.role === 'agent') {
        res.render('agentDashboard');
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authorized
    }
});

app.get('/donor/dashboard', (req, res) => {
    if (req.user && req.user.role === 'donor') {
        res.render('donorDashboard');
    } else {
        res.redirect('/auth/login'); // Redirect to login if not authorized
    }
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running at http://localhost:${port}`));
