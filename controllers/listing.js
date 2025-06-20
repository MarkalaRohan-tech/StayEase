const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.addNew = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename },
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Requested Listing does not exists");
    return res.redirect("/listings");
  }

  let originalImageUrl = data.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_350");
  res.render("listings/edit.ejs", { data,originalImageUrl });
};

module.exports.saveEdit = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.display = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested Listing does not exists");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Lising Deleted successfully");
  res.redirect("/listings");
};