
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { Nplp, BlindTest, Photo, Emoji } = require('./hackathonModel.js');
const path = require('path');
const cors = require('cors');
const { CronJob } = require('cron');


const app = express();
app.use(express.json());
const PORT = 8080;
const IP = '149.202.40.232';


app.use(cors()); 
app.use(express.json());


let historiqueNplp = [];
let historiqueBlindTest = [];
let historiquePhoto = [];
let historiqueEmoji = [];

let UwU = {
    nplp: "",
    blindTest: "",
    photo: "",
    emoji: "",
};

mongoose.connect('mongodb://localhost:27017/soundle', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to the database');
    tacheAMinuit();
})
.catch((error) => {
    console.error('Error connecting to the database:', error);
});


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp3/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .mp3 files are allowed!'));
        }
    }
});


app.listen(
    PORT,
    IP,
    () => console.log(`Server running at http://${IP}:${PORT}`)
);


app.get('/api/nplp', async (req, res) => {
    const nplp = await Nplp.find();
    res.json(nplp);
});

app.get('/api/blindtest', async (req, res) => {
    const blindTest = await BlindTest.find();
    res.json(blindTest);
});

app.get('/api/photo', async (req, res) => {
    const photo = await Photo.find();
    res.json(photo);
});

app.get('/api/emoji', async (req, res) => {
    const emoji = await Emoji.find();
    res.json(emoji);
});

app.post('/api/nplp', async (req, res) => {
    const nplp = new Nplp(req.body);
    await nplp.save();
    res.json(nplp);
});

app.post('/api/blindtest', async (req, res) => {
    const blindTest = new BlindTest(req.body);
    await blindTest.save();
    res.json(blindTest);
});

app.post('/api/photo', async (req, res) => {
    const photo = new Photo(req.body);
    await photo.save();
    res.json(photo);
});

app.post('/api/emoji', async (req, res) => {
    const emoji = new Emoji(req.body);
    await emoji.save();
    res.json(emoji);
});

app.delete('/api/nplp/:id', async (req, res) => {
    const { id } = req.params;
    await Nplp.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
});

app.delete('/api/blindtest/:id', async (req, res) => {
    const { id } = req.params;
    await BlindTest.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
});

app.delete('/api/photo/:id', async (req, res) => {
    const { id } = req.params;
    await Photo.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
});

app.delete('/api/emoji/:id', async (req, res) => {
    const { id } = req.params;
    await Emoji.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
});

app.get('/getmp3', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', 'sample.mp3');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.sendFile(filePath);
});

app.get('/api/getsound/:id', async (req, res) => {
    try {
        const blindTest = await BlindTest.findById(req.params.id);
        if (!blindTest) {
            return res.status(404).send('Entry not found');
        }

        const filePath = path.join(__dirname, 'uploads', blindTest.son + '.mp3');
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.sendFile(filePath);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

const job = new CronJob('0 0 * * *', function() { // minute puis heure
    tacheAMinuit();
}, null, true, 'Europe/Paris');
job.start();

function choixAleatoireExcluantHistorique(liste, historique) {
    let choix = null;


    do {
        const indexAleatoire = Math.floor(Math.random() * liste.length);
        choix = liste[indexAleatoire];
    } while (historique.includes(choix));


    historique.push(choix);
    if (historique.length > 7) {
        historique.shift();
    }

    return choix;
}

async function tacheAMinuit() {
    console.log('Tâche à minuit');

    const nplp = await Nplp.find();
    const choixNplp = choixAleatoireExcluantHistorique(nplp, historiqueNplp);

    const blindTest = await BlindTest.find();
    const choixBlindTest = choixAleatoireExcluantHistorique(blindTest, historiqueBlindTest);

    const photo = await Photo.find();
    const choixPhoto = choixAleatoireExcluantHistorique(photo, historiquePhoto);

    const emoji = await Emoji.find();
    const choixEmoji = choixAleatoireExcluantHistorique(emoji, historiqueEmoji);

    // console.log('Choix Nplp:', choixNplp);
    // console.log('Choix BlindTest:', choixBlindTest);
    // console.log('Choix Photo:', choixPhoto);
    // console.log('Choix Emoji:', choixEmoji);


    
    //choixNplp.son = "http://149.202.40.232:8080/api/getsound/" + choixNplp.id;
    choixBlindTest.son = "http://149.202.40.232:8080/api/getsound/" + choixBlindTest.id;


    UwU.nplp = choixNplp;
    UwU.blindTest = choixBlindTest;
    UwU.photo = choixPhoto;
    UwU.emoji = choixEmoji;
}

app.get('/api/info', async (req, res) => {
    res.json(UwU);
});