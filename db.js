import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectToMongo = () => {
  mongoose
    .connect(process.env.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MONGO DB");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

