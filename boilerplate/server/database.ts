import mongoose from "mongoose";

export const MONGO_URL = "mongodb://localhost:27017/wisertag";

try {
  mongoose.connect(MONGO_URL);
} catch (err) {
  mongoose.createConnection(MONGO_URL);
}

mongoose.connection
  .once("open", () => console.log("MongoDB Running"))
  .on("error", e => {
    throw e;
  });
