var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"); 
    Campground = require("./models/campground"); 
    seedDB = require("./seeds"); 

seedDB(); 
mongoose.connect("mongodb://localhost/yelp_camp"); 

//Campground.create(
//		{ name: "Granite Hill", 
//		image: "https://pixabay.com/get/ea31b10929f7063ed1584d05fb1d4e97e07ee3d21cac104497f7c27aa7e4b3be_340.jpg ",
//		description: "This is a large granite hill"
//		}, function(err, campground){
//			if(err){
//				console.log(err);
//				} else {
//				console.log("Newly created campground: "); 
//				console.log(campground); 
//				}
//}); 

//var campgrounds = [
//		{ name: "Salmon Creek", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg" },
//		{ name: "Granite Hill", image: "https://farm2.staticflickr.com/1086/882244782_d067df2717.jpg" },
//		{ name: "Mountain Goat's Rest", image: "https://farm6.staticflickr.com/5472/9172530058_c22dab3b18.jpg" } 
//	];

app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine", "ejs"); 

app.get("/", function(req, res){
	res.render("landing"); 
}); 

//INDEX - show all campgrounds 
app.get("/campgrounds", function(req, res){
	//Get all of the campgrounds from the DB 
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err); 
		} else {
			res.render("index", {campgrounds: campgrounds}); 
		}
	}); 

//	res.render("campgrounds", {campgrounds: campgrounds}); 
}); 

//NEW - SHow form to create the new campground 
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs"); 
}); 

//CREATE - Add new campgrounds to database 
app.post("/campgrounds", function(req, res){
	//get data from form and add to campgrounds array 
	var name = req.body.name; 
	var image = req.body.image; 
	var desc = req.body.description; 
	var newCampground = {name: name, image: image, description: desc};
	//Create a new campground and save to DB 
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err); 
		} else {
			res.redirect("/campgrounds"); 
		}
	}); 
	//Redirect back to campgrounds page
}); 

// SHOW - shows more info about one of the campgrounds 
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err); 
		} else {
			res.render("show", {campground: foundCampground}); 
		}
	}); 
	// find the campground with the requested id and show it
	// res.render("show"); 
}); 

app.listen(3000, ()=> console.log("The Yelpcamp server has started.")); 
