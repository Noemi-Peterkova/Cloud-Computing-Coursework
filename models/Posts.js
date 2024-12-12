const mongoose = require('mongoose'); //require mongoose library

//database schema for the posts
const postSchema = mongoose.Schema({
    //title of the post
    title: {
        type: String,
        required: true,
        trim: true,
        max: 256
    },
    topic: {
        type: String,
        required: true,
        enum: ['Politics', 'Health', 'Sport', 'Tech'], // allowed topics
    },
    //content for the post
    body: {
        type: String,
        required: true,
        trim: true,
        max: 1024
    },
    //user who posted
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // reference the Users db
        required: true
    },
    //timestamp for creation
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true // time when the post expires
    },
    status: {
        type: String,
        enum: ['Live', 'Expired'], // is post live or expired
        default: 'Live'
    },
    //amount of likes
    likes: {
        type: Number,
        default: 0
    },
    //amount of dislikes
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interactions' // reference the Interactions db
    }]
});

module.exports = mongoose.model('posts', postSchema); //export the model 