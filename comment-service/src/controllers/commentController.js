const Comment = require("../models/comment");

exports.addComment = async (req, res) => {
  try {
    const { content, blog_id } = req.body;
    const comment = await Comment.create({
      content,
      blog_id,
      author_id: req.user.id,
      parent_id: null,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const blog_id = req.query.post_id;
    if (!blog_id)
      return res.status(400).json({ message: "post_id is required" });
    const comments = await Comment.findAll({
      where: { blog_id, parent_id: null },
      order: [["created_at", "ASC"]],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
