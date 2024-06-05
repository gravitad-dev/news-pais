const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
let dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.options("*", cors());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use("/", express.static(__dirname + "/views/index.html"));
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/news", express.static(__dirname + "/views/news.html"));
app.get("/news", async (req, res) => {
  const datos = {
    variable1: "valor1",
    variable2: "valor2",
  };
  res.render(__dirname + "/views/news.html", { datos });
});

//-----------------------------------------------------------------------
const apiProxy1 = createProxyMiddleware("/", {
  target: process.env.WEB_URL,
  changeOrigin: true,
});

const apiProxy2 = createProxyMiddleware("/2", {
  target: process.env.WEB_URL,
  changeOrigin: true,
});

app.get("/noadd", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:4001/business/`);
    const $ = cheerio.load(response.data);
    $(".leaderboard__container__2MbZl").remove(); // Eliminar todos los elementos con la clase 'clase-a-eliminar' del DOM
    res.send($.html());
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

app.use(apiProxy1);
app.use(apiProxy2);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
