const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

const commentsByPostId = {};

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  res.send(commentsByPostId[postId] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  comments.push({ commentId, content, status: "pending" });
  commentsByPostId[postId] = comments;

  axios.post("http://event-bus-clusterip:5001/events/", {
    type: "CommentCreated",
    data: { postId, commentId, content, status: "pending" },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  const event = req.body;
  console.log(`Received event: ${event.type}`);

  if (event.type === "CommentModerated") {
    const { commentId, postId, status } = event.data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.commentId === commentId);
    comment.status = status;

    axios.post("http://event-bus-clusterip:5001/events/", {
      type: "CommentUpdated",
      data: { postId, ...comment },
    });
  }

  res.sendStatus(200);
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
