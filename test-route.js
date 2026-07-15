const express = require('express');
const app = express();
app.use("/api/generate-full", (req, res, next) => { console.log("middleware"); next(); });
const router = express.Router();
router.post("/generate-full", (req, res) => { res.send("matched"); });
app.use("/api", router);
app.post("*", (req, res) => res.send("fallback"));

const request = require('supertest');
request(app).post("/api/generate-full").expect(200).then(res => console.log(res.text));
