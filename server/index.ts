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

// MongoDB connection.
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
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, data: any) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = data;
    next();
  });
};

// Sign in
let refreshTokens: Array<any> = [];

app.post("/api/users/sign_in", async (req: any, res: any) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({
      status: 400,
      error: "Invalid username or password",
    });
  }

  const payload = {
    email: user.email,
    username: user.username,
    favoriteCryptocurrencies: user.favoriteCryptocurrencies,
    checkbox: user.checkbox,
  };

  if (await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "60m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    return res.json({
      status: 200,
      data: { accessToken: accessToken, refreshToken: refreshToken },
    });
  }
});

// Refresh token
app.post("/api/users/refresh_token", (req: any, res: any) => {
  const { refreshToken } = req.body;

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  try {
    const jwtClaims = jwt.verify(refreshToken, refreshTokenSecret);

    const payload = {
      email: jwtClaims.email,
      username: jwtClaims.username,
      favoriteCryptocurrencies: jwtClaims.favoriteCryptocurrencies,
      checkbox: jwtClaims.checkbox,
    };

    const newAccessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "60m",
    });
    const newRefreshToken = jwt.sign(payload, refreshTokenSecret);

    return res.json({
      status: 200,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    return res.json({ status: 401, error });
  }
});

// Logout

app.post("/logout", (req: any, res: any) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);
  res.sendStatus(204);
});

// Register
app.post("/api/users/register", async (req: any, res: any) => {
  const {
    username,
    email,
    password: plainTextPassword,
    confirmPassword,
    checkbox,
    favoriteCryptocurrencies,
  } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: 400, error: "Invalid username" });
  }

  if (!email || typeof email !== "string") {
    return res.json({ status: 400, error: "Invalid email" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: 400, error: "Invalid password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: 400,
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  if (plainTextPassword !== confirmPassword) {
    return res.json({
      status: 400,
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
      favoriteCryptocurrencies,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      // duplicate key
      return res.json({ status: 400, error: "Email already in use" });
    }
    throw err;
  }
  res.json({ status: 200 });
});

// Update favorite cryptocurrencies

app.post(
  "/api/update_favorite_cryptocurrencies",
  authMiddleware,
  (req: any, res: any) => {
    const { email, uuid, coinData } = req.body;

    User.findOne({ email }, (err: any, data: any) => {
      // if (
      //   data.favoriteCryptocurrencies.filter((e: any) => e.uuid === uuid).length >
      //   0
      // ) {
      //   console.log("ok");
      // }

      if (
        data.favoriteCryptocurrencies.filter((e: any) => e.uuid === uuid)
          .length > 0
      ) {
        User.findOneAndUpdate(
          { email },
          { $pull: { favoriteCryptocurrencies: { uuid: uuid } } },
          (err: any, data: any) => {}
        );
      } else {
        User.findOneAndUpdate(
          { email },
          { $addToSet: { favoriteCryptocurrencies: coinData } },
          function (error: any, success: any) {
            // if (error) {
            //   console.log("error" + error);
            // } else {
            //   console.log("success" + success);
            // }
          }
        );
      }

      User.findOne({ email }, (err: any, data: any) => {
        if (err) {
          console.log(err);
        }
        if (data != null) {
          if (!data.username) {
            return res.json({
              status: 200,
              favoriteCryptocurrencies: data.favoriteCryptocurrencies,
            });
          } else {
            console.log("null");
          }
        }
      });
    });
  }
);

// Get favorite cryptocurrencies

app.post("/api/get_favorite_cryptocurrencies", (req: any, res: any) => {
  const { email } = req.body;

  User.findOne({ email }, (err: any, data: any) => {
    if (err) {
      console.log(err);
    }
    if (data != null) {
      if (!data.username) {
        return res.json({
          status: 200,
          favoriteCryptocurrencies: data.favoriteCryptocurrencies,
        });
      } else {
        console.log("null");
      }
    }
  });
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

// GET COIN WITH THE POSSIBLITY OF CHANGING THE TIME

app.post("/api/get_coin_time", (req: any, res: any) => {
  const options = {
    method: "GET",
    url: `https://coinranking1.p.rapidapi.com/coin/${req.body.activeUuid}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=${req.body.timePeriod}`,
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
    url: `https://bing-news-search1.p.rapidapi.com/news/search?q=${req.body.newsCategory}&safeSearch=Off&textFormat=Raw&freshness=Day&count=${req.body.count}`,
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

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
