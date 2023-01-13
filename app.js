var express = require("express");
var path = require("path");
const nodemailer = require("nodemailer");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const app = express();

const cors = require("cors");
require("dotenv").config();

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');
// });
var corsOptions = {
  origin: "https://www.rohithreddy.works",
};
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.REACT_APP_EMAIL,
    pass: process.env.REACT_APP_PASSWORD,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

app.post("/send", function (req, res) {
  if (
    req.body.mailerState.name === "" ||
    req.body.mailerState.email === "" ||
    req.body.mailerState.message === ""
  ) {
    res.json({ status: "EMPTY" });
  }

  let mailOptions = {
    from: process.env.REACT_APP_EMAIL,
    to: `${req.body.mailerState.email}`,
    subject: `${req.body.mailerState.name} sent you a message from your portfolio site!`,
    text: `${req.body.mailerState.message}`,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
      res.json({ status: "Email sent" });
    }
  });
});
