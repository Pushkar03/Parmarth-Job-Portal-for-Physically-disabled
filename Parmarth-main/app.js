require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const md5 = require("md5");
const res = require('express/lib/response');
var _ = require('lodash');
const { lowerCase } = require('lodash');


const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


var conn1 =  mongoose.createConnection('mongodb+srv://test:doomsday@parmarthdb.nntxhvh.mongodb.net/userDB');
var conn2 =  mongoose.createConnection('mongodb+srv://test:doomsday@parmarthdb.nntxhvh.mongodb.net/companyDB');

var User = conn1.model('Model', new mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
}));

var Company  = conn2.model('Model', new mongoose.Schema({
    companyLogo: String,
    companyName: String,
    jobType: String,
    jobTitle: String,
    experience: String,
    jobCategory: String,
    jobLocation: String,
    disability: String,
    jobType: String,
    companySize: String,
    jobSalary: String,
    application_url: String,
    bio: String
}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signIn.html");
});

app.get("/signUp",function(req,res){
    res.sendFile(__dirname + "/signUp.html");
});

app.get("/job-open",function(req,res){
    res.sendFile(__dirname + "/job_open.html");
});

app.get("/job" , function(req,res){

    Company.find({}, function(err, posts){
        res.render("jobs" , {
            posts : posts
        });
    });
});

app.get("/figma",function(req,res){
    res.sendFile(__dirname + "/figma_job.html");
})

app.get("/flipkart",function(req,res){
    res.sendFile(__dirname + "/flipkart_job.html");
})

app.get("/google",function(req,res){
    res.sendFile(__dirname + "/google_job.html");
})

app.get("/microsoft",function(req,res){
    res.sendFile(__dirname + "/microsoft_job.html");
})

app.get("/swiggy",function(req,res){
    res.sendFile(__dirname + "/swiggy_job.html");
})

app.get("/uber",function(req,res){
    res.sendFile(__dirname + "/uber_job.html");
})

app.get("/profile",function(req,res){
    res.sendFile(__dirname + "/profile.html");
});

app.get("/edit-profile",function(req,res){
    res.sendFile(__dirname + "/edit_profile.html");
})


app.post("/search",function(req,res){
    var companyName = req.body.jobSearch;
    var jobSearchLocation = req.body.jobSearchLocation;
    var regex1 = new RegExp(["^",companyName,"$"].join(""),"i");
    var regex2 = new RegExp(["^",jobSearchLocation,"$"].join(""),"i");
    Company.find({ $or : [{jobLocation:regex2},{companyName:regex1}]},function(err,posts){
        res.render("jobs",{
            posts:posts
        });
    });
});


app.get("/jobs-open" , function(req,res){
    res.sendFile("job_open.html");
})

app.get("/about",function(req,res){
    res.sendFile(__dirname + "/about_us.html");
});

app.get("/home",function(req,res){
    res.sendFile(__dirname + "/home.html");
});

app.get("/google-job" ,function(req,res){
    res.sendFile(__dirname + "/google_job.html");
});


app.post("/job-open" ,function(req,res){
    
    const post = new Company({
        companyLogo : req.body.companyLogo,
        companyName : req.body.companyName,
        jobType : req.body.jobType,
        experience : req.body.experience,
        jobCategory : req.body.jobCategory,
        jobLocation : req.body.jobLocation,
        jobTitle : req.body.jobTitle,
        companySize : req.body.companySize,
        disability : req.body.disability,
        website: req.body.website,
        jobSalary : req.body.jobSalary,
        application_url : req.body.application_url,
        bio : req.body.bio
    });
    post.save(function(err){
        if (!err){
            res.redirect("/job");
        }
      }); 
});


app.get("/posts/:postName", function(req, res){
    const requestedTitle = req.params.postName;
  
    Company.findOne({jobTitle: requestedTitle}, function(err, post){
        res.render("detail", {
          companyLogo: post.companyLogo,
          companyName: post.companyName,
          jobTitle: post.jobTitle,
          experience: post.experience,
          jobCategory: post.jobCategory,
          jobLocation: post.jobLocation,
          jobType: post.jobType,
          companySize: post.companySize,
          jobSalary: post.jobSalary,
          disability: post.disability,
          application_url: post.application_url,
          bio: post.bio
        });
      });
});

app.post("/register",function(req,res){
    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password)
    });
    newUser.save(function(err,post){
        if(err)
            console.log(err);
        else{
            res.redirect("/home");
        }
    })
})

app.post("/login", function(req,res){
    
    const username = req.body.email;
    const password = md5(req.body.password);
    User.findOne({email:username} , function(err,foundUser){
        if(err)
            console.log(err);
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.redirect("/home");
                }  
            }
        }
    })
});


let port = process.env.PORT;
if(port==null || port==""){
    port = 3000;
}

app.listen(port,() =>{
    console.log("Server is up and running");
})