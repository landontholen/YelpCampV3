var mongoose = require("mongoose"); 
var Campground = require("./models/campground"); 
var Comment = require("./models/comment"); 

var data = [
    {
        name: "Beach",
        image: "http://www.miamiandbeaches.com/-/media/images/miamiandbeaches/things-to-do/beaches/green-lifeguard-stand-456x406.jpg",  
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."     
    },
    
    {
        name: "Mountain",
        image: "https://www.filmhousecinema.com/sites/filmhousecinema.com/files/shows/2017/Mountain-3.jpg", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."     
    },
      
    {
        name: "Plains",
        image: "https://www.climatehubs.oce.usda.gov/sites/default/files/styles/featured_image/public/NP-about.jpeg?itok=fT4055LK", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."     
    }
]; 


function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err); 
        } else {
            console.log("Removed Database"); 
        }

        //Add some campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err); 
                } else {
                    console.log("New campground added successfully"); 
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet", 
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err); 
                            } else {
                                campground.comments.push(comment); 
                                campground.save(); 
                                console.log("Created new comment"); 
                            }
                        }); 

                } 
            }); 
        }); 
    }); 
} 

module.exports = seedDB; 
