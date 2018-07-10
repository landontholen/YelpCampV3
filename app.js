var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"), 
    passport = require("passport"), 
    LocalStrategy = require("passport-local"); 
    Campground = require("./models/campground"), 
    Comment = require("./models/comment"),  
    User = require("./models/user"), 
    seedDB = require("./seeds"); 

mongoose.connect("mongodb://localhost/yelp_camp"); 

app.use(bodyParser.urlencoded({extended: true})); 

app.use(express.static(__dirname + "/public")); 

app.set("view engine", "ejs"); 

seedDB(); 

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false 
})); 

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    next(); 
}); 

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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err); 
        } else {
            res.render("comments/new", {campground: campground}); 
        } 
    }); 
}); 

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err); 
            res.redirect("/campgrounds"); 
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err); 
                } else {
                    campground.comments.push(comment);
                    campground.save(); 
                    res.redirect("/campgrounds/" + campground._id); 
                } 
            }); 
        } 
    })
}); 

// ======================================================================
// AUTH ROUTES
// ======================================================================
app.get("/register", function(req, res){
    res.render("register"); 
}); 

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err); 
            return res.render("register"); 
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds"); 
        }); 
    }); 
}); 

app.get("/login", function(req, res){
    res.render("login"); 
}); 

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
    res.send("Logged in"); 
}); 

app.get("/logout", function(req, res){
    req.logout(); 
    res.redirect("/campgrounds"); 
}); 

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); 
    }
    res.redirect("/login"); 
}
app.listen(3000, ()=> console.log("The Yelpcamp server has started.")); 
