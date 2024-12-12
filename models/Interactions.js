const mongoose = require('mongoose'); // import the mongoose library


// the database schema for interactions
const interactionSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts', // reference the Posts db
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // reference the Users db
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'dislike', 'comment'], // type of interaction
        required: true
    },
    //contentfor the comment
    comment: { 
        type: String,
        trim: true,
        max: 512 
    },
    //timestamp for the interaction
    createdAt: { 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('interactions', interactionSchema);