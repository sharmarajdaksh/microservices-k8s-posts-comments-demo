const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  console.log(`Received event: ${event.type}`);
  events.push(event);

  axios.post("http://posts-clusterip:4000/events", event);
  axios.post("http://comments-clusterip:4001/events", event);
  try {
    await axios.post("http://query-clusterip:4002/events", event);
  } catch (e) {}

  axios.post("http://moderation-clusterip:4003/events", event);

  res.sendStatus(200);
});

app.get("/events", (req, res) => {
  res.send(events);
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
