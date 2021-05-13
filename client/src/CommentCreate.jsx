import React from "react";
import axios from "axios";

const CommentCreate = ({ postId }) => {
  const [comment, setComment] = React.useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    axios.post(`http://posts.com/posts/${postId}/comments`, {
      content: comment,
    });

    setComment("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="comment">New Comment</label>
          <input
            type="text"
            name="comment"
            id="comment"
            value={comment}
            className="form-control mt-2 mb-2"
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
