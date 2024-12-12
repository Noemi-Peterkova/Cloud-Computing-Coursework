//import modules
const express = require('express');
const Interaction = require('../models/Interactions');
const Post = require('../models/Posts'); // Ensure Posts.js is set up
const verifyToken = require('../middleware/verifyToken');

const router = express.Router(); //router for interatctions

// Add a like or dislike to a post
router.post('/like-dislike', verifyToken, async (req, res) => {
    const { postId, action } = req.body; // action = 'like' or 'dislike'
    const userId = req.user._id;

    //validate the action input
    if (!['like', 'dislike'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action. Must be "like" or "dislike".' });
    }

    try {
        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // check if the post has expired
        const currentTime = Date.now();
        if (currentTime > post.expiresAt) {
            return res.status(400).json({ error: 'This post has expired and can no longer be interacted with.' });
        }
        
                // Check if the user is the owner of the post
        if (post.owner.toString() === userId.toString()) {
            return res.status(400).json({ error: "You cannot like your own post" });
        }

        // Create interaction
        const interaction = new Interaction({
            userId,
            postId,
            type: action,
            timestamp: Date.now(),
        });

        await interaction.save();// save to database

        // Update post stats
        post[action === 'like' ? 'likes' : 'dislikes'] += 1;
        await post.save();

        res.status(200).json({ message: `Post ${action}d successfully`, post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a comment to a post
router.post('/comment', verifyToken, async (req, res) => {
    const { postId, comment } = req.body;
    const userId = req.user._id;

    try {
        // Find the post
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Add the comment
        const interaction = new Interaction({
            userId,
            postId,
            type: 'comment',
            comment,
            timestamp: Date.now(),
        });

        await interaction.save();

        // Update post comments
        post.comments.push(interaction._id); 
        await post.save();

        res.status(200).json({ message: 'Comment added successfully', post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // export the router