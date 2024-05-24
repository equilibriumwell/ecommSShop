// import { Schema, model } from "mongoose";

// const UserSchema = new Schema({
//   username: {
//     required: "true",
//     unique: "true",
//   },
//   password: {
//     required: "true",
//   },
//   availableMoney: {
//     default: 5000,
//   },
// });

// export const UserModel = model("user", UserSchema);

import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String, // Specify the type of the field
    required: true, // Set required to true (without quotes)
    unique: true, // Set unique to true (without quotes)
  },
  password: {
    type: String, // Specify the type of the field
    required: true, // Set required to true (without quotes)
  },
  availableMoney: {
    type: Number, // Specify the type of the field
    default: 5000, // Default value
  },
  purchasedItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "product",
      default: [],
    },
  ],
});

export const UserModel = model("User", UserSchema);
