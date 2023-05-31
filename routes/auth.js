import express from "express";
const router = express.Router();
import User from "../models/user.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchUser from "../middleware/fetchUser.js";
//const user = require("./models/user");

router.get("/", (req, res) => {
  res.send("User resgisted successfully");
  console.log(req.body.name);
});

//Route 1: Create a user using post and does not require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("password", "Please enter the password of length 5").isLength({
      min: 5,
    }),
    body("email", "the Email must have a @gmail.com syntax").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(404).json({ error: "Please fill the details" });
    }
    try {
      const userExist = await User.findOne({ email: email });
      if (userExist)
        return res.json({ error: "The user already exits .Please log in" });
      else {
        const salt = await bcrypt.genSalt();
        const secpassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: secpassword });
        const savedUser = await user.save();
        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        console.log(authToken);
        //res.json({ authToken });

        if (savedUser)
          return res.status(200).json("User resgistered successfully");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
);
// Route2: Login user
router.post(
  "/login",
  [
    body("email", "the Email must have a @gmail.com syntax").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const userExist = await User.findOne({ email: email });
      if (!userExist) {
        res
          .status(400)
          .json({ error: "Please try to log in with correct credentials" });
      }
      const passwordcompare = await bcrypt.compare(
        password,
        userExist.password
      );
      if (!passwordcompare) {
        res
          .status(400)
          .json({ error: "Please try to log in with correctt credentials" });
      }
      const data = {
        user: {
          id: userExist.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json(authToken);
      console.log(userExist.name);
    } catch (err) {
      console.log(err.message);
    }
  }
);

//Route 3 :get user details and login required
router.post("/getuser", fetchUser , async (req, res) => {
  try {
    const userId  = req.user.id;
    const user = await User.findById(userId);
    res.send(user)
  } catch (error) {
    console.log(error.message);
  }
});
export default router;
