var express = require("express"); 
var router = express.Router(); 
var Campground = require("../models/campground"); 

//INDEX - show all campgrounds 
router.get("/", function(req, res){
	//Get all of the campgrounds from the DB 
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err); 
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds}); 
		}
	}); 

//	res.render("campgrounds", {campgrounds: campgrounds}); 
}); 

//NEW - SHow form to create the new campground 
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new"); 
}); 

//CREATE - Add new campgrounds to database 
router.post("/", isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array 
	var name = req.body.name; 
	var image = req.body.image; 
	var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    } 
	var newCampground = {name: name, image: image, description: desc, athor:author};
	//Create a new campground and save to DB 
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err); 
		} else {
            console.log(newlyCreated); 
			res.redirect("/campgrounds"); 
		}
	}); 
	//Redirect back to campgrounds page
}); 

// SHOW - shows more info about one of the campgrounds 
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err); 
		} else {
			res.render("campgrounds/show", {campground: foundCampground}); 
		}
	}); 
	// find the campground with the requested id and show it
	// res.render("show"); 
}); 

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); 
    }
    res.redirect("/login"); 
}

module.exports = router; 
