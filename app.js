// Backend, server configuration
// and other options

var express = require("express"); // express:Framework
var routes = require("./routes"); // Where we have the configuration of the routes
var path = require("path");

var mongoose = require("mongoose"); // Mongoose: Library to connect with MongoDB
var passport = require("passport"); // Passport: Node middleware that facilitates user authentication

// We import the user model and the passport configuration
require("./models/user");
require("./passport")(passport);

// Connection to the MongoDB database that we have locally
mongoose.connect("mongodb://localhost:27017/passport", function (err, res) {
  if (err) throw err;
  console.log("Successfully connected to the DB");
});

// We start the Express application
var app = express();

// Configuration (listening port, template system, views directory, ...)
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.favicon());
app.use(express.logger("dev"));

// Express middlewares that allow us to route and power
// make HTTP requests (GET, POST, PUT, DELETE)
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());

// Path of static files (static HTML, JS, CSS, ...)
app.use(express.static(path.join(__dirname, "public")));
// We indicate that it uses sessions, to store the user object
// and remember it even if we leave the page
app.use(express.session({ secret: "lollllo" }));

// Passport configuration. We initialize it
// and we tell Passport to handle the Session
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// If in local, we tell you to handle the errors
// and show us a more detailed log
if ("development" == app.get("env")) {
  app.use(express.errorHandler());
}

/* Application paths * /
// When we are in http: // localhost: port / (the root) the index method is executed
// from the 'routes' module
app.get("/", routes.index);

/* Passport Routes */

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
// Route to authenticate with Google (login link)
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
// Route to authenticate with Facebook (login link)
app.get("/auth/facebook", passport.authenticate("facebook"));
// Callback route, which will redirect after authenticating with Google.
// In case of failure it redirects to another view '/ login'
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
// Callback route, to which you will redirect after authenticating with Facebook.
// In case of failure redirect to another view '/ login'
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Server startup
app.listen(app.get("port"), function () {
  console.log("Express application listening on port " + app.get("port"));
});
