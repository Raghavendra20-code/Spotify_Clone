const express = require('express');
const router = express.Router()
const passport = require("passport");
const Playlist = require('../models/Playlist');
const User = require('../models/User')
const Song = require('../models/Song');

//Route 1: create a playlist
router.post('/create',
passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const currentUser = req.user;
    const {name,thumbnail,songs} = req.body;
    if(!name || !thumbnail || !songs){
        return res.status(301).json({err:"Insufficient data"})
    }
    const playlistData = {name,thumbnail,songs,owner:currentUser._id,collaborators:[]};
    const playlist = await Playlist.create(playlistData);
    return res.status(200).json(playlist);
})

//get playlist by id
router.get('/get/playlist/:playlistId',
passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const playlistId = req.params.playlistId;
    const playlist = await Playlist.findOne({_id:playlistId}).populate({
        path:"songs",
        populate:{
            path:'artist'
        }
    });
    if(!playlist){
        return res.status(301).json({err:"Invalid ID"})
    }

    return res.status(200).json({data:playlist})
});

//get all playlist made by me

router.get('/get/me',
passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const artistId = req.user._id;
    
    const playlist = await Playlist.find({owner:artistId}).populate("owner");
    return res.status(200).json({data:playlist})
})

//get all playlist made by an artist

router.get('/get/artist/:artistId',
passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const artistId = req.params.artistId;
    const artist = await User.findOne({_id:artistId})
    if(!artist){
        return res.status(301).json({err:"Artist does not exist"})
    }
    const playlist = await Playlist.find({owner:artistId});
    return res.status(200).json({data:playlist})
})

//add a song to a playlist
router.post('/add/song',
passport.authenticate('jwt',{session:false}),
async (req,res)=>{
    const currentUser = req.user;
    const {playlistId,songId} = req.body
    const playlist = await Playlist.findOne({_id:playlistId});
    if(!playlist){
        return res.status(301).json({err:"Play does not exists"})
    }
    //console.log("CurrentUser",currentUser._id.toString()," owner:",playlist.owner.toString()," Colab:",playlist.collaborators);
    //because it is object we cannot compare directly either convert value of object into string or use equals function
    //playlist.owner.equals(currentUser._id)
    //check if current user owns the playlist
    if(playlist.owner.toString() != currentUser._id.toString() && !playlist.collaborators.includes(currentUser._id.toString())){
        return res.status(400).json({err:"Not allowed"})
    }
    //check if song is valid song
    const song = await Song.findOne({_id:songId});
    if(!song){
        return res.status(304).json({err:"song does not exists"})
    }
    //we can now add the song to playlist
    if(playlist.songs.includes(songId)){
        return res.status(301).json({message:"Song is been already added to playlist."})
    }
    playlist.songs.push(songId)

    await playlist.save();

    return res.status(200).json({playlist})

})

module.exports = router;