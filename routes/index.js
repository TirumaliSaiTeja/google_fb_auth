// Application paths

exports.index = function (req, res) {
  // Render the 'index' template when in browser
  // we are in the root '/' -> http: // localhost: port /
  res.render('index', {
    // We send a title as variables
    // and object 'user' containing all
    // the user's information and travels in the 'request'
    title: 'OAuth',
    user: req.user,
  })
}
