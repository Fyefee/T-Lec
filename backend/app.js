const express = require('express')
require('dotenv').config()

const app = express()
const port = 3000

const passport = require('passport')

var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        console.log(profile)
        let newJson =  profile._json
        if (checkEmail(newJson.domain)){
            done(null, profile)
        }
        else{
            done(null, false)
        }
    }
));

const checkEmail = (domain) =>{
    return domain == "it.kmitl.ac.th"
}

app.use(passport.initialize())

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/auth/google/callback', (req, res) => {
    passport.authenticate('google', (err, user) => {
        console.log(user)
        if (err){
            console.log(err)
            res.status(400).send(user)
        }
        else if (user){
            res.status(200).send(user)
            // req.login(user, (err) => {
            //     if (err) {
            //         console.log(err)
            //         res.sendStatus(400)
            //     }
            //     res.sendStatus(200)
            // })
        }
        else if (!user){
            res.sendStatus(400)
        }
    }, {scope: ['email', 'profile']})(req, res)
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})