const mongooseSchema = require("mongoose");

const UserSchema = mongooseSchema.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    checkbox: { type: String, required: true },
    favoriteCryptocurrencies: [{ type: Object }],
  },
  {
    collection: "users",
  }
);

const model = mongooseSchema.model("UserSchema", UserSchema);

module.exports = model;
