import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { number, string } from "better-auth/*";
import paginationSortingHelper from "../../Helper/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
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
    res.status(400).json({
      data: "Post created failed",
      details: error,
    });
  }
};

const getPost = async (req: Request, res: Response) => {
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
      req.query
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
    res.status(400).json({
      data: "Post created failed",
      details: error,
    });
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

export const postController = {
  createPost,
  getPost,
  getPostById,
};
