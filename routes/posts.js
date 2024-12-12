//import modules
const express = require('express');
const Post = require('../models/Posts');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// create a new post
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, topic, body, expiresAt } = req.body;
        const userId = req.user._id; // assume verifyToken middleware sets req.user

        const newPost = new Post({
            title,
            topic,
            body,
            owner: userId,
            expiresAt
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// get the posts by topic
router.get('/', async (req, res) => {
    try {
        const { topic } = req.query; // get topic from query
        const filter = topic ? { topic } : {}; // filter by topic

        const posts = await Post.find(filter)
            .populate('comments')  // populate the comments field with data from Interactions model
            .exec();

        // format the posts data to include the populated comments
        const postsWithDetails = posts.map(post => ({
            title: post.title,
            body: post.body,
            likes: post.likes,
            dislikes: post.dislikes,
            comments: post.comments.map(comment => ({
                userId: comment.userId,     
                comment: comment.comment,   
                timestamp: comment.timestamp 
            })),
            createdAt: post.createdAt,
            expiresAt: post.expiresAt
        }));

        res.status(200).json(postsWithDetails); // send the formatted response
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// get the most active post by topic
router.get('/most-active', async (req, res) => {
    try {
        const { topic } = req.query; // get topic from query parameter

        if (!topic) {
            return res.status(400).json({ error: 'Topic parameter is required.' });
        }

        // find all posts in the given topic
        const posts = await Post.find({ topic });

        // if no posts found for the given topic
        if (posts.length === 0) {
            return res.status(404).json({ error: `No posts found for topic: ${topic}` });
        }

        // sort the posts by the sum of likes and dislikes
        const sortedPosts = posts.sort((a, b) => (b.likes + b.dislikes) - (a.likes + a.dislikes));

        // get the most active post 
        const mostActivePost = sortedPosts[0];

        res.status(200).json(mostActivePost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; //export the router