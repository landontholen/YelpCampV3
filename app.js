var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"); 
    Campground = require("./models/campground"); 
    seedDB = require("./seeds"); 

mongoose.connect("mongodb://localhost/yelp_camp"); 

app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine", "ejs"); 

seedDB(); 

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
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
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
