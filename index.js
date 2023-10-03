
const express = require('express');
const mongoose = require('mongoose');
const { Nplp, BlindTest, Photo, Emoji } = require('./hackathonModel.js');


const app = express();
app.use(express.json());
const PORT = 8080;
const IP = '149.202.40.232';

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