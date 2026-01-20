import e, { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../Helper/paginationSortingHelper";
import { UserRoles } from "../../Middleware/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    console.log(req.user);
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const searchType = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await postService.getPost({
      search: searchType,
      tags,
      isFeatured,
      status,
      authorId,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post ID is required");
    }

    const result = await postService.getPostById(postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      data: "Fetching post failed",
      details: error,
    });
  }
};

const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    console.log(user);
    if (!user) {
      throw new Error("User is required");
    }
    const result = await postService.getMyPosts(user.id as string);
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { postId } = req.params;
    if (!user) {
      throw new Error("User is required");
    }
    const isAdmin = user.role === UserRoles.ADMIN;
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id as string,
      isAdmin as boolean,
    );
    res.status(200).json(result);
  } catch (error: any) {
    next(error)
  }
};
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { postId } = req.params;
    if (!user) {
      throw new Error("User is required");
    }
    const isAdmin = user.role === UserRoles.ADMIN;
    const result = await postService.deletePost(
      postId as string,
      user.id as string,
      isAdmin as boolean,
    );
    res.status(200).json(result);
  } catch (error: any) {
    next(error)
  }
};
const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await postService.getStats();
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const postController = {
  createPost,
  getPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
