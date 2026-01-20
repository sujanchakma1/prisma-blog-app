import { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.service";
import { NEVER } from "better-auth/*";

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body.authorId = req.user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
const getCommentsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.getCommentsById(commentId as string);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getCommentsByAuthorId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentsByAuthorId(
      authorId as string,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    const result = await commentService.deleteComment(
      commentId as string,
      user?.id as string,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    const result = await commentService.updateComment(
      commentId as string,
      req.body,
      user?.id as string,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const moderateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.moderateComment(
      commentId as string,
      req.body,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const commentController = {
  createComment,
  getCommentsById,
  getCommentsByAuthorId,
  deleteComment,
  updateComment,
  moderateComment,
};
