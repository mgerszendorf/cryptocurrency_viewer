const axios = require("axios");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://cryptocurrency_viewer_database:cryptocurrency_viewer_database@cluster0.jguvn.mongodb.net/cryptocurrency_viewer_database?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch((err: any) => {
    console.error("Error:", err);
  });

  // Middleware
  const authMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, data: any) => {
      if (err) {
        return res.sendStatus(403)
      }

      req.user = data;
      next();
    })
  }

// Sign in
let refreshTokens: Array<any> = []

app.post("/api/users/sign_in", async (req: any, res: any) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid username or password" });
  }

  const payload = {
    email: user.email,
    username: user.username,
    favoriteCryptocurrencies: user.favoriteCryptocurrencies,
    checkbox: user.checkbox,
  };

  if (await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)

    console.log(refreshTokens)

    return res.json({ status: 200, data: {'accessToken': accessToken, 'refreshToken': refreshToken}});
  }
});

// Refresh token

app.post('/api/users/refresh_token', (req: any, res: any) => {
  const { refreshToken } = req.body;

  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }
  
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err:any, data:any) => {
    if (err) {
      return res.sendStatus(403);
    }

    const payload = {
      email: data.email,
      username: data.username,
      favoriteCryptocurrencies: data.favoriteCryptocurrencies,
      checkbox: data.checkbox,
    }
    const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    return res.json({ status: 200, accessToken: newAccessToken});
  })
})

// Logout

app.post('./logout', (req: any, res: any) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== refreshToken)
  res.sendStatus(204)
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

  console.log(req.body)

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
    return res.json({
      status: "error",
      error: "The passwords are different from each other",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      email,
      password,
      checkbox,
      favoriteCryptocurrencies
    });
    console.log("User created successfully: ", response);
  } catch (err: any) {
    if (err.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Email already in use" });
    }
    throw err;
  }
  res.json({ status: "ok" });
});

// GET CRYPTO LIST

app.get("/api/get_crypto_list", (req: any, res: any) => {
  const options = {
    method: "GET",
    url: "https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0",
    headers: {
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response: any) => {
      res.json(response.data);
    })
    .catch((error: any) => {
      console.error(error);
    });
});

// GET CRYPTO HISTORY

app.post("/api/get_crypto_history", (req: any, res: any) => {
  const options = {
    method: "GET",
    url: `https://coinranking1.p.rapidapi.com/coin/${req.body.activeUuid}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=${req.body.timePeriod}`,
    headers: {
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response: any) => {
      res.json(response.data);
    })
    .catch((error: any) => {
      console.error(error);
    });
});

// GET COIN

app.post("/api/get_coin", (req: any, res: any) => {
  const options = {
    method: "GET",
    url: `https://coinranking1.p.rapidapi.com/coin/${req.body.activeUuid}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`,
    headers: {
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response: any) => {
      res.json(response.data);
    })
    .catch((error: any) => {
      console.error(error);
    });
});

// GET NEWS

app.post("/api/get_news", (req: any, res: any) => {
  const options = {
    method: "GET",
    url: `https://bing-news-search1.p.rapidapi.com/news/search?q=${req.body.newsCategory}&safeSearch=Off&textFormat=Raw&freshness=Day&count=100`,
    headers: {
      "X-BingApis-SDK": "true",
      "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response: any) => {
      res.json(response.data);
    })
    .catch((error: any) => {
      console.error(error);
    });
});

app.listen(8000, () => {
  console.log("Server running at 8000");
});