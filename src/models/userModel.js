const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
}, { timestamps: true });


userSchema.methods.like = function (tweetId) {
  if (!this.likes.some((id) => id.equals(tweetId))) {
    this.likes.push(tweetId);
    return this.save();
  }
  return Promise.resolve(this);
};

userSchema.methods.unlike = function (tweetId) {
  if (this.likes.some((id) => id.equals(tweetId))) {
    this.likes.remove(tweetId);
    return this.save();
  }
  return Promise.resolve(this);
};

userSchema.methods.likesIt = function (tweetId) {
  return this.likes.some((id) => id.equals(tweetId));
};

userSchema.methods.retweet = function (tweetId) {
  if (!this.retweets.some((id) => id.equals(tweetId))) {
    this.retweets.push(tweetId);
    return this.save();
  }
  return Promise.resolve(this);
};

userSchema.methods.unRetweet = function (tweetId) {
  if (this.retweets.some((id) => id.equals(tweetId))) {
    this.retweets.remove(tweetId);
    return this.save();
  }
  return Promise.resolve(this);
};

userSchema.methods.retweeted = function (tweetId) {
  return this.retweets.some((id) => id.equals(tweetId));
};

//Export the model
module.exports = mongoose.model("User", userSchema);
