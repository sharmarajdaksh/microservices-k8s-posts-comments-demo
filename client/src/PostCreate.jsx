import React from "react";
import axios from "axios";

const PostCreate = () => {
  const [title, setTitle] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    await axios.post("http://posts.com/posts/create", {
      title,
    });
    setTitle("");
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          name="title"
          className="form-control"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-2">Submit</button>
    </form>
  );
};

export default PostCreate;
