
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { Nplp, BlindTest, Photo, Emoji } = require('./hackathonModel.js');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(express.json());
const PORT = 8080;
const IP = '149.202.40.232';

app.use(cors()); 
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/soundle', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to the database');
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

app.get('/api/blindtest/:id', async (req, res) => {
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