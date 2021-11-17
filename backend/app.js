const express = require('express')
const session = require('express-session')
const { MemoryStore } = require('express-session')
require('dotenv').config()

const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const bodyParser = require('body-parser');
const { GridFsStorage } = require('multer-gridfs-storage');
const formidable = require('formidable');

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
const Tag = require('./src/models/tag');
const Lecture = require('./src/models/lecture')

const storage = new GridFsStorage({
    url: process.env.mongoDBLink,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

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
    console.log(req.body)
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

app.get('/getAllUserId', async (req, res) => {
    await User.find({}, function (err, users) {
        var data = []
        users.forEach(function (user) {
            data.push(user.email);
        });
        res.send(data)
    }).clone().catch(function (err) { console.log("getAllUserId Error : " + e); })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/addTagDataDummy', async (req, res) => {
    const tagFromDB = await Tag.findOne({ tagName: req.body.tagName });
    if (tagFromDB) {
        tagFromDB.count = tagFromDB.count + 1
        tagFromDB.save(function (err) {
            if (err) {
                res.sendStatus(400)
            }
            res.send(tagFromDB)
        })
    }
    else {
        const tag = new Tag({
            tagName: req.body.tagName,
            count: req.body.count,
        })
        await tag.save((err, doc) => {
            if (err) {
                console.log(err)
                res.sendStatus(400)
            }
            res.send(tag)
        })
    }
})

app.get('/getAllTag', async (req, res) => {
    await Tag.find({}, function (err, tags) {
        var data = []
        tags.forEach(function (tag) {
            data.push({ tagName: tag.tagName, count: tag.count });
        });
        res.send(data)
    }).clone().catch(function (err) { console.log("getAllTag Error : " + e); })
})

app.post('/checkLecDuplicate', async (req, res) => {
    const lecFromDB = await Lecture.findOne({ title : req.body.title});
    if (lecFromDB){
        res.send(false)
    } else {
        res.send(true)
    }
})

app.post('/uploadLec', async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err)
        }
        console.log(fields);

        const newTag = JSON.parse(fields.newTag)
        const oldTag = JSON.parse(fields.oldTag)

        if (newTag.length > 0) {
            newTag.forEach(async (element) => {
                try {
                    const tagFromDB = await Tag.findOne({ tagName: element });
                    if (tagFromDB) {
                        let doc = await Tag.findOne({ tagName: tagFromDB.tagName });
                        await Tag.findOneAndUpdate({ tagName: tagFromDB.tagName }, { count: doc.count + 1 })
                    } else {
                        const tag = new Tag({
                            tagName: element,
                            count: 1,
                        })
                        await tag.save((err, doc) => {
                            if (err) {
                                console.log(err)
                                res.sendStatus(400)
                            }
                            res.send(tag)
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        }

        if (oldTag.length > 0) {
            oldTag.forEach(async (element) => {
                try {
                    // await Tag.findOne({ tagName : element }, async function (err, tag) {
                    //     await Tag.findOneAndUpdate({ tagName : element }, { count : tag.count+1})
                    //     if (err) {
                    //         console.log(err)
                    //         res.sendStatus(400)
                    //     }
                    // })
                    let doc = await Tag.findOne({ tagName: element });
                    await Tag.findOneAndUpdate({ tagName: element }, { count: doc.count + 1 })
                } catch (err) {
                    console.log(err)
                }
            })
        }

        const allTag = newTag.concat(oldTag);

        const lec = new Lecture({

            title: fields.title,
            description: fields.description,
            contact: fields.contact,
            tag: allTag,
            privacy: fields.privacy,
            userPermission: JSON.parse(fields.permission),
            owner: fields.owner,
            likeFromUser: [],
            rating: {},
            fileName: fields.fileName,
            fileUrl: fields.fileUrl,
            createdDate: fields.createdDate,

        })

        console.log(lec)

        await lec.save((err, doc) => {
            if (err) {
                console.log(err)
                res.sendStatus(400)
            }
            res.send(lec)
        })

    });

    res.status(200)

})

passport.serializeUser((user, cb) => {
    //console.log(`Serialize user : ${user}`)
    cb(null, user)
});

passport.deserializeUser((user, cb) => {
    //console.log(`Deserialize user : ${user}`)
    cb(null, user)
});