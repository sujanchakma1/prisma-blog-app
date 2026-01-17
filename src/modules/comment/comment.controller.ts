import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    req.body.authorId = req.user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      data: "Comment created failed",
      details: error,
    });
  }
};

export const commentController = {
  createComment,
};
