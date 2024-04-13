import JWT from "jsonwebtoken";
import User from "../models/user.js";

const requiredSignin = async (req, res, next) => {
  try {
    // console.log(req.headers);
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.SECRET_KEY
    );
    req.user = decode;
    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error,
      message: "error",
    });
  }
};

// admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAutherized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error,
      message: "error",
    });
  }
};

export { requiredSignin, isAdmin };
