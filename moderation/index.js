const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

const handleEvents = (event) => {
  if (event.type === "CommentCreated") {
    const { commentId, postId, content } = event.data;
    const moderatedStatus = content.includes("orange")
      ? "rejected"
      : "approved";

    axios.post("http://event-bus-clusterip:5001/events", {
      type: "CommentModerated",
      data: {
        commentId,
        postId,
        status: moderatedStatus,
        content,
      },
    });
  }
};

app.post("/events", (req, res) => {
  const event = req.body;

  handleEvents(event);

  res.sendStatus(200);
});

const port = process.env.PORT || 4003;
app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
  const res = await axios.get("http://event-bus-clusterip:5001/events");
  const events = res.data;
  for (let event of events) {
    handleEvent(event);
  }
});
