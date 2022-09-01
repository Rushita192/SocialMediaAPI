const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const tweetSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
  },
  repliesCount: {
    type: Number,
    default: 0,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
  { timestamps: true });

tweetSchema.methods.updateRepliesCount = async function () {
  this.repliesCount = await mongoose.model('Tweet').countDocuments({ replyTo: this._id });
  return this.save();
};

tweetSchema.methods.like = function (userId) {
  if (!this.likes.some((id) => id.equals(userId))) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

tweetSchema.methods.unlike = function (userId) {
  if (this.likes.some((id) => id.equals(userId))) {
    this.likes.remove(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

tweetSchema.methods.retweet = function (userId) {
  if (!this.retweets.some((id) => id.equals(userId))) {
    this.retweets.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

tweetSchema.methods.unRetweet = function (userId) {
  if (this.retweets.some((id) => id.equals(userId))) {
    this.retweets.remove(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

//Export the model
module.exports = mongoose.model("Tweet", tweetSchema);
