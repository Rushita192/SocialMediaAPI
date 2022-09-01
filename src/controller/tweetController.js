const User = require('../models/userModel');
const Tweet = require('../models/tweetModel');
const { tweetCreate, tweetUpdate } = require('../utils/validationSchema');

// create a tweet
const createTweet = async (req, res) => {
    try {
        const { _id: authUserId } = req.user;
        const { text, replyTo } = req.body;
        const { error } = await tweetCreate.validateAsync({ text, replyTo });

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        if (replyTo && !(await Tweet.exists({ _id: replyTo }))) {
            return res.status(400).json({ message: "Tweet Not Found" });
        }

        const newTweet = await Tweet.create({
            text: text,
            author: authUserId,
            replyTo: replyTo
        });

        if (!newTweet) {
            return res.status(400).json({ message: "Tweet Not Created!" });
        }

        if (replyTo) {
            const originalTweet = await Tweet.findById(replyTo);
            console.log('Orgiginal Tweet', originalTweet)
            await originalTweet.updateRepliesCount();
        }

        res.status(201).json({ message: "Tweet Created", data: newTweet });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

};

// update a tweet
const updateTweet = async (req, res) => {
    try {
        const { _id: authUserId } = req.user;
        const { text } = req.body;
        const { error } = await tweetUpdate.validateAsync({ text });

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const tweetExist = await Tweet.findById(req.params.id);

        if (!tweetExist) {
            return res.status(400).json({ message: "Tweet Not Found!!" });
        }

        if (!tweetExist.author.equals(authUserId)) {
            return res.status(400).json({ message: "You cannot update someone's tweet!!" });
        }

        const updatedTweet = await Tweet.findByIdAndUpdate(
            { _id: req.params.id },
            {
                author: authUserId,
                text: text,
                edited: true,
            },
            { new: true }
        );

        if (!updatedTweet) {
            return res.status(400).json({ message: "Tweet Not Update!!" });
        }
        return res.status(200).json({ message: "Tweet Updated!!", data: updatedTweet });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// get tweet by Id
const getTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id).populate('author', ['name', 'username']);

        if (!tweet) {
            return res.status(400).json({ message: "Tweet Not Found!" });
        }

        return res.status(200).json({ message: "Tweet Found", data: tweet });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

};

// Get all Tweet
const getTweets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const tweetCount = await Tweet.find({}).count();
        const pages = Math.ceil(tweetCount / pageSize);
        const skip = (page - 1) * pageSize;

        const tweet = await Tweet.find()
            .skip(skip)
            .limit(pageSize);

        res.status(200).send({
            data: tweet,
            totalRecords: tweetCount,
            currentPage: page,
            totalPage: pages,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Get All Particular User Tweet
const getTweetsByUserId = async (req, res) => {
    try {
        const { _id: authUserId } = req.user;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const tweetCount = await Tweet.find(authUserId).count();
        const pages = Math.ceil(tweetCount / pageSize);
        const skip = (page - 1) * pageSize;

        const tweet = await Tweet.find(authUserId)
            .skip(skip)
            .limit(pageSize);

        res.status(200).send({
            data: tweet,
            totalRecords: tweetCount,
            currentPage: page,
            totalPage: pages,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Delete Tweet
const deleteTweet = async (req, res) => {
    try {
        const { _id: authUserId } = req.user;
        const tweet = await Tweet.findByIdAndRemove(req.params.id);
        if (!tweet) {
            return res.status(400).json({ message: "Tweet Not Found!" });
        }
        if (!tweet.author.equals(authUserId)) {
            return res.status(400).json({ message: "You cannot delete someone's tweet" });
        }
        if (tweet.replyTo) {
            const originalTweet = await Tweet.findById(tweet.replyTo);
            if (originalTweet) {
                await originalTweet.updateRepliesCount();
            }
        }
        return res.status(201).json({ message: "Tweet Deleted!!" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }


};

// like tweet
const likeTweet = async (req, res) => {
    try {
        const { _id: authUserId } = req.user;

        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(400).json({ message: "Tweet Not Found!" });
        }

        const user = await User.findOne({ _id: authUserId });

        if (user.likesIt(req.params.id)) {
            return res.status(400).json({ message: "User already likes a tweet!!" });
        }
        await Promise.all([user.like(req.params.id), tweet.like(authUserId)]);
        return res.status(201).json({ message: "Tweet Liked", data: tweet });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// unlike tweet
const unlikeTweet = async (req, res) => {

    try {
        const { _id: authUserId } = req.user;

        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(400).json({ message: "Tweet Not Found!" });
        }

        const user = await User.findOne({ _id: authUserId });

        if (!user.likesIt(req.params.id)) {
            return res.status(400).json({ message: "User did not liked the tweet yet!!" });
        }
        await Promise.all([user.unlike(req.params.id), tweet.unlike(authUserId)]);
        return res.status(201).json({ message: "Tweet Unliked", data: tweet });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Retweet Tweet
const retweet = async (req, res) => {
    try {
        const { _id: authUserId } = req.user;

        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(400).json({ message: "Tweet Not Found!" });
        }

        const user = await User.findOne({ _id: authUserId });


        if (user.retweeted(req.params.id)) {
            return res.status(400).json({ message: "User already retweeted a tweet!!" });
        }

        await Promise.all([user.retweet(req.params.id), tweet.retweet(authUserId)]);

        return res.status(201).json({ message: "Tweet", data: tweet });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// UnRetweet Tweet
const unRetweet = async (req, res) => {
    try {
        const { _id: authUserId } = req.user;

        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(400).json({ message: "Tweet Not Found!" });
        }

        const user = await User.findOne({ _id: authUserId });


        if (!user.retweeted(req.params.id)) {
            return res.status(400).json({ message: "User did not retweeted a tweet yet!!" });
        }

        await Promise.all([user.unRetweet(req.params.id), tweet.unRetweet(authUserId)]);

        return res.status(201).json({ message: "Untweet", data: tweet });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};



module.exports = {
    getTweets,
    getTweet,
    createTweet,
    updateTweet,
    deleteTweet,
    likeTweet,
    unlikeTweet,
    retweet,
    unRetweet,
    getTweetsByUserId
};
