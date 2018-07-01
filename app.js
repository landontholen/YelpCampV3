var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"), 
    Campground = require("./models/campground"), 
    Comment = require("./models/comment"),  
    seedDB = require("./seeds"); 

mongoose.connect("mongodb://localhost/yelp_camp"); 

app.use(bodyParser.urlencoded({extended: true})); 

app.use(express.static("public")); 

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
			res.render("campgrounds/index", {campgrounds: campgrounds}); 
		}
	}); 

//	res.render("campgrounds", {campgrounds: campgrounds}); 
}); 

//NEW - SHow form to create the new campground 
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new"); 
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
			res.render("campgrounds/show", {campground: foundCampground}); 
		}
	}); 
	// find the campground with the requested id and show it
	// res.render("show"); 
}); 

// ===============================
// COMMENTS ROUTES 
// ===============================

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err); 
        } else {
            res.render("comments/new", {campground: campground}); 
        } 
    }); 
}); 

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err); 
            res.redirect("/campgrounds"); 
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err); 
                } else {
                    console.log(req.body.comment); 
                    campground.comments.push(comment);
                    campground.save(); 
                    res.redirect("/campgrounds/" + campground._id); 
                } 
            }); 
        } 
    })
}); 

app.listen(3000, ()=> console.log("The Yelpcamp server has started.")); 
