const express = require('express')
const app = express();
const mongoose = require("mongoose")
require('dotenv').config() 
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport")
const User = require("./models/User")
const authRoutes = require('./routes/auth')
const songRoutes = require('./routes/song')
const playlistRoutes = require('./routes/playlist')
const cors = require("cors");

const port = 8000;

app.use(cors())
app.use(express.json())
//takes 2 args: 1 which db to connect(db's url),2 connection opptions 
mongoose.connect("mongodb+srv://raghavendra:"+process.env.MONGO_PASSWORD+"@cluster0.xuphgvd.mongodb.net/?retryWrites=true&w=majority")
                .then((x)=>{
                    console.log("Connected to mongo!")
                }).catch((err)=>{
                    console.log(err)
                })

                
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'thisKeyIsSupposedToBeSecret';
/*
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
                                // or you could create a new account
        }
    });
}));
*/
passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({_id: jwt_payload.identifier})
            .then(user => {
                if (user) return done(null, user);
                return done(null, false);
            })
            .catch(err => {
                return done(err, false, {message: 'Server Error'});
            });
    })
);

app.use('/auth',authRoutes)
app.use('/song',songRoutes)
app.use('/playlist',playlistRoutes)

app.listen(port,()=>{
    console.log("listening to port ",port);
})


//For Authentication we are using passport and passport-jwt package