const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });
const listingController = require("../controllers/listing.js");


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.addNew)
  );


// New and create route
router.get("/new", isLoggedIn, listingController.newForm);
  
router
  .route("/:id")
  .get(wrapAsync(listingController.display))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.saveEdit)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));


// Edit and update route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);

module.exports = router;
