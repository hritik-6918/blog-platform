const Blog = require("../models/blog");

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.create({ title, content, author_id: req.user.id });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const blogs = await Blog.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
    res.json({
      total: blogs.count,
      pages: Math.ceil(blogs.count / limit),
      currentPage: page,
      data: blogs.rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author_id !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    await blog.update(req.body);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author_id !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    await blog.destroy();
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
