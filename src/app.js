const express = require("express");
const db = require("./db/conn");

const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const { registerPartials } = require("hbs");
const async = require("hbs/lib/async");
const { check, validationResult } = require('express-validator');
const { doesNotMatch } = require("assert");

const flash = require('connect-flash');
// const session = require('express-session');
const cookie_parser = require('cookie-parser');
const e = require("connect-flash");

var user = "guest";
var pswd = "asdfasdf";

// setting the path
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// middleware
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));

// app.use(express.urlencoded({extended:false}));
app.use('/custom', express.static(path.join(__dirname, "../node_modules/custom")));   // for the custome js 
app.use(express.static(static_path));    // for using just the static pages

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
// for parsing multipart/form-data
app.use(upload.array());

app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);

// app.use(flash());
// app.use(session({cookie: {secure: false, maxAge: null}}))

// routing
// app.get (path, callback)

// app.use((req, res, next) => {
//     res.locals.message = req.session.message;
//     delete req.session.messages;
//     next();
// })

app.get("/", (req, res) => {
    res.render("signin");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/home", (req, res) => {
    res.render("index");
})

app.get("/menu", (req, res) => {
    res.render("menu");
})

app.get("/cart", (req, res) => {
    res.render("cart");
})

app.get("/aboutus", (req, res) => {
    res.render("aboutus");
})

app.get("/specialdishes", (req, res) => {
    res.render("specialdishes");
})

app.get("/cart/payment", (req, res) => {
    res.render("payment");
})

app.post("/signup", [
    check('username')
        .notEmpty()
        .withMessage("Username cannot be empty")
        .isLength({ min: 4 })
        .withMessage("Username must be minimum 4 characters"),
    check('password')
        .notEmpty()
        .withMessage("password cannot be empty")
        .isLength({ min: 4 })
        .withMessage("Password must be minimum of 4 characters"),
], async (req, res) => {

    const errors = validationResult(req);

    // printing all the errors
    console.log(errors);
    if (errors.notEmpty) {
        return res.status(400).json({ errors: errors.array() });
        // req.session.message = {
        //     type: 'danger',
        //     intro: 'Error in entries',
        //     message: 'Please recheck the entered values'
        // }
    } else {
        try {
            console.log(req.body);
            var { username, email, phone, password } = req.body;
            console.log(1);
            console.log(username);
            console.log(email);
            console.log(2);
            var query = `insert into user values ('${username}', '${email}', '${phone}', '${password}')`;
            console.log(query);
            db.query(query, function (err, result) {
                if (err) throw err
                else setTimeout(() => {return res.redirect("/home")}, 0); 
        });

        } catch (error) {
            res.status(500).send(error);
        }
    }
})

app.post("/", [
    check('username')
        .notEmpty()
        .withMessage("Username cannot be empty")
        .isLength({ min: 4 })
        .withMessage("Username must be minimum 4 characters"),
    check('password')
        .notEmpty()
        .withMessage("password cannot be empty")
        .isLength({ min: 4 })
        .withMessage("Password must be minimum of 4 characters"),
], async (req, res) => {

    const errors = validationResult(req);

    // printing all the errors
    console.log(errors);
    if (errors.notEmpty) {
        return res.status(400).json({ errors: errors.array() });
        // req.session.message = {
        //     secret: process.env.COOKIE_SECRET,
        //     type: 'danger',
        //     intro: 'Error in entries',
        //     message: 'Please recheck the entered values'
        // }
    } else {
        try {
            console.log(req.body);
            var { username, password } = req.body;
            
            var query = `select * from user where username = '${username}' and password = '${password}'`;
            console.log(query);
            db.query(query, function (err, rows,  fields) {
                if (err) throw err
                console.log(rows[0]);
                if(typeof rows[0] != 'undefined') {
                    user = username;
                    pswd = password;
                    setTimeout(() => {return res.redirect('/home')}, 0);
                }
                else {
                    // req.session.message = {
                    //     secret: process.env.COOKIE_SECRET,
                    //     type: 'danger',
                    //     intro: 'Error in entries',
                    //     message: 'Please recheck the entered values'
                    // }

                    console.log("No values matched in the database");
                    setTimeout(() => {return res.redirect('/signup')}, 0);
                }
            });

        } catch (error) {
            res.status(500).send(error);
        }
    }
})  

// server create
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})
