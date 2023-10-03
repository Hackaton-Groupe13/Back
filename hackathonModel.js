const mongoose = require('mongoose');

// Schema Definitions
const NplpSchema = new mongoose.Schema({
    phrase: {
        type: String,
        required: true
    },
    son: {
        type: String,
        required: true
    },
    musiqueInfo: {
        type: String,
        required: true
    },
    reponse: {
        type: String,
        required: true
    }
});

const BlindTestSchema = new mongoose.Schema({
    son: {
        type: String,
        required: true
    },
    reponse: {
        type: String,
        required: true
    }
});

const PhotoSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    reponse: {
        type: String,
        required: true
    }
});

const EmojiSchema = new mongoose.Schema({
    emoji: {
        type: String,
        required: true
    },
    reponse: {
        type: String,
        required: true
    }
});

const Nplp = mongoose.model('Nplp', NplpSchema);
const BlindTest = mongoose.model('BlindTest', BlindTestSchema);
const Photo = mongoose.model('Photo', PhotoSchema);
const Emoji = mongoose.model('Emoji', EmojiSchema);

module.exports = {
    Nplp,
    BlindTest,
    Photo,
    Emoji
};
