const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (event) => {
  if (event.type === "PostCreated") {
    const { id, title } = event.data;
    posts[id] = { id, title, comments: [] };
  }
  if (event.type === "CommentCreated") {
    const { commentId, postId, content, status } = event.data;
    posts[postId].comments.push({ commentId, content, status });
  }
  if (event.type === "CommentUpdated") {
    const { commentId, postId, content, status } = event.data;
    const comments = posts[postId].comments;
    const commentIndex = comments.findIndex(
      (comment) => comment.commentId === commentId
    );
    comments[commentIndex] = { commentId, postId, content, status };
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const event = req.body;

  console.log(`Received event: ${event.type}`);

  handleEvent(event);

  res.sendStatus(200);
});

const port = process.env.PORT || 4002;
app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
  const res = await axios.get("http://event-bus-clusterip:5001/events");
  const events = res.data;
  for (let event of events) {
    handleEvent(event);
  }
});
