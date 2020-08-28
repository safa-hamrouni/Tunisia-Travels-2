const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const payment = require("./routes/api/OnlinePayment");
const InfoTravel = require("./model/InfoTravel.js");
const HousesInfos = require("./model/HousesInfos.js")


// import passport from 'passport'
// Intitialize the app
const app = express();

//OMAR
const passportGoogle = require("./config/passportGoogle+");
const passportGoogleKeys = require("./config/passportGoogle+Keys");
const AuthSMRoutes = require("./routes/api/AuthSM");
const resetPassword = require("./routes/api/ResetPassword");
const InfoTravelRoutes = require("./routes/api/InforTravel");
const coockieSession = require("cookie-session");


// Middleware
// Form Data Middlware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Json Body Middleware
app.use(bodyParser.json());
// Cors Middleware
app.use(cors());
// Setting up the static directory
app.use(express.static(path.join(__dirname, "/client/public")));
app.use(
  coockieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [passportGoogleKeys.session.coockieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/Auth", AuthSMRoutes);
app.use("/api/users", resetPassword);
app.use("/api/payment", payment);
// app.use('/', InfoTravelRoutes)
////////////////////////////////////////////////////////////////////

// Use the passport Middleware
// app.use(passport.initialize());
// Bring in the passport Strategy
require("./config/passport")(passport);
// Bring in the Database Config
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((db) => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(`Unable to connect with this database ${err}`);
  });

// Bring in the Users route
const users = require("./routes/api/users");
const keys = require("./config/keys");
const multer = require("multer");
app.use("/api/users", users);

//HOU i will reorganize them later {{SORRY}}
app.post("/travelinfo", (req, res) => {
  InfoTravel.create(req.body).then((item) => {
    res.send(item);
  });
});

app.get("/travelinfo", (req, res) => {
  InfoTravel.find({}).then((item) => {
    res.send(item);
  });
});
app.post("/houses", (req, res) => {
  HousesInfos.create(req.body).then((house) => {
    res.send(house)
  })
})

app.get("/houses", (req, res) => {
  HousesInfos.find({}).then(houses => {
    res.send(houses)
  })
})



const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server started on port http://localhost:${port}`)
);
