import express from "express";
import User from "../models/user.js";
export const checkUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if ( !name || !email || !password ) {
    return res.status(404).json({ error: "Please fill the details" });
  }
  try {
    const userExist = User.findOne({ email: req.body.email });
    if (!userExist) next();
  } catch (err) {
    console.log(err.message);
  }
};
