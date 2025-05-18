const User = require("../models/user.js");

module.exports.signup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.addUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to StayEase");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

module.exports.login = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  let { username } = req.body;
  req.flash("success", `Welcome back, ${username}`);

  let redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;

  // If the saved redirectUrl is a review-related URL (likely a DELETE route), redirect to the listing show page instead
  if (redirectUrl.includes("/reviews/")) {
    const match = redirectUrl.match(/\/listings\/([a-f\d]{24})/i);
    if (match) {
      redirectUrl = `/listings/${match[1]}`;
    } else {
      redirectUrl = "/listings";
    }
  }

  res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
        }
      req.flash("success", "you are logged out!");
      res.redirect("/login");
    });
};
