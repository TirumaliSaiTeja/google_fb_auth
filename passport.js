var mongoose = require("mongoose");
var User = mongoose.model("User");
// Authentication strategy with Google
var GoogleStrategy = require("passport-google-oauth20").Strategy;
// Authentication strategy with Facebook
var FacebookStrategy = require("passport-facebook").Strategy;
// Configuration file where the API keys are located
// This file should not be shared with anyone as it contains data
// which can compromise the security of the application.
var config = require("./config");

// We export the passport functions as a module, so that
// we can use them in other parts of the application.
// This way, we keep the code separated in several files
// making it more manageable.
module.exports = function (passport) {
  // Serializes the user to store it in the session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // Deserializes the user object stored in the session to
  // be able to use it
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  // Configuration of the authenticated with Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.key,
        clientSecret: config.google.secret,
        callbackURL: "/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        // Search the database if the user has already authenticated in another
        // moment and is already stored in it
        User.findOne({ provider_id: profile.id }, function (err, user) {
          if (err) throw err;
          // If it exists in the Database, it returns it
          if (!err && user != null) return done(null, user);

          // If it does not exist create a new user object and stores it in the database
          var user = new User({
            provider_id: profile.id,
            provider: profile.provider,
            name: profile.displayName,
            photo: profile.photos[0].value,
          });

          user.save(function (err) {
            if (err) throw err;
            done(null, user);
          });
        });
      }
    )
  );

  // Configuration of authenticated with Facebook
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebook.id,
        clientSecret: config.facebook.secret,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", /*'provider',*/ "photos"],
      },
      function (accessToken, refreshToken, profile, done) {
        //The 'profileFields' field allows the fields that we store
        // are called the same whether the user is authenticated by Google or
        // by Facebook, since each provider delivers the data in the JSON with
        // a different name.
        // Passport knows this and makes it easier for us with that field
        User.findOne({ provider_id: profile.id }, function (err, user) {
          if (err) throw err;
          if (!err && user != null) return done(null, user);

          // As before, if the user already exists it returns it
          // and if not, create and save it in the database
          var user = new User({
            provider_id: profile.id,
            provider: profile.provider,
            name: profile.displayName,
            photo: profile.photos[0].value,
          });
          user.save(function (err) {
            if (err) throw err;
            done(null, user);
          });
        });
      }
    )
  );
};
