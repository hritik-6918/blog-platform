const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middleware/auth");

router.post("/", auth, commentController.addComment);
router.get("/", commentController.getComments);

module.exports = router;
