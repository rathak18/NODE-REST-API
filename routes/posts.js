const Post = require("../models/Post");
const User = require("../models/User");
const { findById } = require("../models/User");
const router = require("express").Router();


// create post

router.post("/", async (req, res) => {
    const newPost = await new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})

// update post

router.put("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.send(200).json("the post has been updated");

        } else {
            res.status(400).json("You can update only your posts");
        }

    } catch (error) {
        res.status(500).json(error);
    }
});

// delete post

router.delete("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            post.deleteOne(req.body);
            res.send(200).json("the post has been deleted");

        } else {
            res.status(400).json("You can delete only your posts");
        }

    } catch (error) {
        res.status(500).json(error);
    }
});

// like or dislike post

router.put("/:id/like", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.send(200).json("the post has been liked");

        } else {
            await await post.updateOne({ $pull: { likes: req.body.userId } });
            res.send(200).json("the post has been disliked");
        }

    } catch (error) {
        res.status(500).json(error);
    }
});


// get a post

router.get("/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json("Post Not Found");
        } else {
            res.status(200).json(post);
        }

    } catch (error) {
        res.status(500).json(error);
    }

})

// get a timeline post

router.get("/timeline/all", async(req,res)=>{
    try {

        const currentUser = await User.findById(req.body.userId);
        const userPost = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map((frindId)=>{
                 return Post.find({userId:frindId});
            })
        );
        res.json(userPost.concat(...friendPosts));
        
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;