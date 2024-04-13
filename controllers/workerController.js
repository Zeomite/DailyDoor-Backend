const Post = require("../models/post.js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const userModel = require("../models/user.js");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Content = require("../models/content.js");

const scout = async (req, res) => {
  try {
    if (!req.body.location) {
      return res.status(400).json({ message: "Allow location" });
    }

    const loc = req.body.location;
    const user = await userModel.findOne({ token: req.body.token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find(
      { _id: { $nin: user.scouted } }, 
      { location: 1, postid: 1 }
    );

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    const distances = await Promise.all(posts.map(async (post) => {
      if (!post.location || post.location.length < 2) {
        console.error("Invalid post location:", post);
        return Infinity;
      }

      const config = {
        method: "GET",
        url: `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${post.location[0]},${post.location[1]}&destinations=${loc[0]},${loc[1]}&key=${process.env.distancekey}`,
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios(config);
      const distance = response.data?.rows?.[0]?.elements?.[0]?.distance?.value;
      return distance !== undefined ? distance : Infinity;
    }));

    const minDistance = Math.min(...distances);
    const minIndex = distances.indexOf(minDistance);

    if (minIndex === -1) {
      return res.status(404).json({ message: "No valid distances found" });
    }

    const selectedPost = posts[minIndex];
    if (!selectedPost) {
      return res.status(404).json({ message: "No selected post found" });
    }

    await userModel.findOneAndUpdate(
      { token: req.body.token },
      { $push: { scouted: selectedPost.postid } }
    );

    res.json(selectedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const accept = async (req, res) => {
  try {
    let jobid = req.body.jobid;
    let userid = req.body.userid;
    let result = await Post.findOneAndUpdate({ postid: jobid }, { assigned: userid });

    let responseData = {
      postid: result.postid,
      assigned: result.assigned,
    };

    res.json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






const handleFileUpload = async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const content = req.file.buffer.toString("base64");
    const data = JSON.stringify({
      message: "file uploaded",
      content: content,
    });

    const filename = req.file.originalname;
    const githubname = uuidv4();
    const config = {
      method: "put",
      url: `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/contents/${githubname}.pdf`,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const [githubResponse, savedFile] = await Promise.all([
      axios(config),
      Content.create({
        contentName: filename,
        pdfFile: config.url,
        author: req.query.token,
      }),
    ]);

    if (githubResponse.status !== 201) {
      throw new Error(
        `GitHub API request failed with status ${githubResponse.status}`
      );
    }

    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "failure" });
  }
};

module.exports = {
  scout,
  upload,
  handleFileUpload,
  accept
};
