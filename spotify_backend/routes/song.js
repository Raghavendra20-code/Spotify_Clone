const express = require('express');
const router = express.Router();
const passport = require('passport')
const Song = require('../models/Song')
const User = require('../models/User')


router.post('/create',
passport.authenticate("jwt", {session:false}) ,
async (req,res)=>{
    //req.user will get user because of passport.authenticate
    const {name, thumbnail, track} = req.body;

    if(!name || !thumbnail || !track){
        return res.status(301).json({err:"Insufficient details to create song."})
    }
    const artist = req.user._id;
    const songDetails = {name, thumbnail, track, artist}

    const createdSong = await Song.create(songDetails)
    return res.status(200).json(createdSong);
})

router.get('/get/mysongs',passport.authenticate("jwt", {session:false}),
async (req,res)=>{
    const songs =  await Song.find({artist:req.user._id}).populate('artist');
    return res.status(200).json({data:songs})
});

//Get route to get all songs any artist has published.
//I will send the artist id and I want to see all songs that artist has published

router.get('/get/artist/:artistId',
passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const {artistId} = req.params;
    const artist = await User.find({_id: artistId})
    if(!artist){
        return res.status(301).json({Error:"Artist does not exist"})
    }
    const songs = await Song.find({artist:artistId})
    return res.status(200).json({data:songs})
})

//get route to get a single song by name

router.get('/get/songname/:songName',
passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const {songName} = req.params;
    //Exact value is gonna happen(DjKallid == DjKalid wont get by DjKlid) try to take pattern matching using mongo query
    const songs = await Song.find({name:songName}).populate('artist')
    return res.status(200).json({data:songs})
})

router.get('/get/likedSongs',passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const user = req.user._id;
    if(!user){
        res.status(301).json({err:"Artist doesn't exist."})
        return;
    }
    const likedSongs = await User.findOne({_id:user}).populate({path:'likedSongs',populate:{
        path:'artist'
    }})
    if(!likedSongs){
        return res.status(301).json({Error:"Artist does not exist"})
    }
    const data = {...likedSongs.toJSON()}
    delete data.password
    return res.status(200).json({data:data});
})

router.post('/add/likedSongs',passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const {songId} = req.body;
    const user = req.user._id;

    const data = await User.findOne({_id:user});
    if(!data){
        return res.status(301).json({err:"Invalid Artist."})
    }
    if(data.likedSongs.includes(songId)){
        return res.status(301).json({message:"Song is been already liked."})
    }
    data.likedSongs.push(songId);
    await data.save();
    const response = {...data.toJSON()}
    delete response.password;
    return res.status(200).json({response})

})

module.exports = router;