const express = require("express");
const homeRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");
SECRET_KEY= "DailyDoor"

homeRouter.get('/', (req, res) => { 
    res.send("Daily Door API");
});

homeRouter.post('/', async(req,res)=>{
    console.log(req.body);
    const { firstname, lastname, username, email, password ,emptype, phone} = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
        firstName: firstname,
        lastName: lastname,
        username: username,
        email: email,
        empType: emptype,
        password: hashedpassword,
        phNo: phone
    });
    const token = jwt.sign({ email: result.email, id: result._id },SECRET_KEY);
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

homeRouter.post("/profile", async (req, res) => {
    try{
      const userid = req.body.token;
  
      const user = await userModel.findOne({ "token": userid } );
      return res.status(201).json(user);
  }catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  homeRouter.post("/googleauth", async (req, res) => {
    try {
      const googleToken = req.body.googleToken;
      const clientId = process.env.GOOGLE_CLIENT_ID; // Use environment variable
      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: clientId ,
      });
      const payload = ticket.getPayload();
      const email = payload.email;
  
      let existingUser = await userModel.findOne({ email: email });
      if (!existingUser) {
        const jwtToken = jwt.sign({ user: email, id: payload.name }, SECRET_KEY); 
        existingUser = await userModel.create({
          username: payload.name,
          email: email,
          img: payload.picture,
          token: jwtToken
        });
      }
      res.status(201).json({
        user: existingUser.username,
        email: existingUser.email,
        img: existingUser.img,
        token: existingUser.token,
      });
    } catch (error) {
      console.error("Google token verification failed:", error);
      res.status(401).json({ error: "Unauthorized" });
    }
  });
  
  
  

module.exports = homeRouter;