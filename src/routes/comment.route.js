const express = require("express");
const { postUserComment } = require("../controllers/comment.controller");
const commentRouter = express.Router();

commentRouter.post("/create", postUserComment);

module.exports = commentRouter;