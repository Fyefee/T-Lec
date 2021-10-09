const express = require('express')
const session = require('express-session')
const { MemoryStore } = require('express-session')
require('dotenv').config()

const app = express()
const port = 3000

app.use(session({
    store: new MemoryStore(),
    secret: 'pdearinwza',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
}))

const mongoose = require('mongoose');
mongoose.connect(process.env.mongoDBLink)
.then(() => {
    console.log("Connect DB success")
})
.catch((err) => {
    console.log(err)
});

const User = require('./src/models/user');

const passport = require('passport')

app.use(passport.initialize())
app.use(passport.session())

var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        console.log(profile)
        let newJson = profile._json
        let user_db = await User.findOne({email: newJson.email})
        if (user_db){
            return done(null, user_db)
        }
        if (checkEmail(newJson.domain)) {
            const new_User = await User.create({
                firstname: newJson.given_name,
                lastname: newJson.family_name,
                image: newJson.picture,
                email: newJson.email
            })
            done(null, new_User)
        }
        else {
            done(null, false)
        }
    }
));

const checkEmail = (domain) => {
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
        if (err) {
            console.log(err)
            res.status(400).send(user)
        }
        else if (user) {
            req.login(user, (err) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(400)
                }
                res.sendStatus(200)
            })
        }
        else if (!user) {
            res.sendStatus(400)
        }
    }, { scope: ['email', 'profile'] })(req, res)
});

app.get('/', (req, res) => {
    res.send(req.user)
    console.log(req.user)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

passport.serializeUser((user, cb) => {
    console.log(`Serialize user : ${user}`)
    cb(null, user)
});

passport.deserializeUser((user, cb) => {
    console.log(`Deserialize user : ${user}`)
    cb(null, user)
});