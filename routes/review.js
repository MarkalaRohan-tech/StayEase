const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
  
const reviewController = require("../controllers/review.js");
//Post route
router.post(
  "/",
  isLoggedIn,
    validateReview,
    wrapAsync(reviewController.addReview)
  );
  
  
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview),
);

module.exports = router;