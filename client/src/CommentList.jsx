import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content = comment.content;

    if (comment.status === "pending") {
      content = "This comment is waiting moderation";
    }

    if (comment.status === "rejected") {
      content = "This comment has been rejected";
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <div>{renderedComments}</div>;
};

export default CommentList;
