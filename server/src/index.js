import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { productRouter } from "./routes/product.js";
// import { router } from "./routes/user.js";
// import { router } from "./routes/user";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/product", productRouter);

mongoose.connect(
  "mongodb+srv://equilibriumwell:Fuck123@cluster3.iz0zjf2.mongodb.net/Cluster3"
);

app.listen(3001, () => console.log("Listening"));
