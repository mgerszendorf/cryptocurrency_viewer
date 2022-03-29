const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sd345dsfsd54~!@#$#@!@#bhjb2qiuhesd!@#$#@!@bhjdsfg839ujkdhfjk'

const app = express();
app.use(cors());
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(
    'mongodb+srv://cryptocurrency_viewer_database:cryptocurrency_viewer_database@cluster0.jguvn.mongodb.net/cryptocurrency_viewer_database?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch((err: any) => {
    console.error("Error:", err);
  });


// Sign in
  app.post('/api/users/sign_in', async (req: any, res: any) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).lean()
  
    if (!user) {
      return res.json({ status: 'error', error: 'Invalid username or password' })
    }
  
    if (await bcrypt.compare(password, user.password)) {
      // the username, password combination is successful
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email
        },
        JWT_SECRET
      )
  
      return res.json({ status: 'ok', data: token })
    }

    res.json({ status: 'error', error: 'Invalid username or password' })
  })

// Register
app.post("/api/users/register", async (req: any, res: any) => {
  const {
    username,
    email,
    password: plainTextPassword,
    confirmPassword,
    checkbox,
    favoriteCryptocurrencies
  } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  if (plainTextPassword !== confirmPassword) {
    return res.json({ status: "error", error: "The passwords are different from each other" });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      email,
      password,
      checkbox,
      favoriteCryptocurrencies,
    });
    console.log("User created successfully: ", response);
  } catch (err: any) {
    if (err.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Email already in use' })
		}
    throw err;
  }
  res.json({ status: "ok" });
});

app.listen(8000, () => {
  console.log("Server running at 8000");
});
