var mongoose = require("mongoose"); 
var Campground = require("./models/campground"); 
var Comment = require("./models/comment"); 

var data = [
    {
        name: "Beach",
        image: "https://pixabay.com/get/ea36b70928f21c22d2524518b7444795ea76e5d004b0144295f0c57ca7eebd_340.jpg", 
        description: "Beach picture"     
    },
    
    {
        name: "Mountain",
        image: "https://pixabay.com/get/eb35b70b2df6033ed1584d05fb1d4e97e07ee3d21cac104496f0c17da2edb6b0_340.jpg", 
        description: "Mountain picture"     
    },
        
    {
        name: "Plains",
        image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f0c17da2edb6b0_340.jpg", 
        description: "Plains picture"     
    },
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
                            text: "This place is great, but I wish there was internet" 
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err); 
                            } else {
                                campground.comment.push(comment); 
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
