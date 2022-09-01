const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// controller declare
const { createTweet, getTweet, deleteTweet, getTweets, getTweetsByUserId, updateTweet, likeTweet, unlikeTweet, retweet, unRetweet } = require('../controller/tweetController');

// import authentication
const protectRoute = require("../middleware/authMiddleware");

// fetch all tweets
router.get("/", protectRoute, getTweets);

// fetch all tweets by userId
router.get("/usertweet", protectRoute, getTweetsByUserId);

// fetch tweet by id
router.get("/:id", protectRoute, getTweet);

// create tweet
router.post("/create", protectRoute, createTweet);

// delete tweet
router.delete("/:id", protectRoute, deleteTweet);

// update Tweet
router.put("/:id", protectRoute, updateTweet);

// like Tweet
router.post("/like/:id", protectRoute, likeTweet);

// unlike Tweet
router.delete("/like/:id", protectRoute, unlikeTweet);

// search artist
router.post("/tweet/:id", protectRoute, retweet);

// search artist
router.delete("/tweet/:id", protectRoute, unRetweet);

module.exports = router;
