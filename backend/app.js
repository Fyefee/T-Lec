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
const Lecture = require('./src/models/lecture');
const Main = require('./src/models/main')
const fs = require('fs');

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
                email: req.body.email,
                following: [],
                follower: 0,
                post: [],
                recentView: []
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
    const lecFromDB = await Lecture.findOne({ title: req.body.title });
    if (lecFromDB) {
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

        const base64string = fields.fileBase64;

        const dirPath = "/files/" + fields.owner + "/" + fields.title + "/";

        // path.resolve(__dirname + "/files/", "OUTPUT_Data.pdf")
        // Generate File
        // fs.mkdirSync("./files/" + fields.owner + "/" + fields.title + "/", { recursive: true })
        // fs.writeFile(path.resolve(__dirname + "/files/" + fields.owner + "/" + fields.title + "/" , fields.fileName), base64string, {encoding: 'base64'}, function(err) {
        //     console.log(err);
        // });

        // console.log(path.resolve(__dirname + "/files/" + fields.owner + "/" + fields.title + "/" , fields.fileName))

        // Read RAW file
        // fs.readFile(path.resolve(__dirname + "/files/" + fields.owner + "/" + fields.title + "/" , fields.fileName), 'utf8', function(err, data){
        //     console.log(data);
        // }); 

        // Request In Clinet
        // await axios({
        //     method: 'post',
        //     url: '',
        //     data: {
        //     },
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //     responseType: 'arraybuffer',
        //   })
        //     .then((response) => {
        //       return Buffer.from(response.data).toString('base64');
        //     })
        //     .catch(function (error) {
        //       return null;
        //     });

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
            rating: [],
            fileName: fields.fileName,
            fileUrl: dirPath,
            comment: [],
            ratingAvg: 0
        })

        try {

            fs.mkdirSync("." + dirPath, { recursive: true })
            fs.writeFile(path.resolve(__dirname + dirPath, fields.fileName), base64string, { encoding: 'base64' }, function (err) {
                console.log(err);
            });

            console.log(lec)

            await lec.save(async (err, doc) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(400)
                }
                const dataFromDB = await User.findOne({ email: doc.owner });
                let newPostArray = [...dataFromDB.post]
                newPostArray.push(doc._id)
                await User.findOneAndUpdate({ email: dataFromDB.email }, { post: newPostArray })

                res.sendStatus(200)
            })

        } catch (err) {
            console.log(err)
            res.sendStatus(400)
        }

    });

    res.status(200)

})

app.get('/getDataForLibrary', async (req, res) => {

    await User.findOne({ email: req.query.email }, async function (err, doc) {

        const lecFromEmail = await Lecture.find({ owner: doc.email })
        const lecToSend = []

        let rating = 0;
        let ratingCount = 0;

        let postCount = 0;
        let followerCount = doc.follower;
        let followingCount = doc.following.length;

        if (lecFromEmail) {
            lecFromEmail.forEach((element) => {

                rating += element.ratingAvg
                ratingCount += 1;

                postCount += 1;

                let lecture = {
                    title: element.title,
                    privacy: element.privacy
                }

                lecToSend.push(lecture);

            })
        }

        if (ratingCount == 0) {
            rating = null;
        } else {
            rating /= ratingCount
        }

        data = {
            "rating": rating,
            "postCount": postCount,
            "userFollower": followerCount,
            "userFollowing": followingCount,
            "userLecture": lecToSend
        }

        res.send(data)

    }).clone().catch(function (err) {
        console.log("getAllTag Error : " + e);
    })
})

