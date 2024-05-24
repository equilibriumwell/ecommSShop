import express from "express";
import { Router } from "express";
import { UserModel } from "../models/user.js";
import { UserErrors } from "../errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Registering user:", username);
    const user = await UserModel.findOne({ username });

    if (user) {
      console.log("Username already exists:", username);
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    console.log("User registered successfully:", username);
    res.json({ message: "User Registered Successfully!" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ type: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Logging in user:", username);
    const user = await UserModel.findOne({ username });

    if (!user) {
      console.log("User not found:", username);
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Wrong credentials for user:", username);
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
    }

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });

    console.log("Login successful for user:", username);
    res.json({ token, userID: user._id });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ type: err.message });
  }
});

// Token Verification Middleware
// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(" ")[1]; // Assuming "Bearer <token>"

//     jwt.verify(token, "secret", (err, user) => {
//       if (err) {
//         console.error("Token verification failed:", err);
//         return res.sendStatus(403); // Forbidden
//       }
//       req.user = user; // Optionally attach the user to the request
//       next();
//     });
//   } else {
//     console.log("Authorization header missing");
//     return res.sendStatus(401); // Unauthorized
//   }
// };

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, "secret", (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get("/available-money/:userID", verifyToken, async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    res.json({ availableMoney: user.availableMoney });
  } catch (err) {
    res.status(500).json({ err });
  }
});

export { router as userRouter };
