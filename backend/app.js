const express = require('express')
const session = require('express-session')
const { MemoryStore } = require('express-session')
require('dotenv').config()

const app = express()
const port = 3000

app.use(express.json())

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

const checkEmail = (domain) => {
    return domain == "it.kmitl.ac.th"
}

app.get('/', (req, res) => {
    res.send(req.user)
    console.log(req.user)
})

app.post('/', async (req, res) => {
    if (checkEmail(req.body.email.substring(req.body.email.length - 14, req.body.email.length))) {
        const userFromDB = await User.findOne({ email: req.body.email });
        if (userFromDB) {
            req.login(userFromDB, (err) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(400)
                }
                console.log("Login Complete")
                res.sendStatus(200)
            })
        }
        else {
            const user = new User({
                firstname: req.body.givenName,
                lastname: req.body.familyName,
                image: req.body.photoUrl,
                email: req.body.email
            })
            await user.save((err, doc) => {
                req.login(doc, (err) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(400)
                    }
                    console.log("Login Complete")
                    res.sendStatus(200)
                })
            })
        }
    }
    else {
        console.log("send wrong domain")
        req.logout()
        res.send('wrong domain')
    }

})

app.get('/getSession', (req, res) => {
    res.send(req.user)
    console.log("Send session to client.")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

passport.serializeUser((user, cb) => {
    //console.log(`Serialize user : ${user}`)
    cb(null, user)
});

passport.deserializeUser((user, cb) => {
    //console.log(`Deserialize user : ${user}`)
    cb(null, user)
});