app.delete('/deleteLec', async (req, res) => {
    try {
        await Lecture.deleteOne({ title: req.query.title })
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

})

app.get('/getLectureData', async (req, res) => {

    await Lecture.findOne({ title: req.query.title }, async function (err, doc) {

        const lecOwner = await User.findOne({ email: doc.owner })

        let userRating = 0;
        let isLike = false;

        if (doc.likeFromUser.includes(req.query.userEmail)) {
            isLike = true;
        }

        if (doc.rating.length != 0) {
            doc.rating.forEach((value, key) => {
                if (value.email == req.query.userEmail) {
                    userRating = value.rating;
                }
            })
        }

        try {
            const userData = await User.findOne({ email: req.query.userEmail });
            let recentView = [...userData.recentView];
            if (recentView.length >= 5) {
                recentView.splice(0, 1);
            }
            if (!recentView.includes(doc.title)) {
                recentView.push(doc.title);
                await User.findOneAndUpdate({ email: req.query.userEmail }, { recentView: recentView })
            }
        } catch (err) {
            console.log(err);
        }

        data = {
            "title": doc.title,
            "contact": doc.contact,
            "description": doc.description,
            "permission": doc.userPermission,
            "privacy": doc.privacy,
            "tag": doc.tag,
            "rating": doc.ratingAvg,
            "comment": doc.comment,
            "ownerName": lecOwner.firstname + " " + lecOwner.lastname,
            "ownerEmail": lecOwner.email,
            "ownerImage": lecOwner.image,
            "isLike": isLike,
            "userRating": userRating
        }

        // console.log(doc)
        // console.log(lecOwner)
        // console.log(data)
        res.send(data)

    }).clone().catch(function (err) {
        console.log("getLectureDataError : " + err);
    })
})

app.post('/addComment', async (req, res) => {

    await Lecture.findOne({ title: req.body.lecTitle }, async function (err, doc) {

        let comment = [...doc.comment];
        comment.push(req.body.comment)

        await Lecture.findOneAndUpdate({ title: doc.title }, { comment: comment })

    }).clone().catch(function (err) {
        console.log("getLectureDataError : " + err);
    })

    res.sendStatus(200)

})

app.delete('/deleteComment', async (req, res) => {

    const comment = JSON.parse(req.query.comment);

    await Lecture.findOne({ title: req.query.title }, async function (err, doc) {

        let oldComment = [...doc.comment];

        let commentIndex = -1

        oldComment.forEach((element, index) => {
            if (JSON.stringify(element) == JSON.stringify(comment)) {
                commentIndex = index
            }
        })

        oldComment.splice(commentIndex, 1);

        await Lecture.findOneAndUpdate({ title: doc.title }, { comment: oldComment })

    }).clone().catch(function (err) {
        console.log("getLectureDataError : " + err);
    })

    res.sendStatus(200)

})

app.post('/rateLecture', async (req, res) => {

    await Lecture.findOne({ title: req.body.lecTitle }, async function (err, doc) {

        const rate = [...doc.rating];
        let isDuplicate = false;
        let duplicateIndex = -1;

        rate.forEach((element, index) => {
            if (element.email == req.body.userEmail) {
                isDuplicate = true;
                duplicateIndex = index;
            }
        })

        if (!isDuplicate) {
            rate.push({ email: req.body.userEmail, rating: req.body.rating });
        } else {
            rate[duplicateIndex].rating = req.body.rating;
        }

        let rating = 0;

        if (rate.length != 0) {
            rate.forEach((value, key) => {
                rating += value.rating;
            })
            rating /= rate.length;
        }

        await Lecture.findOneAndUpdate({ title: doc.title }, { rating: rate, ratingAvg: rating })

    }).clone().catch(function (err) {
        console.log("getLectureDataError : " + err);
    })

    res.sendStatus(200)

})

function compareDate( a, b ) {
    if ( a.createdDate < b.createdDate ){
      return 1;
    }
    if ( a.createdDate > b.createdDate ){
      return -1;
    }
    return 0;
}

app.get('/getHomeData', async (req, res) => {

    await User.findOne({ email: req.query.email }, async function (err, doc) {

        const lecRecentArray = [];
        const lecNewestArray = [];
        let lecCount = doc.recentView.length;

        const newLecData = await Lecture.find({}).sort("-createdDate").limit(5)
        newLecData.forEach(async (element, index) => { 
            const lecOwner = await User.findOne({ email: element.owner }).clone()
            newLec = {
                title: element.title,
                photoUrl: lecOwner.image,
                lecTag: element.tag,
                lecDescription: element.description,
                lecRating: element.ratingAvg,
                createdDate: element.createdDate,
                owner: lecOwner.email
            }
            lecNewestArray.push(newLec)

            if (lecNewestArray.length == newLecData.length) {

                lecNewestArray.sort(compareDate)

                doc.recentView.forEach(async (element, index) => {
                    const lecRecent = await Lecture.findOne({ title: element }).clone()

                    if (lecRecent) {
                        const lecOwner = await User.findOne({ email: lecRecent.owner }).clone()
                        lecRecentArray.push({
                            title: lecRecent.title,
                            photoUrl: lecOwner.image,
                            lecTag: lecRecent.tag,
                            lecDescription: lecRecent.description,
                            lecRating: lecRecent.ratingAvg,
                            owner: lecOwner.email
                        })
                    } else {
                        lecCount -= 1
                    }

                    if (lecRecentArray.length == lecCount) {
                        const data = {
                            recentView: lecRecentArray,
                            newLec: lecNewestArray
                        }
                        res.send(data)
                    }

                })

            }
        })


    }).clone().catch(function (err) {
        console.log(err)
    })

})

passport.serializeUser((user, cb) => {
    //console.log(`Serialize user : ${user}`)
    cb(null, user)
});

passport.deserializeUser((user, cb) => {
    //console.log(`Deserialize user : ${user}`)
    cb(null, user)
});