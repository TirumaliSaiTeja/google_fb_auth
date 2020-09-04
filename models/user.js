// User model for the database

// Mongoose is a Node library that allows us
// connect to a MongoDB database and model a schema
// for us.
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Fields that we are going to save in the database
var UserSchema = new Schema({
  name: String, // User name
  provider: String, // User account (Google or Facebook)
  provider_id: { type: String, unique: true }, // ID provided by Google or Facebook
  photo: String, // profile picture of the user
  createdAt: { type: Date, default: Date.now }, // time and date of creation
});

// We export the 'User' model to use it in other
// parts of the application
var User = mongoose.model("User", UserSchema);
