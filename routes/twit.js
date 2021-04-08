var express = require('express');
var router = express.Router();
const Twit = require('twit');
require('dotenv').config();
var followersModel = require('../models/followers');
var followingModel = require('../models/following');
var twitModel = require('../models/twitt');
const T = new Twit({
    consumer_key: process.env.APPLICATION_CONSUMER_KEY,
    consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });
  
  

// Follow someone with their username
router.post('/follow',(req,res) =>{
    console.log(req.body.username)
    username ={
        screen_name: req.body.username
    }
 T.post('friendships/create',username )
 .then(result => {
 console.log('Followed '  + ' successfully!');
 res.send(`Followed successfully ${username.screen_name}`)
}).catch(console.error);
})
     
  // Get twitt of user
  router.post('/username/recent',(req,res) => {
    let user_timeline_params ={
        screen_name: req.body.username,
        count:req.body.count  
    }
    T.get('statuses/user_timeline', user_timeline_params)
        .then(async result => {
        var user = result;
        let response =[]
        for(let i=0;i<user.data.length;i++) {
            response.push({"twitt":user.data[i].text,"createdAT":user.data[i].created_at})
        }
        let usertwit = new twitModel({
            username: String,
            twit:response
        });
        await usertwit.save();
        res.send(response);
    }).catch(console.error);
  })

  // get followers recent tweets
  router.post('/followers/recent',async function(req,res) {
    let user_timeline_params ={
        screen_name: req.body.username,
        count:5
    }
    let follower_twit_data =[];
       try{
        let followers_list = await T.get('followers/list', user_timeline_params);
        let follower_list_name =[];
        for(let i=0;i<followers_list.data.users.length;i++) {
            let user_timeline_params ={
                screen_name: followers_list.data.users[i].screen_name,
                count:5
            }
            follower_list_name.push(followers_list.data.users[i].screen_name);

          let  follower_twit = await T.get('statuses/user_timeline', user_timeline_params);
            for(let i=0;i<follower_twit.data.length;i++) {
                console.log(follower_twit.data[i].text,i,33);
                follower_twit_data.push({"twit":follower_twit.data[i].text,"username":follower_twit.data[i].user.screen_name})
            }
        }
        let followers = new followersModel({
            username:req.body.username,
            followerslist: follower_list_name   
        });
        await followers.save();
        res.send(follower_twit_data);
    }catch(err){
        console.log(err);
    } 
});


  // Tweets in every 30 mins and tagging randomly from the following list
  router.post('/update', (req,res) => {
        setInterval(async () =>{
            try {
                let user_timeline_params ={
                    screen_name: req.body.username,

                }
        let following_list = await T.get('friends/list',user_timeline_params);
        following_list_username =[]
        
        for(let i=0;i<following_list.data.users.length;i++) {  
            following_list_username.push(following_list.data.users[i].screen_name)
        }
        let following = new followingModel({
            username:req.body.username,
            followerslist: following_list_username   
        });
        await following.save();
        console.log(following_list_username,333)
        let randomuser = following_list_username[Math.floor(Math.random()*following_list_username.length)];
        console.log(randomuser,33)
        let user_twitt ={
            status: randomuser 
        }
         let status_update = await T.post('statuses/update', user_twitt);
         // res.send(status_update); 
        } catch(err){
            console.log(err);
        }   
   },1000*60*30)
     
  })

  module.exports = router;