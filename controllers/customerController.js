const Post = require('../models/post');
const uuid = require('uuid'); 
const User = require('../models/user');


async function cancelPostRequest(req, res) {
    try {
      const postId = req.body.postid;

      const post = await Post.findOne({ postid: postId });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      post.status = false;
      await post.save();
      res.status(200).json({ message: 'Post request canceled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
// Function to display profile data
// Function to display profile data using user ID
async function displayProfileData(req, res) {
    try {
      const userId = req.body.userid; // Assuming userId is passed as a route parameter
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  

// Function to post a request
async function postRequest(req, res) {
    try {
      const { location } = req.body;
      const userId = req.body.userid; // Assuming userId is passed as a route parameter
      // Generate a unique post ID using UUID
      const postId = uuid.v4();
      // Create a new post
      const newPost = new Post({
        postid: postId,
        location: location,
      });
      await newPost.save();
      res.status(201).json({ message: 'Post request created successfully', post: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
// Function to get the details of the worker who accepted the request
async function getAcceptedWorkerDetails(req, res) {
  try {
    const postId = req.body.postid;
    // Find the post by postId
    const post = await Post.findOne({ postid: postId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (!post.assigned) {
      return res.status(404).json({ message: 'No worker has accepted this request yet' });
    }
    const worker = await User.findById(post.assigned);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json(worker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  cancelPostRequest,
  displayProfileData,
  postRequest,
  getAcceptedWorkerDetails,
};
